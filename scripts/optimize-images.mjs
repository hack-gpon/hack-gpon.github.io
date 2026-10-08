// Create a WebP copy of every JPEG/PNG in the built site, at most MAX_SIZE
// pixels on the longer side: <ImageFigure> serves it and links to the original.
// Runs after `vitepress build`, so the images in the repository are untouched.
import { readdir, stat } from 'node:fs/promises'
import { availableParallelism } from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const IMG_DIR = path.resolve('.vitepress/dist/assets/img')
const MAX_SIZE = 1920
const QUALITY = 80

const files = (await readdir(IMG_DIR, { recursive: true }))
  .filter((file) => /\.(jpe?g|png)$/i.test(file))
  .map((file) => path.join(IMG_DIR, file))

let before = 0
let after = 0

async function convert(file) {
  const output = file.replace(/\.(jpe?g|png)$/i, '.webp')
  // rotate() applies the EXIF orientation, which is lost in the WebP copy
  await sharp(file)
    .rotate()
    .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output)
  const [original, converted] = await Promise.all([stat(file), stat(output)])
  before += original.size
  after += converted.size
}

const queue = [...files]
await Promise.all(
  Array.from({ length: availableParallelism() }, async () => {
    while (queue.length) await convert(queue.shift())
  })
)

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1)
console.log(`Converted ${files.length} images to WebP: ${mb(before)} MB -> ${mb(after)} MB`)
