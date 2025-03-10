import { getClient } from '../client.js'
import { buildSimpleConsoleTable } from '../utils.js'

/**
 * @typedef {{ profile: string }} ListAccounts
 * @typedef {import('yargs').Arguments<ListAccounts>} ListAccountsArgs
 */

/**
 * @async
 * @param {ListAccountsArgs} argv
 * @returns {Promise<void>}
 */
const exe = async ({ profile }) => {
  const client = getClient(profile)
  const id = await client.account()
  const selected = client.settings.get('delegation')
  const delegations = client.settings.get('delegations')

  const table = buildSimpleConsoleTable(['selected', 'alias', 'did'])
  for (const [did, del] of Object.entries(delegations)) {
    const cur = selected == did
    table.push([cur ? '*' : '', del.alias, did])
  }
  console.log(table.toString())
}

/**
 * @type {import('yargs').CommandBuilder} yargs
 * @returns {import('yargs').Argv<{}>}
 */
const builder = (yargs) => yargs

export default {
  command: 'accounts',
  describe: 'List all accounts.',
  builder,
  handler: exe,
}
