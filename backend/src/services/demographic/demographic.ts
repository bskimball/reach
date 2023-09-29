// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  demographicDataValidator,
  demographicPatchValidator,
  demographicQueryValidator,
  demographicResolver,
  demographicExternalResolver,
  demographicDataResolver,
  demographicPatchResolver,
  demographicQueryResolver
} from './demographic.schema'

import type { Application } from '../../declarations'
import { DemographicService, getOptions } from './demographic.class'
import { demographicPath, demographicMethods } from './demographic.shared'

export * from './demographic.class'
export * from './demographic.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const demographic = (app: Application) => {
  // Register our service on the Feathers application
  app.use(demographicPath, new DemographicService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: demographicMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(demographicPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(demographicExternalResolver),
        schemaHooks.resolveResult(demographicResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(demographicQueryValidator),
        schemaHooks.resolveQuery(demographicQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(demographicDataValidator),
        schemaHooks.resolveData(demographicDataResolver)
      ],
      patch: [
        schemaHooks.validateData(demographicPatchValidator),
        schemaHooks.resolveData(demographicPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [demographicPath]: DemographicService
  }
}
