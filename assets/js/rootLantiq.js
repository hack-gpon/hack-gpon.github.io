async function waitUbootStop(writer, reader, outputMsgCallback) {
    const interval = setInterval(function() {
        writer.write(String.fromCharCode(3));
    }, 10);

    while (true) {
        const { value, done } = await reader.read();

        if (value.startsWith('U-Boot')) {
            outputMsgCallback("Root in progress: Trigger characters received. DO NOT TOUCH THE HUAWEI MA5671A UNTIL THE PROCEDURE IS COMPLETED!");
            await delay(5000);
            clearInterval(interval);
            break;
        }
    }
}

async function checkUbootUnlocked(reader) {
    while (true) {
        try {
            const { value, done } = await Promise.race([
                reader.read(),
                new Promise((_, reject) => setTimeout(reject, 2000, new Error("timeout")))
            ]);

            if (value.startsWith('Press SPACE to delay and Ctrl-C to abort autoboot')) {
                return true;
            }
        } catch (err) {
            return false;
        }
    }
}

async function waitFailbackShell(writer, reader, outputMsgCallback) {
    while (true) {
        const { value, done } = await reader.read();

        if (value.startsWith('Press the [f] key and hit [enter] to enter failsafe mode')) {
            const interval = setInterval(function() {
                writer.write('f\n');
            }, 10);

            outputMsgCallback("Root in progress: Trigger characters received. Waiting for boot to end...",1);
            await delay(3000);
            clearInterval(interval);
            break;
        }
    }

    const interval = setInterval(function() {
        writer.write(String.fromCharCode(10));
    }, 10);

    while (true) {
        const { value, done } = await reader.read();

        if (value.includes('root@(none)')) {
            await delay(1000);
            clearInterval(interval);
            break;
        }
    }
}

async function lantiqRootUboot(port, outputMsgCallback, outputErrorCallback, successCallback, baudRate = 115200) {
    outputMsgCallback("Please disconnect the Huawei MA5671A from the SFP adapter if it is currently plugged in!");

    const { reader, writer, readableStreamClosed, writerStreamClosed } = await openPortLineBreak(port, baudRate, outputErrorCallback);

    try {
        await delay(10000);
        outputMsgCallback("Now you need to insert the Huawei MA5671A into the SFP adapter, if the procedure does not go ahead, check the connections and then remove and reconnect the Huawei MA5671A again",0);

        while(true) {
            await waitUbootStop(writer, reader, outputMsgCallback);
            const ubootUnlocked = await checkUbootUnlocked(reader);

            if (ubootUnlocked == true) {
                break;
            }

            outputMsgCallback("Root in progress: Set U-Boot bootdelay to 5...");
            writer.write('setenv bootdelay 5\n');
            await delay(1000);
            outputMsgCallback("Root in progress: Enable ASC serial...");
            writer.write('setenv asc0 0\n');
            await delay(1000);
            outputMsgCallback("Root in progress: Set GPIO to unlock serial...");
            writer.write('setenv preboot "gpio set 3;gpio input 2;gpio input 105;gpio input 106;gpio input 107;gpio input 108"\n');
            await delay(1000);
            outputMsgCallback("Root in progress: Save changes...");
            writer.write('saveenv\n');
            await delay(1000);
            outputMsgCallback("Root in progress: Rebooting...");
            writer.write('reset\n');
            await delay(1000);
        }

        successCallback();
    } catch (err) {
        outputErrorCallback(`Error: ${err.message}`);
    } finally {
        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        return;
    }
}

async function unlockHuaweiShell(port, outputMsgCallback, outputErrorCallback, successCallback, baudRate = 115200) {
    const { reader, writer, readableStreamClosed, writerStreamClosed } = await openPortLineBreak(port, baudRate, outputErrorCallback);

    try {
        outputMsgCallback("Root in progress: Rebooting...");
        writer.write('reset\n');
        await delay(1000);
        outputMsgCallback("Waiting for reboot");
        await waitFailbackShell(writer, reader, outputMsgCallback);
        outputMsgCallback("Root in progress: Enable full Linux shell...");
        writer.write('mount_root && mkdir -p /overlay/etc && sed "s|/opt/lantiq/bin/minishell|/bin/ash|g" /rom/etc/passwd > /overlay/etc/passwd\n');
        await delay(1000);
        outputMsgCallback("Root in progress: Umount rootfs partitions...");
        writer.write('umount /overlay && umount -a\n');
        await delay(1000);
        successCallback();
    } catch (err) {
        outputErrorCallback(`Error: ${err.message}`);
    } finally {
        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        return;
    }
}
