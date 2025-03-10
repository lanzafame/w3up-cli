import * as API from '@ucanto/interface'
// @ts-ignore
import { parseLink } from '@ucanto/server'
import ora from 'ora'

import { getClient } from '../client.js'
import { hasID, hasSetupAccount, isCID } from '../validation.js'

/**
 * @typedef {{cid?:API.Link, profile?:string}} Remove
 * @typedef {import('yargs').Arguments<Remove>} RemoveArgs
 */

/**
 * @async
 * @param {RemoveArgs} argv
 * @returns {Promise<void>}
 */
const exe = async ({ cid, profile }) => {
  const view = ora(`Unlinking ${cid}...`).start()
  const res = await getClient(profile).remove(parseLink(cid))
  view.succeed(`${res.toString()}`)
}

/**
 * @type {import('yargs').CommandBuilder} yargs
 * @returns {import('yargs').Argv<{}>}
 */
const builder = (yargs) => yargs.check(hasSetupAccount).check(checkCID)

/**
 * @param {RemoveArgs} argv
 */
const checkCID = ({ cid }) => isCID(cid)

//TODO allow list of CIDs
// https://github.com/nftstorage/w3up-cli/issues/20
export default {
  command: ['remove <cid>', 'unlink <cid>'],
  describe: 'Unlink a CID from your account.',
  builder,
  handler: exe,
  exampleIn: '$0 remove bafy...',
  exampleOut: `unlinked bafy...`,
}
