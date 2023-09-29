// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketIO from '@feathersjs/socketio'
import { configurationValidator } from './configuration'
import type { Application } from './declarations'
import { logError } from './hooks/log-error'
import { mysql } from './mysql'
import { authentication } from './authentication'
import { services } from './services'
import { channels } from './channels'
import { errorHandler } from './errorHandler'

const app: Application = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
app.configure(
  socketIO({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(channels)
app.configure(mysql)
app.configure(authentication)
app.configure(services)

app
  .get('mysqlClient')
  .schema.hasTable('users')
  .then((hasTable) => {
    console.log({ hasTable })
    if (hasTable) {
      app
        .service('users')
        .find({ query: { email: 'brian.kimball@bdkinc.com' } })
        .then(({ data }) => {
          if (data.length > 0) {
            return
          }

          app
            .service('users')
            .create({ email: 'brian.kimball@bdkinc.com', password: '^^FtAQ((2tH,' })
            .then((response) => {
              console.log('User brian.kimball@bdkinc.com is created')
            })
        })
    }
  })

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
