const LOAD_ADDR = "80800000"

async function detectUboot(reader) {
    while (true) {
        const { value, done } = await reader.read();

        if (value.startsWith('U-Boot')) {
            return;
        }
    }
}

async function waitUbootStop(writer, reader, sfpModel, outputMsgCallback) {
    const interval = setInterval(function() {
        writer.write(String.fromCharCode(3));
    }, 10);

    await detectUboot(reader);
    outputMsgCallback(`Root in progress: Trigger characters received. DO NOT TOUCH THE ${sfpModel} UNTIL THE PROCEDURE IS COMPLETED!`);
    await delay(5000);
    clearInterval(interval);
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

            outputMsgCallback("Root in progress: Trigger characters received. Waiting for boot to end...");
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

async function lantiqRootUboot(port, sfpModel, outputMsgCallback, outputErrorCallback, baudRate = 115200) {
    let reader,writer, readableStreamClosed, writerStreamClosed;

    try {
        outputMsgCallback(`Please disconnect the ${sfpModel} from the SFP adapter if it is currently plugged in!`);
        ({ reader, writer, readableStreamClosed, writerStreamClosed } = await openPortLineBreak(port, baudRate));

        await delay(10000);
        outputMsgCallback(`Now you need to insert the ${sfpModel} into the SFP adapter, if the procedure does not go ahead, check the connections and then remove and reconnect the ${sfpModel} again`);

        while(true) {
            await waitUbootStop(writer, reader, sfpModel, outputMsgCallback);
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

        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        return true;
    } catch (err) {
        outputErrorCallback(`Error: ${err.message}`);
        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        return false;
    }
}

async function unlockHuaweiShell(port, outputMsgCallback, outputErrorCallback, baudRate = 115200) {
    let reader,writer, readableStreamClosed, writerStreamClosed;

    try {
        ({ reader, writer, readableStreamClosed, writerStreamClosed } = await openPortLineBreak(port, baudRate));
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
        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        return true;
    } catch (err) {
        outputErrorCallback(`Error: ${err.message}`);
        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        return false;
    }
}

async function changeBaudrate(port, newBaudrate, currBaudrate, outputErrorCallback) {
    let reader,writer, readableStreamClosed, writerStreamClosed;

    try {
        ({ reader, writer, readableStreamClosed, writerStreamClosed } = await openPortLineBreak(port, currBaudrate));
        await writer.write(`setenv baudrate ${newBaudrate}\n`);
        await delay(1000);
        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        ({ reader, writer, readableStreamClosed, writerStreamClosed } = await openPortLineBreak(port, newBaudrate));

        const interval = setInterval(function() {
            writer.write(String.fromCharCode(13));
        }, 10);

        while (true) {
            const { value, done } = await reader.read();

            if (value.startsWith('FALCON')) {
                clearInterval(interval);
                break;
            }
        }

        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        return true;
    } catch (err) {
        outputErrorCallback(`Error: ${err.message}`);
        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        return false;
    }
}

async function sendImageMtd(port, data, baudRate, outputErrorCallback, progressCallback) {
    let reader,writer, readableStreamClosed, writerStreamClosed;

    try {
        ({ reader, writer, readableStreamClosed, writerStreamClosed } = await openPortLineBreak(port, baudRate));
        await writer.write(`loady 0x${LOAD_ADDR}\n`);
        await delay(1000);
        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);   /* XYMini needs reopen the port */
    } catch (err) {
        outputErrorCallback(`Error: ${err.message}`);
        await closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed);
        return false;
    }

    try {
        await port.open({ baudRate: baudRate });
        reader = port.readable.getReader();
        writer = port.writable.getWriter();

        await sendXYMini(reader, writer, data, baudRate,
            (byteTransfered) => {
                progressCallback(byteTransfered);
            }
        );
        await reader.cancel();
        await writer.close();
        await port.close();
        return true;
    } catch (err) {
        await reader.cancel();
        await writer.close();
        await port.close();
        outputErrorCallback(`Error: ${err.message}`);
        return false;
    }
}
