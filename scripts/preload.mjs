/* eslint-disable no-template-curly-in-string */
import { updatePreload } from './_utils.mjs'

preload()

async function preload () {
  try {
    await updatePreload()
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}

export default preload
