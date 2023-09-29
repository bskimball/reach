// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  demographicTypeDataValidator,
  demographicTypePatchValidator,
  demographicTypeQueryValidator,
  demographicTypeResolver,
  demographicTypeExternalResolver,
  demographicTypeDataResolver,
  demographicTypePatchResolver,
  demographicTypeQueryResolver
} from './demographic-type.schema'

import type { Application } from '../../declarations'
import { DemographicTypeService, getOptions } from './demographic-type.class'
import { demographicTypePath, demographicTypeMethods } from './demographic-type.shared'

export * from './demographic-type.class'
export * from './demographic-type.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const demographicType = (app: Application) => {
  // Register our service on the Feathers application
  app.use(demographicTypePath, new DemographicTypeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: demographicTypeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(demographicTypePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(demographicTypeExternalResolver),
        schemaHooks.resolveResult(demographicTypeResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(demographicTypeQueryValidator),
        schemaHooks.resolveQuery(demographicTypeQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(demographicTypeDataValidator),
        schemaHooks.resolveData(demographicTypeDataResolver)
      ],
      patch: [
        schemaHooks.validateData(demographicTypePatchValidator),
        schemaHooks.resolveData(demographicTypePatchResolver)
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
    [demographicTypePath]: DemographicTypeService
  }
}
