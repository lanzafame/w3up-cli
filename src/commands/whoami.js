import ora from 'ora'

import { getClient } from '../client.js'
import { hasSetupAccount } from '../validation.js'

const exe = async (/** @type {{ profile: string | undefined; }} */ args) => {
  const view = ora({ text: 'Checking identity', spinner: 'line' })
  try {
    const client = getClient(args.profile)
    const { agent, account } = await client.identity()
    const response = await client.whoami()

    if (response?.error) {
      //@ts-ignore
      view.fail(response?.message)
    } else if (response == null) {
      view.fail('Account not found.')
    } else {
      view.stop()
      console.log(`Agent: ${agent.did()}
Account: ${account.did()}
Access Account: ${response}`)
    }
  } catch (error) {
    view.fail(error.message)
    // view.fail('Could not check identity, check w3up-failure.log')
    // logToFile('whoami', error)
  }
}

/**
 * @type {import('yargs').CommandBuilder} yargs
 * @returns {import('yargs').Argv<{}>}
 */
const builder = (yargs) => yargs.check(hasSetupAccount)

export default {
  command: 'whoami',
  describe: 'Show your current UCAN Identity',
  builder,
  handler: exe,
  exampleOut: `DID:12345...`,
  exampleIn: '$0 whoami',
}
