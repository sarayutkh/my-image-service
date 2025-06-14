import { FastifyInstance } from 'fastify'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']

export default async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post('/upload/:project', async (req, reply) => {
    const { project } = req.params as { project: string }

    const data = await req.file()
    if (!data || !data.filename || !data.mimetype) {
      return reply.code(400).send({ error: 'No file uploaded' })
    }

    const ext = path.extname(data.filename).toLowerCase()
    if (!allowedMimeTypes.includes(data.mimetype) || !allowedExtensions.includes(ext)) {
      return reply.code(400).send({ error: 'Invalid file type. Only image files are allowed.' })
    }

    const filename = `${crypto.randomUUID()}${ext}`
    const projectPath = path.join(__dirname, '..', '..', 'images', project)

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true })
    }

    const filePath = path.join(projectPath, filename)

    await new Promise<void>((resolve, reject) => {
      data.file.pipe(fs.createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject)
    })
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const host = req.headers.host || 'localhost:3001'

    const fullPath = `${protocol}://${host}/images/${project}/${filename}`

    return {
      url: `/images/${project}/${filename}`,
      fullPath,
      filename,
      project,
    }
  })
}
