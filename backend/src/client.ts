// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

import { addressClient } from './services/address/address.shared'
export type { Address, AddressData, AddressQuery, AddressPatch } from './services/address/address.shared'

import { demographicTypeClient } from './services/demographic-type/demographic-type.shared'
export type {
  DemographicType,
  DemographicTypeData,
  DemographicTypeQuery,
  DemographicTypePatch
} from './services/demographic-type/demographic-type.shared'

import { demographicClient } from './services/demographic/demographic.shared'
export type {
  Demographic,
  DemographicData,
  DemographicQuery,
  DemographicPatch
} from './services/demographic/demographic.shared'

import { customerClient } from './services/customer/customer.shared'
export type {
  Customer,
  CustomerData,
  CustomerQuery,
  CustomerPatch
} from './services/customer/customer.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(customerClient)
  client.configure(demographicClient)
  client.configure(demographicTypeClient)
  client.configure(addressClient)
  client.configure(userClient)
  return client
}
