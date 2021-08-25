const { cmd, updatePreload } = require('./_utils')
const { spawn } = require('child_process')

start ()

async function start () {
  try {
    await cmd('echo "\n⏬ $(tput bold)Updating spreadsheet preload...$(tput sgr0)\n"')
    await updatePreload()
    await cmd('echo "./src/preload.js"')
    // `react-scripts start` is called in package.json
    // in order to keep track of stdout in terminal
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}
