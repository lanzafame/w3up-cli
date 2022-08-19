import ora, { oraPromise } from 'ora'
import client from '../client.js'
import { settings } from '../client.js'

const exe = async ({ reset }) => {
  const view = ora({ spinner: 'line' })

  if (reset) {
    settings.clear()
  }

  let text = !settings.has('secret') ? 'Generating id' : 'Loading id'
  const id = await oraPromise(client.identity(), text)
  if (id) {
    view.succeed('ID: ' + id.did())
  }
}

const id = {
  cmd: 'id',
  description: 'Generate a UCAN Identity',
  build: (yargs) =>
    yargs.option('reset', {
      type: 'boolean',
      alias: 'reset',
      showInHelp: true,
      describe: 'reset settings and generate id.',
    }),
  exe,
  exampleOut: `ID loaded: did:key:z6MkiWm...`,
  exampleIn: '$0 id',
}

export default id