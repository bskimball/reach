// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  DemographicType,
  DemographicTypeData,
  DemographicTypePatch,
  DemographicTypeQuery
} from './demographic-type.schema'

export type { DemographicType, DemographicTypeData, DemographicTypePatch, DemographicTypeQuery }

export interface DemographicTypeParams extends KnexAdapterParams<DemographicTypeQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class DemographicTypeService<ServiceParams extends Params = DemographicTypeParams> extends KnexService<
  DemographicType,
  DemographicTypeData,
  DemographicTypeParams,
  DemographicTypePatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'demographic-type'
  }
}
