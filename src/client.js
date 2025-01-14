// @ts-ignore
import * as CBOR from '@ucanto/transport/cbor'
// @ts-ignore
import W3Client from '@web3-storage/w3up-client'
import Conf from 'conf'

import { default as cliSettings } from './settings.js'

const serialize = ({ ...data }) =>
  Buffer.from(CBOR.codec.encode(data)).toString('binary')

/**
 * @param {string} text
 */
const deserialize = (text) => CBOR.codec.decode(Buffer.from(text, 'binary'))

// TODO this will go away later?
function mergeSettings(profileSettings) {
  if (profileSettings.size) {
    return
  }

  const oldSettings = new Conf({
    projectName: cliSettings.projectName,
    fileExtension: 'cbor',
    serialize,
    deserialize,
  })

  if (oldSettings.size) {
    profileSettings.store = { ...oldSettings.store }
  }
}

export function getProfileSettings(profile = 'main') {
  // @ts-ignore
  const profileSettings = new Conf({
    projectName: 'w3up',
    projectSuffix: '',
    configName: profile,
    fileExtension: 'cbor',
    serialize,
    deserialize,
  })

  // TODO: remove this when no longer needed.
  mergeSettings(profileSettings)

  return profileSettings
}

export function getClient(profile = 'main') {
  const settings = getProfileSettings(profile)

  const client = new W3Client({
    //@ts-ignore
    serviceDID: cliSettings.W3_STORE_DID,
    serviceURL: cliSettings.SERVICE_URL,
    //@ts-ignore
    accessDID: cliSettings.ACCESS_DID,
    accessURL: cliSettings.ACCESS_URL,
    settings,
  })

  return client
}
