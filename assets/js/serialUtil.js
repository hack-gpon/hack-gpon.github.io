function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class LineBreakTransformer {
    constructor() {
        this.chunks = "";
    }

    transform(chunk, controller) {
        this.chunks += chunk;
        const lines = this.chunks.split("\n");
        this.chunks = lines.pop();
        lines.forEach((line) => controller.enqueue(line));
    }

    flush(controller) {
        controller.enqueue(this.chunks);
    }
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

    async writeString(str) {
        let writer = undefined;

        if (this.isPortOpen === false) {
            await this.openPort();
            this.isPortOpen = true;
        }

        try {
            if (writer === undefined) {
                writer = this.port.writable.getWriter();
            }

            writer.write(this.textEncoder.encode(str));
        } finally {
            if (writer) {
                writer.releaseLock();
                writer = undefined;
            }
        }
    }
}

async function openPortLineBreak(port, baudRate) {
    await port.open({ baudRate: baudRate });
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = await textDecoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer())).getReader();
    const textEncoderStream = new TextEncoderStream();
    const writerStreamClosed = textEncoderStream.readable.pipeTo(port.writable);
    const writer = await textEncoderStream.writable.getWriter();

    return { reader, writer, readableStreamClosed, writerStreamClosed };
}

async function closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed) {
    if (reader) {
        reader.cancel();
    }

    if (readableStreamClosed) {
        await readableStreamClosed.catch(() => { /* Ignore the error */ });
    }

    if (writer) {
        writer.close();
    }

    if (writerStreamClosed) {
        await writerStreamClosed;
    }

    if (port) {
        await port.close();
    }
}
