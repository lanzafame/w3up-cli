import * as API from '@ucanto/interface'
// @ts-ignore
import { parseLink } from '@ucanto/server'
import ora from 'ora'

import { getClient } from '../client.js'
import { hasSetupAccount, isCID } from '../validation.js'

/**
 * @typedef {{cid?:API.Link, ws?:boolean, subscribe?:boolean, insight_data?: any, profile?:string}} Insights
 * @typedef {import('yargs').Arguments<Insights>} InsightsArgs
 */

/**
 * @async
 * @param {InsightsArgs} argv
 * @returns {Promise<void>}
 */
const exe = async ({ cid, ws, subscribe, profile }) => {
  const spinner = ora({ text: `Getting insights for ${cid}`, spinner: 'line' })
  const shouldWS = ws || subscribe

  if (shouldWS) {
    spinner.fail(`⚠️Subscriptions not yet supported ⚠️`)
  } else {
    const client = getClient(profile)
    /***
     * @type Insights
     */
    const insights = await client.insights(parseLink(cid))
    spinner.succeed(JSON.stringify(insights?.insight_data, null, 2))
  }
}
/**
 * @type {import('yargs').CommandBuilder} yargs
 */
const builder = (yargs) =>
  yargs.check(hasSetupAccount).check(checkCID).option('subscribe', {
    type: 'boolean',
    alias: 'ws',
    showInHelp: true,
    describe: 'Get a Subscription to incoming insights',
  })

/**
 * @param {InsightsArgs} argv
 */
const checkCID = ({ cid }) => isCID(cid)

const insights = {
  command: 'insights <cid>',
  describe: 'Get insights for a CID',
  builder,
  handler: exe,
  exampleOut: `example output goes here`,
  exampleIn: '$0 insights',
}

export default insights
