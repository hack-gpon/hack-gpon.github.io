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
