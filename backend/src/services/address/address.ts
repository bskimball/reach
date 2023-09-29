// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  addressDataValidator,
  addressPatchValidator,
  addressQueryValidator,
  addressResolver,
  addressExternalResolver,
  addressDataResolver,
  addressPatchResolver,
  addressQueryResolver
} from './address.schema'

import type { Application } from '../../declarations'
import { AddressService, getOptions } from './address.class'
import { addressPath, addressMethods } from './address.shared'

export * from './address.class'
export * from './address.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const address = (app: Application) => {
  // Register our service on the Feathers application
  app.use(addressPath, new AddressService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: addressMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(addressPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(addressExternalResolver),
        schemaHooks.resolveResult(addressResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(addressQueryValidator), schemaHooks.resolveQuery(addressQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(addressDataValidator), schemaHooks.resolveData(addressDataResolver)],
      patch: [schemaHooks.validateData(addressPatchValidator), schemaHooks.resolveData(addressPatchResolver)],
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
    [addressPath]: AddressService
  }
}
