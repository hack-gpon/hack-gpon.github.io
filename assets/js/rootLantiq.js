function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitUbootStop(writer, reader) {
    const interval = setInterval(function() {
        writer.write(String.fromCharCode(3));
    }, 10);

    while (true) {
        const { value, done } = await reader.read();

        if (value.startsWith('U-Boot')) {
            loading("Root in progress: Trigger characters received. DO NOT TOUCH THE HUAWEI MA5671A UNTIL THE PROCEDURE IS COMPLETED!",0);
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

async function waitFailbackShell(writer, reader) {
    while (true) {
        const { value, done } = await reader.read();

        if (value.startsWith('Press the [f] key and hit [enter] to enter failsafe mode')) {
            const interval = setInterval(function() {
                writer.write('f\n');
            }, 10);

            loading("Root in progress: Trigger characters received. Waiting for boot to end...",1);
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
