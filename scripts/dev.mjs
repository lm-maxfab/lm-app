import { updatePreload } from './_utils.mjs'

dev()

async function dev () {
  try {
    await updatePreload()
    // `vite` is called in package.json
    // in order to keep track of stdout in terminal
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}

export default dev
