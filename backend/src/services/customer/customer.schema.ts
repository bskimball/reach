// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const customerSchema = Type.Object(
  {
    id: Type.Number(),
    number: Type.Number(),
    name: Type.String(),
    type: Type.String(),
    since: Type.String({ format: 'date-time' })
  },
  { $id: 'Customer', additionalProperties: false }
)
export type Customer = Static<typeof customerSchema>
export const customerValidator = getValidator(customerSchema, dataValidator)
export const customerResolver = resolve<Customer, HookContext>({})

export const customerExternalResolver = resolve<Customer, HookContext>({})

// Schema for creating new entries
export const customerDataSchema = Type.Pick(customerSchema, ['number', 'name', 'type', 'since'], {
  $id: 'CustomerData'
})
export type CustomerData = Static<typeof customerDataSchema>
export const customerDataValidator = getValidator(customerDataSchema, dataValidator)
export const customerDataResolver = resolve<Customer, HookContext>({})

// Schema for updating existing entries
export const customerPatchSchema = Type.Partial(customerSchema, {
  $id: 'CustomerPatch'
})
export type CustomerPatch = Static<typeof customerPatchSchema>
export const customerPatchValidator = getValidator(customerPatchSchema, dataValidator)
export const customerPatchResolver = resolve<Customer, HookContext>({})

// Schema for allowed query properties
export const customerQueryProperties = Type.Pick(customerSchema, ['id', 'name', 'number', 'type', 'since'])
export const customerQuerySchema = Type.Intersect(
  [
    querySyntax(customerQueryProperties, { name: { $like: Type.String() } }),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type CustomerQuery = Static<typeof customerQuerySchema>
export const customerQueryValidator = getValidator(customerQuerySchema, queryValidator)
export const customerQueryResolver = resolve<CustomerQuery, HookContext>({})
