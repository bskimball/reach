// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const demographicTypeSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'DemographicType', additionalProperties: false }
)
export type DemographicType = Static<typeof demographicTypeSchema>
export const demographicTypeValidator = getValidator(demographicTypeSchema, dataValidator)
export const demographicTypeResolver = resolve<DemographicType, HookContext>({})

export const demographicTypeExternalResolver = resolve<DemographicType, HookContext>({})

// Schema for creating new entries
export const demographicTypeDataSchema = Type.Pick(demographicTypeSchema, ['text'], {
  $id: 'DemographicTypeData'
})
export type DemographicTypeData = Static<typeof demographicTypeDataSchema>
export const demographicTypeDataValidator = getValidator(demographicTypeDataSchema, dataValidator)
export const demographicTypeDataResolver = resolve<DemographicType, HookContext>({})

// Schema for updating existing entries
export const demographicTypePatchSchema = Type.Partial(demographicTypeSchema, {
  $id: 'DemographicTypePatch'
})
export type DemographicTypePatch = Static<typeof demographicTypePatchSchema>
export const demographicTypePatchValidator = getValidator(demographicTypePatchSchema, dataValidator)
export const demographicTypePatchResolver = resolve<DemographicType, HookContext>({})

// Schema for allowed query properties
export const demographicTypeQueryProperties = Type.Pick(demographicTypeSchema, ['id', 'text'])
export const demographicTypeQuerySchema = Type.Intersect(
  [
    querySyntax(demographicTypeQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DemographicTypeQuery = Static<typeof demographicTypeQuerySchema>
export const demographicTypeQueryValidator = getValidator(demographicTypeQuerySchema, queryValidator)
export const demographicTypeQueryResolver = resolve<DemographicTypeQuery, HookContext>({})
