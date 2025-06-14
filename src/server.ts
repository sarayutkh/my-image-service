import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import cors from '@fastify/cors'
import path from 'path'
import uploadRoutes from './routes/upload'
import imageRoutes from './routes/image'

const app = Fastify({ logger: true })

app.register(cors, {
  origin: '*', // หรือจะใส่เป็น ['http://localhost:5500'] ก็ได้ถ้ารันจาก local file server
})
app.register(multipart)

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'images'),
  prefix: '/images/',
})

app.register(uploadRoutes)
app.register(imageRoutes)

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' })
    console.log('🚀 Server is running at http://localhost:3001')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
