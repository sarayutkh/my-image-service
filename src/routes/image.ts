import { FastifyInstance } from 'fastify'
import path from 'path'
import fs from 'fs'

export default async function imageRoutes(fastify: FastifyInstance) {
  fastify.get('/image/:project/:filename', async (req, reply) => {
    const { project, filename } = req.params as { project: string; filename: string }

    const filePath = path.join(__dirname, '..', '..', 'images', project, filename)

    if (!fs.existsSync(filePath)) {
      return reply.code(404).send({ error: 'Image not found' })
    }

    const ext = path.extname(filename).toLowerCase()
    const type =
      ext === '.png' ? 'image/png'
      : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
      : ext === '.webp' ? 'image/webp'
      : 'application/octet-stream'

    reply.type(type)
    return fs.createReadStream(filePath)
  })
}
