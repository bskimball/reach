// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Demographic,
  DemographicData,
  DemographicPatch,
  DemographicQuery,
  DemographicService
} from './demographic.class'

export type { Demographic, DemographicData, DemographicPatch, DemographicQuery }

export type DemographicClientService = Pick<
  DemographicService<Params<DemographicQuery>>,
  (typeof demographicMethods)[number]
>

export const demographicPath = 'demographic'

export const demographicMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const demographicClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(demographicPath, connection.service(demographicPath), {
    methods: demographicMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [demographicPath]: DemographicClientService
  }
}
