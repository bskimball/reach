// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  DemographicType,
  DemographicTypeData,
  DemographicTypePatch,
  DemographicTypeQuery,
  DemographicTypeService
} from './demographic-type.class'

export type { DemographicType, DemographicTypeData, DemographicTypePatch, DemographicTypeQuery }

export type DemographicTypeClientService = Pick<
  DemographicTypeService<Params<DemographicTypeQuery>>,
  (typeof demographicTypeMethods)[number]
>

export const demographicTypePath = 'demographic-type'

export const demographicTypeMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const demographicTypeClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(demographicTypePath, connection.service(demographicTypePath), {
    methods: demographicTypeMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [demographicTypePath]: DemographicTypeClientService
  }
}
