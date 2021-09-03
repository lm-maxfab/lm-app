/* eslint-disable no-template-curly-in-string */

const { cmd, updatePreload } = require('./_utils')

preload()

async function preload () {
  try {
    // Update spreadsheet preload
    await cmd('echo "\n⏬ $(tput bold)Updating spreadsheet preload...$(tput sgr0)\n"')
    await updatePreload()
    await cmd('echo "./src/preload.js"')
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}
