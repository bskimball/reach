// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const demographicSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String(),
    demographicTypeId: Type.Number(),
    significantDate: Type.String({ format: 'date-time' }),
    customerId: Type.Number()
  },
  { $id: 'Demographic', additionalProperties: false }
)
export type Demographic = Static<typeof demographicSchema>
export const demographicValidator = getValidator(demographicSchema, dataValidator)
export const demographicResolver = resolve<Demographic, HookContext>({})

export const demographicExternalResolver = resolve<Demographic, HookContext>({})

// Schema for creating new entries
export const demographicDataSchema = Type.Pick(
  demographicSchema,
  ['text', 'demographicTypeId', 'significantDate', 'customerId'],
  {
    $id: 'DemographicData'
  }
)
export type DemographicData = Static<typeof demographicDataSchema>
export const demographicDataValidator = getValidator(demographicDataSchema, dataValidator)
export const demographicDataResolver = resolve<Demographic, HookContext>({})

// Schema for updating existing entries
export const demographicPatchSchema = Type.Partial(demographicSchema, {
  $id: 'DemographicPatch'
})
export type DemographicPatch = Static<typeof demographicPatchSchema>
export const demographicPatchValidator = getValidator(demographicPatchSchema, dataValidator)
export const demographicPatchResolver = resolve<Demographic, HookContext>({})

// Schema for allowed query properties
export const demographicQueryProperties = Type.Pick(demographicSchema, [
  'id',
  'text',
  'demographicTypeId',
  'significantDate',
  'customerId'
])
export const demographicQuerySchema = Type.Intersect(
  [
    querySyntax(demographicQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DemographicQuery = Static<typeof demographicQuerySchema>
export const demographicQueryValidator = getValidator(demographicQuerySchema, queryValidator)
export const demographicQueryResolver = resolve<DemographicQuery, HookContext>({})
