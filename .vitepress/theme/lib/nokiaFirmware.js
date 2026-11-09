import { NokiaConsole, bounded, cancelled, checkAbort, normalize, commandFailed } from './nokiaConsole.js';
import { inspectNokiaImage, crc32Hex, NOKIA_SLOT_SIZE } from './nokiaImage.js';
import { sendYmodem } from './ymodem.js';

// Inspected G-010S-A legacy boot chain. Values are compared, never executed by
// this tool. Device identifiers, optical calibration and network settings are
// deliberately absent. Unknown boot scripts require another reviewed profile.
export const NOKIA_BOOT_PROFILE = Object.freeze({
    "bootcmd": "run flash_flash",
    "flash_flash": "run select_image boot_image",
    "boot_image": "run boot_image${c_img};",
    "boot_image0": "run kernel0_from_sf flashargs addip addmtdparts0 addmisc && bootm ${ram_addr}",
    "boot_image1": "run kernel1_from_sf flashargs addip addmtdparts1 addmisc && bootm ${ram_addr}",
    "kernel0_from_sf": "sf probe 0;sf read ${ram_addr} ${kernel0_offs} ${max_kernel_size}",
    "kernel1_from_sf": "sf probe 0;sf read ${ram_addr} ${kernel1_offs} ${max_kernel_size}",
    "addmtdparts0": "setenv mtdparts mtdparts=sflash:256k(uboot)ro,512k(uboot_env),6144k(linux),6144k(image1),1024k(configfs),2112k(logfs),64k(ri),64k(sfp),64k(ribackup)",
    "addmtdparts1": "setenv mtdparts mtdparts=sflash:256k(uboot)ro,512k(uboot_env),6144k(image0),6144k(linux),1024k(configfs),2112k(logfs),64k(ri),64k(sfp),64k(ribackup)",
    "kernel0_offs": "0xC0000",
    "kernel1_offs": "0x6C0000",
    "ram_addr": "80F00000",
    "max_kernel_size": "180000",
    "select_image": "if test -n $commit  ; then else setenv commit  _err;saveenv;fi;if test -n $image0_is_valid ; then else setenv image0_is_valid 1;saveenv;fi;if test -n $image1_is_valid ; then else setenv image1_is_valid 0;saveenv;fi;if itest *${magic_addr} == ${magic_val} ; then if itest *${act_img_addr} == 0 ; then setenv next_active 0;fi;if itest *${act_img_addr} == 1 ; then setenv next_active 1;fi;mw ${magic_addr} 0x0;mw ${act_img_addr} 0x0;fi;if test $next_active = -1 ; then setenv c_img $commit;else setenv c_img $next_active;if test $next_active != $commit ;then if test $next_active = 0 ;then setenv next_active 1;setenv commit 1;else setenv next_active 0;setenv commit 0;fi;saveenv;fi;fi;exit 0",
    "magic_addr": "0xBF200038",
    "magic_val": "0xDEADBEEF",
    "act_img_addr": "0xBF20003C",
    "addip": "setenv bootargs ${bootargs} ip=${ipaddr}:${serverip}:${gatewayip}:${netmask}:${hostname}:${netdev}:off",
    "update_system": "run update_image0 && setenv commit 0 && setenv image0_is_valid 1 && saveenv",
    "flashargs": "setenv bootargs rootfstype=squashfs,jffs2",
    "addmisc": "setenv bootargs ${bootargs} ethaddr=${ethaddr} machtype=${machtype}  vpe1_load_addr=0x83f00000 vpe1_mem=1M mem=63M ${mtdparts} quiet"
});

// Exact boot migration used by the inspected Nokia image /lib/upgrade/common.sh.
// Applying it after readback avoids a second sysupgrade overwriting the old slot.
export const NOKIA_UPGRADE_SETTINGS = Object.freeze({
    "boot_fail": "0",
    "boot_image": "run boot_image${c_img};",
    "update_system": "run update_image0 && setenv committed_image 0 && setenv image0_is_valid 1 && saveenv",
    "select_image": "if test -n $committed_image ; then else setenv committed_image 0;saveenv;fi;if test -n $image0_is_valid ; then else setenv image0_is_valid 1;saveenv;fi;if test -n $image1_is_valid ; then else setenv image1_is_valid 0;saveenv;fi;if itest *${magic_addr} == ${magic_val} ; then if itest *${act_img_addr} == 0 ; then setenv next_active 0;fi;if itest *${act_img_addr} == 1 ; then setenv next_active 1;fi;mw ${magic_addr} 0x0;mw ${act_img_addr} 0x0;fi;if test $next_active = -1 ; then setenv c_img $committed_image;else setenv c_img $next_active;if test $next_active != $committed_image ;then if test $next_active = 0 ;then setenv next_active 1;setenv committed_image 1;else setenv next_active 0;setenv committed_image 0;fi;saveenv;fi;fi;setenv boot_fail 0;exit 0"
});

const VERSION = 'U-Boot 2015.04-lantiq-gpon-1.3.6.1 (Feb 07 2018 - 17:12:06)';
const RAM = 0x80800000;
const OFFSETS = [0x0c0000, 0x6c0000];
const CONTROLS = ['commit', 'committed_image', 'next_active', 'c_img', 'image0_is_valid', 'image1_is_valid',
    'boot_fail', 'asc0', 'bootdelay', 'preboot'];
const KEYS = [...Object.keys(NOKIA_BOOT_PROFILE), ...CONTROLS];
const hex = n => '0x' + n.toString(16);
const canonical = value => value?.trim().replace(/\s+/g, ' ');

function problem(code, message) {
    return Object.assign(new Error(message), { name: 'NokiaFirmwareError', code });
}

function nonce() {
    return '__NOKIA_FLASH_' + Array.from(crypto.getRandomValues(new Uint8Array(12)),
        n => n.toString(16).padStart(2, '0')).join('') + '__';
}

async function checked(serial, command, timeoutMs) {
    const token = nonce();
    // The inspected bootloader's readline buffer is 1024 bytes. Keep the
    // complete quoted assignment, success marker and CR within that bound.
    if (command.length + token.length + 11 > 1022) throw problem('COMMAND_LENGTH', 'The bootloader command exceeds its inspected input limit.');
    const response = await serial.command(`${command} && echo ${token}`, timeoutMs);
    if (commandFailed(response) || !normalize(response).split('\n').some(line => line.trim() === token)) {
        throw problem('COMMAND_FAILED', `U-Boot did not confirm ${command.split(' ')[0]}. No further commands will be sent.`);
    }
    return response;
}

async function readEnvironment(serial) {
    const result = {};
    for (const key of KEYS) {
        const command = `printenv ${key}`;
        const response = await serial.command(command);
        const lines = normalize(response).split('\n').map(s => s.trim()).filter(s =>
            s && s !== command && s !== `FALCON => ${command}`);
        if (lines.length === 1 && lines[0] === `## Error: "${key}" not defined`) {
            result[key] = null;
        } else if (lines.length === 1 && lines[0].startsWith(key + '=')) {
            result[key] = lines[0].slice(key.length + 1);
        } else {
            throw problem('ENVIRONMENT', `Could not reliably read ${key}. The firmware was not written.`);
        }
    }
    return result;
}

function sameEnvironment(a, b) {
    return KEYS.every(key => a[key] === b[key]);
}

/** Choose the slot opposite the persistent committed slot, never saved c_img. */
export function planNokiaFlash(settings, image, bootMode = 'trial') {
    if (!['stage', 'trial', 'commit'].includes(bootMode)) throw problem('BOOT_MODE', 'Choose staging, a trial boot or a new default image.');
    const upgraded = canonical(settings.select_image) === canonical(NOKIA_UPGRADE_SETTINGS.select_image);
    for (const [key, expected] of Object.entries(NOKIA_BOOT_PROFILE)) {
        const supported = upgraded && key in NOKIA_UPGRADE_SETTINGS ? NOKIA_UPGRADE_SETTINGS[key] : expected;
        if (canonical(settings[key]) !== canonical(supported)) {
            throw problem('UNSUPPORTED_LAYOUT', `The ${key} setting does not match the supported Nokia boot profile. This tool will not guess a flash layout or rewrite unknown boot scripts.`);
        }
    }
    const committed = settings[upgraded ? 'committed_image' : 'commit'];
    if (!/^[01]$/.test(committed ?? '') ||
        ![committed, '-1'].includes(settings.next_active)) {
        throw problem('BOOT_STATE', 'The committed image is ambiguous or a trial boot is pending. Boot and confirm the working image before flashing.');
    }
    const protectedSlot = Number(committed);
    const targetSlot = 1 - protectedSlot;
    if (settings[`image${protectedSlot}_is_valid`] !== '1' ||
        !/^[01]$/.test(settings[`image${targetSlot}_is_valid`] ?? '') ||
        !/^[0-7]$/.test(settings.boot_fail ?? '')) {
        throw problem('BOOT_STATE', 'The image validity or boot-failure state is not supported. Review the bootloader before flashing.');
    }
    const delay = Number(settings.bootdelay);
    if (settings.asc0 !== '0' || !/^\d+$/.test(settings.bootdelay ?? '') ||
        !Number.isSafeInteger(delay) || delay < 1 || delay > 0x7fffffff ||
        ![null, ''].includes(settings.preboot)) {
        throw problem('UART_SETTINGS', 'Enable UART with a positive boot delay and clear the known Nokia preboot setting using Configure Nokia UART first.');
    }
    if (!Number.isSafeInteger(image.size) || image.size <= 0 || image.size > NOKIA_SLOT_SIZE ||
        image.slotSize !== NOKIA_SLOT_SIZE || image.kernelSize + 64 > 0x180000) {
        throw problem('IMAGE_SIZE', 'The image does not fit the Nokia slot or the bootloader kernel read window.');
    }
    return Object.freeze({ protectedSlot, targetSlot, offset: OFFSETS[targetSlot],
        slotSize: NOKIA_SLOT_SIZE, bootMode, bootProfile: upgraded ? '19.07' : 'legacy',
        migrateBootScripts: bootMode !== 'stage' && !upgraded, image: Object.freeze({ ...image }) });
}

async function inspectDevice(serial) {
    const version = await serial.command('version');
    if (!normalize(version).split('\n').some(line => line.trim() === VERSION)) {
        throw problem('BOOTLOADER', 'This bootloader version has not been validated for Nokia browser flashing. Nothing was written.');
    }
    const settings = await readEnvironment(serial);
    for (const command of ['loady', 'sf', 'crc32']) {
        const response = await serial.command(`help ${command}`);
        if (commandFailed(response) || !new RegExp(`\\b${command}\\b`).test(response)) {
            throw problem('CAPABILITY', `The bootloader does not expose the required ${command} command.`);
        }
    }
    const info = await serial.command('bdinfo');
    const start = /\bmemstart\s*=\s*(?:0x)?([0-9a-f]+)/i.exec(info);
    const size = /\bmemsize\s*=\s*(?:0x)?([0-9a-f]+)/i.exec(info);
    if (commandFailed(info) || !start || !size || parseInt(start[1], 16) !== 0x80000000 ||
        parseInt(size[1], 16) < 0x04000000) {
        throw problem('MEMORY', 'Could not verify the Nokia RAM range for image transfer and readback.');
    }
    const flash = await checked(serial, 'sf probe 0');
    if (!/\btotal\s+16\s+MiB\b/i.test(flash)) {
        throw problem('FLASH_SIZE', 'The SPI flash was not identified as a 16 MiB device. Nothing was erased.');
    }
    return settings;
}

async function verifyCrc(serial, size, expected, timeoutMs) {
    const response = await checked(serial, `crc32 ${hex(RAM)} ${hex(size)}`, timeoutMs);
    const matches = [...response.matchAll(/CRC32\s+for\s+(?:0x)?([0-9a-f]+)\s*\.\.\.\s*(?:0x)?([0-9a-f]+)\s*==>\s*([0-9a-f]{8})\b/gi)];
    if (matches.length !== 1 || parseInt(matches[0][1], 16) !== RAM ||
        parseInt(matches[0][2], 16) !== RAM + size - 1 || matches[0][3].toLowerCase() !== expected) {
        throw problem('CRC_MISMATCH', 'The device CRC32 does not match the expected bytes. No further writes will be made.');
    }
}

async function loadIntoRam(serial, data, image, { signal, onProgress, transferTimeoutMs, commandTimeoutMs }) {
    const readyDeadline = Date.now() + commandTimeoutMs;
    await serial.write(`loady ${hex(RAM)}\r`, readyDeadline);
    let banner = '';
    while (!banner.endsWith('\n')) {
        if (banner.length > 4096) throw problem('YMODEM_READY', 'Unexpected output before the YMODEM receiver started.');
        banner += String.fromCharCode(await serial.readByte(readyDeadline, signal));
        if (banner.endsWith('\n') && !/Ready for binary \(ymodem\) download/i.test(banner)) banner = '';
    }
    if (!/Ready for binary \(ymodem\) download to 0x80800000 at 115200 bps/i.test(banner)) {
        throw problem('YMODEM_READY', 'The YMODEM receiver did not confirm the expected RAM address and baud rate.');
    }
    await sendYmodem(serial, data, { signal, filename: 'nokia-firmware.image',
        transferTimeoutMs, onProgress: sent => onProgress(sent, data.length) });
    const response = await serial.waitPrompt(Date.now() + commandTimeoutMs);
    const size = /Total Size\s*=\s*0x([0-9a-f]+)\s*=\s*(\d+)\s+Bytes/i.exec(response);
    if (commandFailed(response) || !size || parseInt(size[1], 16) !== data.length || Number(size[2]) !== data.length) {
        throw problem('TRANSFER_SIZE', 'U-Boot did not confirm the exact received file size. Nothing was erased.');
    }
    await verifyCrc(serial, image.size, image.crc32, commandTimeoutMs);
}

/**
 * Internal orchestration over a verified console and an inspected image.
 * Kept separate for transcript tests; the browser entry point below always
 * snapshots and validates the file before opening a serial port.
 */
export async function runNokiaFlashSession(serial, { data, metadata: image }, {
    signal, bootMode = 'trial', onStatus = () => {}, onProgress = () => {},
    onPhase = () => {}, onBackup = () => {}, confirmFlash,
    commandTimeoutMs = 10000, flashTimeoutMs = 180000, transferTimeoutMs = 30 * 60 * 1000
} = {}) {
    let phase = 'inspect';
    let flashStarted = false;
    let activationStarted = false;
    const status = (next, message) => { phase = next; onPhase(next); onStatus(message); };
    try {
        if (data.length !== image.size || crc32Hex(data) !== image.crc32) throw problem('IMAGE_CHANGED', 'The inspected image bytes changed.');
        status('inspect', 'Checking the Nokia bootloader, flash layout and committed image.');
        const before = await inspectDevice(serial);
        const plan = planNokiaFlash(before, image, bootMode);
        const expectedSlot = new Uint8Array(NOKIA_SLOT_SIZE).fill(0xff);
        expectedSlot.set(data);
        const slotCrc = crc32Hex(expectedSlot);
        await bounded(Promise.resolve(onBackup({ model: 'Nokia G-010S-A',
            profile: VERSION, capturedAt: new Date().toISOString(), settings: { ...before },
            image: { ...image }, plan: { ...plan } })), undefined, signal);
        status('review', `Review the image and slot ${plan.targetSlot}. Committed slot ${plan.protectedSlot} will be preserved.`);
        checkAbort(signal);
        if (typeof confirmFlash !== 'function' ||
            await bounded(Promise.resolve(confirmFlash(plan)), undefined, signal) !== true) throw cancelled();
        await serial.acquire();
        if (!sameEnvironment(before, await inspectDevice(serial))) {
            throw problem('SETTINGS_CHANGED', 'The boot configuration changed during confirmation. Nothing was erased; reconnect and review the new state.');
        }
        status('transfer', 'Sending the image to RAM over YMODEM at 115200 baud.');
        await loadIntoRam(serial, data, image, { signal, onProgress, transferTimeoutMs, commandTimeoutMs });
        // A several-minute transfer is not a reason to trust stale boot state.
        if (!sameEnvironment(before, await readEnvironment(serial))) {
            throw problem('SETTINGS_CHANGED', 'The boot configuration changed during transfer. Nothing was erased.');
        }
        checkAbort(signal);
        status('erase', `Erasing only slot ${plan.targetSlot}. Keep the module powered.`);
        checkAbort(signal);
        flashStarted = true;
        await checked(serial, `sf erase ${hex(plan.offset)} ${hex(plan.slotSize)}`, flashTimeoutMs);
        status('write', `Writing ${image.size} bytes to slot ${plan.targetSlot}. Keep the module powered.`);
        await checked(serial, `sf write ${hex(RAM)} ${hex(plan.offset)} ${hex(image.size)}`, flashTimeoutMs);
        status('verify', 'Reading the entire slot back, including its erased tail, and checking CRC32.');
        await checked(serial, `sf read ${hex(RAM)} ${hex(plan.offset)} ${hex(plan.slotSize)}`, flashTimeoutMs);
        await verifyCrc(serial, plan.slotSize, slotCrc, flashTimeoutMs);
        if (bootMode !== 'stage') {
            status('activate', bootMode === 'trial'
                ? 'Updating the supported boot scripts and saving a one-time trial. The previous image remains the default.'
                : 'Updating the supported boot scripts and saving the verified image as the default.');
            if (!sameEnvironment(before, await readEnvironment(serial))) throw problem('SETTINGS_CHANGED', 'Boot settings changed before activation.');
            checkAbort(signal);
            activationStarted = true;
            // The legacy do_bootm hook increments/saves boot_fail and flips
            // slots at its threshold. Use the exact image's migration, whose
            // selector resets that counter before every normal boot. A single
            // boot_fail=0 assignment would only postpone an unexpected flip.
            const after = { ...before, ...NOKIA_UPGRADE_SETTINGS,
                [`image${plan.targetSlot}_is_valid`]: '1',
                committed_image: String(bootMode === 'commit' ? plan.targetSlot : plan.protectedSlot),
                next_active: String(plan.targetSlot) };
            for (const key of ['boot_image', 'update_system', 'select_image', `image${plan.targetSlot}_is_valid`,
                'boot_fail', 'committed_image', 'next_active']) {
                if (before[key] === after[key]) continue;
                // All values come from the fixed inspected migration or a
                // validated slot number. Quotes defer ${...} until boot time.
                const value = after[key];
                if (!/^[\x20-\x7e]+$/.test(value) || /['\\]/.test(value)) throw problem('ENVIRONMENT', 'The migration value cannot be quoted safely.');
                await checked(serial, `setenv ${key} '${value}'`);
            }
            if (!sameEnvironment(after, await readEnvironment(serial))) throw problem('SETTINGS_CHANGED', 'The proposed boot settings did not read back correctly.');
            await checked(serial, 'saveenv', flashTimeoutMs);
        }
        status('success', bootMode === 'stage'
            ? `Slot ${plan.targetSlot} verified. Boot selection is unchanged; the module remains at U-Boot.`
            : `Slot ${plan.targetSlot} verified and ${bootMode === 'trial' ? 'selected for one trial' : 'saved as the default'}. Cold power-cycle the module, then check UART and network access. The previous firmware slot was not erased.`);
        return Object.freeze({ protectedSlot: plan.protectedSlot, targetSlot: plan.targetSlot,
            offset: plan.offset, size: image.size, sha256: image.sha256, bootMode, verified: true });
    } catch (error) {
        if (activationStarted) {
            throw problem('SAVE_UNCERTAIN', `The firmware slot passed readback verification, but its boot settings may not be saved (${error.message}). Keep power connected and inspect the console before rebooting. The original firmware slot was not erased.`);
        }
        if (flashStarted) {
            throw problem('FLASH_UNCERTAIN', `Flashing stopped during ${phase} (${error.message}). The target slot may be incomplete. Keep power connected until any flash operation finishes, then inspect the console. The original committed slot was not erased and no new boot selection was saved.`);
        }
        throw error;
    }
}

/** Public browser entry point: no image-validation or device-profile bypass. */
export async function flashNokiaFirmware(port, input, options = {}) {
    const { signal, startupTimeoutMs = 45000, commandTimeoutMs = 10000, ioTimeoutMs = 5000,
        flashTimeoutMs = 180000, transferTimeoutMs = 30 * 60 * 1000 } = options;
    for (const value of [startupTimeoutMs, commandTimeoutMs, ioTimeoutMs, flashTimeoutMs, transferTimeoutMs]) {
        if (!Number.isFinite(value) || value <= 0) throw new TypeError('Serial timeouts must be positive finite numbers.');
    }
    checkAbort(signal);
    const data = Uint8Array.from(input);
    const metadata = await inspectNokiaImage(data);
    checkAbort(signal);
    const serial = new NokiaConsole(port, { signal, baudRate: 115200, startupTimeoutMs, commandTimeoutMs, ioTimeoutMs });
    try {
        options.onPhase?.('connect');
        options.onStatus?.('Opening the serial port. Power-cycle the Nokia when prompted.');
        await serial.open();
        options.onStatus?.('Serial port open. Power-cycle the module now, or leave it at an existing FALCON prompt.');
        await serial.acquire();
        return await runNokiaFlashSession(serial, { data, metadata }, options);
    } finally {
        await serial.close();
    }
}
