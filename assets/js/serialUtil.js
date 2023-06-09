function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class SerialReadWrite {
    constructor(port, baudrate) {
        this.port = port;
        this.baudRate = baudrate;
        this.isPortOpen = false;
        this.textDecoder = new TextDecoder();
        this.textEncoder = new TextEncoder();
    }

    async openPort() {
        await this.port.open({ baudRate: this.baudRate });
    }

    async closePort() {
        await this.port.close();
    }

    async readBytes(retryError = 5, errorNum = 0) {
        let reader = undefined;

        if (this.isPortOpen === false) {
            await this.openPort();
            this.isPortOpen = true;
        }

        try {
            if (reader === undefined) {
                reader = this.port.readable.getReader();
            }

            const promiseResult = await reader.read();

            if (promiseResult === undefined) {
                return undefined;
            }

            return promiseResult.value;
        } catch (e) {
            if (e instanceof DOMException &&
                (e.name === "BreakError" || e.name === "FramingError" || e.name === "ParityError")) {
                console.log(e);

                if (errorNum > retryError) {
                    throw e;
                }

                return await this.readBytes(retryError, errorNum++);
            } else {
                throw e;
            }
        } finally {
            if (reader) {
                reader.releaseLock();
                reader = undefined;
            }
        }
    }

    async readLine(readCallback, timeout = undefined) {
        let reader = undefined;
        let extraChunk = "";

        if (this.isPortOpen === false) {
            await this.openPort();
            this.isPortOpen = true;
        }

        while (true) {
            try {
                if (reader === undefined) {
                    reader = this.port.readable.getReader();
                }

                let serialValue;
                if (timeout === undefined) {
                    const { value, done } = await reader.read();
                    serialValue = value;
                } else {
                    const { value, done } = await Promise.race([
                        reader.read(),
                        new Promise((_, reject) => setTimeout(reject, timeout, new Error("timeout")))
                    ]);
                    serialValue = value;
                }

                const linesValue = this.textDecoder.decode(serialValue).split('\n');
                linesValue[0] = extraChunk + linesValue[0];
                extraChunk = linesValue[linesValue.length - 1];

                for (const line of linesValue) {
                    if (readCallback(line) === true) {
                        return;
                    }
                }
            } catch (e) {
                if (e instanceof DOMException &&
                    (e.name === "BreakError" || e.name === "FramingError" || e.name === "ParityError")) {
                    console.log(e);
                } else if (e instanceof Error && e.message === "timeout") {
                    return;
                } else {
                    throw e;
                }
            } finally {
                if (reader) {
                    reader.releaseLock();
                    reader = undefined;
                }
            }
        }
    }

    async writeBytes(bytes) {
        let writer = undefined;

        if (this.isPortOpen === false) {
            await this.openPort();
            this.isPortOpen = true;
        }

        try {
            if (writer === undefined) {
                writer = this.port.writable.getWriter();
            }

            writer.write(bytes);
        } finally {
            if (writer) {
                writer.releaseLock();
                writer = undefined;
            }
        }
    }

    async writeString(str) {
        await this.writeBytes(this.textEncoder.encode(str));
    }
}
