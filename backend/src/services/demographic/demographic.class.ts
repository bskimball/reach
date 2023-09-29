// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Demographic, DemographicData, DemographicPatch, DemographicQuery } from './demographic.schema'

export type { Demographic, DemographicData, DemographicPatch, DemographicQuery }

export interface DemographicParams extends KnexAdapterParams<DemographicQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class DemographicService<ServiceParams extends Params = DemographicParams> extends KnexService<
  Demographic,
  DemographicData,
  DemographicParams,
  DemographicPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'demographic'
  }
}
