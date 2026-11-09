// Configure the Nokia G-010S-A UART without flashing firmware.
import { NokiaConsole, failure, cancelled, checkAbort, bounded, normalize, commandFailed } from './nokiaConsole.js';

const VARIABLES = ['asc0', 'bootdelay', 'preboot'];

async function readSettings(serial) {
    const settings = {};
    for (const variable of VARIABLES) {
        const command = `printenv ${variable}`;
        const response = await serial.command(command);
        const lines = normalize(response).split('\n').map(line => line.trim()).filter(line =>
            line && line !== command && line !== `FALCON => ${command}`);
        const missing = new RegExp(`^## Error: ["']?${variable}["']? not defined$`, 'i');
        if (lines.length === 1 && missing.test(lines[0])) {
            settings[variable] = null;
        } else if (lines.length === 1 && lines[0].startsWith(variable + '=') && !commandFailed(response)) {
            settings[variable] = lines[0].slice(variable.length + 1);
        } else {
            throw failure('COMMAND_FAILED', `Could not reliably read ${variable}. No further changes will be made; check the serial console and U-Boot environment.`);
        }
    }
    return settings;
}

function sameSettings(a, b) {
    return VARIABLES.every(variable => a[variable] === b[variable]);
}

/**
 * Enable the Nokia G-010S-A UART from an already accessible U-Boot console.
 * Missing environment variables are represented by null. onBackup receives the
 * three original settings; confirmChanges must explicitly return true before
 * any mutation. Success leaves U-Boot paused, ready for a manual power cycle.
 * Timeout overrides are useful for slower adapters and deterministic tests.
 */
export async function enableNokiaSerial(port, {
    signal, onStatus = () => {}, onBackup = () => {}, confirmChanges,
    baudRate = 115200, startupTimeoutMs = 45000, commandTimeoutMs = 5000, ioTimeoutMs = 5000
} = {}) {
    for (const timeout of [startupTimeoutMs, commandTimeoutMs, ioTimeoutMs]) {
        if (!Number.isFinite(timeout) || timeout <= 0) throw new TypeError('Serial timeouts must be positive finite numbers.');
    }
    const serial = new NokiaConsole(port, { signal, baudRate, startupTimeoutMs, commandTimeoutMs, ioTimeoutMs });
    try {
        onStatus('Opening the serial port.');
        await serial.open();
        onStatus('Serial port open. Power-cycle the Nokia G-010S-A now if it is already running.');
        await serial.acquire();
        onStatus('FALCON console verified. Reading the current UART settings.');
        const before = await readSettings(serial);
        await bounded(Promise.resolve(onBackup({ ...before })), undefined, signal);
        if (before.asc0 !== null && !/^[0-3]$/.test(before.asc0)) {
            throw failure('UNEXPECTED_ASC0', 'The module has an unexpected asc0 value. Its original settings were captured, but no settings were changed. Review the bootloader configuration manually.');
        }
        const preboot = (before.preboot ?? '').trim().replace(/\s+/g, ' ');
        if (!['', 'gpio clear 100', 'run start_netconsole'].includes(preboot)) {
            throw failure('UNSAFE_PREBOOT', 'The module has a custom preboot command. Its original settings were captured, but no settings were changed. Review preboot manually before enabling UART.');
        }
        const delay = Number(before.bootdelay);
        const positiveDelay = /^\d+$/.test(before.bootdelay ?? '') && Number.isSafeInteger(delay) && delay > 0 && delay <= 0x7fffffff;
        const after = { asc0: '0', bootdelay: positiveDelay ? before.bootdelay : '5', preboot: null };
        if (sameSettings(before, after)) {
            onStatus('UART is already enabled with a positive boot delay. No settings were changed. U-Boot remains paused.');
            return { before, after, changed: false, saved: false };
        }
        onStatus('Review the original settings and proposed changes before saving.');
        checkAbort(signal);
        if (typeof confirmChanges !== 'function' ||
            await bounded(Promise.resolve(confirmChanges({ before: { ...before }, after: { ...after } })), undefined, signal) !== true) {
            throw cancelled();
        }
        // The module could have rebooted, disconnected, or been changed while
        // the user reviewed the proposal. Obtain a fresh prompt and readback.
        await serial.acquire();
        if (!sameSettings(await readSettings(serial), before)) {
            throw failure('SETTINGS_CHANGED', 'The U-Boot settings changed while confirmation was pending. Nothing was written; start again to review the current values.');
        }
        onStatus('Applying the confirmed Nokia UART settings.');
        for (const variable of VARIABLES) {
            if (before[variable] === after[variable]) continue;
            const command = `setenv ${variable}` + (after[variable] === null ? '' : ` ${after[variable]}`);
            if (commandFailed(await serial.command(command))) {
                throw failure('COMMAND_FAILED', `U-Boot rejected ${variable}. Changes have not been saved to flash; power-cycle to discard the temporary settings.`);
            }
        }
        if (!sameSettings(await readSettings(serial), after)) {
            throw failure('COMMAND_FAILED', 'UART settings did not match the requested values. Changes have not been saved to flash; power-cycle to discard the temporary settings.');
        }
        onStatus('Settings verified. Saving the U-Boot environment.');
        checkAbort(signal);
        let saved;
        try {
            saved = await serial.command('saveenv');
        } catch (error) {
            throw failure('SAVE_FAILED', `The saveenv operation was interrupted (${error.message}). The saved state is uncertain; keep power connected and inspect the console before rebooting.`);
        }
        if (commandFailed(saved) || !/\b(?:done|ok)[.!]?\s*$/i.test(saved)) {
            throw failure('SAVE_FAILED', 'U-Boot did not confirm a successful saveenv. The saved state is uncertain; keep power connected and inspect the console before rebooting.');
        }
        onStatus('UART settings saved. U-Boot remains paused; power-cycle the module to boot normally.');
        return { before, after, changed: true, saved: true };
    } finally {
        await serial.close();
    }
}
