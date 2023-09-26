import { Redis } from '@hocuspocus/extension-redis'
import { Server } from '@hocuspocus/server'
// eslint-disable-next-line fp/no-events
import { EventEmitter } from 'events'
import express from 'express'
import basicAuth from 'express-basic-auth'
import expressWebsockets from 'express-ws'
import client, { register } from 'prom-client'
import ThoughtspaceExtension from './ThoughtspaceExtension'
import { observeNodeMetrics } from './metrics'

// bump maxListeners to avoid warnings when many websocket connections are created
EventEmitter.defaultMaxListeners = 1000000

const METRICS_DISABLED_MESSAGE =
  'Metrics are disabled because METRICS_USERNAME and/or METRICS_PASSWORD environment variables are not set.'

const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017'
const redisHost = process.env.REDIS_HOST
const redisPort = process.env.REDIS_PORT ? +process.env.REDIS_PORT : undefined
const port = process.env.PORT ? +process.env.PORT : 3001
const hasMetricsCredentials = process.env.METRICS_USERNAME && process.env.METRICS_PASSWORD

if (!hasMetricsCredentials) {
  console.warn(METRICS_DISABLED_MESSAGE)
}

client.collectDefaultMetrics()

// Metrics are usually exposed on the /metrics route with basic auth.
// We can also opt in to pushing them directly to the Graphite server on an interval.
// This is useful for exposing metrics from a local development environment.
if (process.env.METRICS_PUSH) {
  console.info(`Pushing metrics to ${process.env.GRAPHITE_URL}`)
  observeNodeMetrics()
}

const server = Server.configure({
  port,
  extensions: [
    ...(redisHost ? [new Redis({ host: redisHost, port: redisPort })] : []),
    new ThoughtspaceExtension({ connectionString: mongodbConnectionString }),
  ],
})

// express
const { app } = expressWebsockets(express())

// basic auth middleware to protect the metrics endpoint
const metricsAuthMiddleware = basicAuth({
  users: {
    ...(hasMetricsCredentials ? { [process.env.METRICS_USERNAME!]: process.env.METRICS_PASSWORD! } : null),
  },
  unauthorizedResponse: (req: any): string =>
    !req.auth ? 'Basic auth required' : hasMetricsCredentials ? 'Unauthorized' : METRICS_DISABLED_MESSAGE,
})

// prometheus metrics route
app.get('/', async (req, res) => {
  res.type('text').send('Server is running')
})

// prometheus metrics route
app.get('/metrics', metricsAuthMiddleware, async (req, res) => {
  res.contentType(register.contentType).send(await register.metrics())
})

// hocuspocus websocket route
app.ws('/hocuspocus', (ws, req) => {
  server.handleConnection(ws, req)
})

app.listen(port, () => {
  console.info(`App listening at http://localhost:${port}`)
  process.send?.('ready')
})
