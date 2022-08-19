import client from '../client.js'
import ora, { oraPromise } from 'ora'
import { hasID } from '../validation.js'

const exe = async () => {
  const view = ora()
  const list = await oraPromise(client.list(), {
    text: `Listing Uploads...`,
    spinner: 'line',
  })

  if (!list.length) {
    view.info(`You don't seem to have any uploads yet!`)
  } else {
    view.succeed(`CIDs:\n${list.join('\n')}`)
  }
}

const list = {
  cmd: 'list',
  description: 'List your uploads',
  build: (yargs) => yargs.check(() => hasID()),
  exe,
  exampleOut: `bafy...\nbafy...`,
  exampleIn: '$0 list',
}

export default list
