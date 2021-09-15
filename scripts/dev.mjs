import { cmd, updatePreload } from './_utils.mjs'

start()

async function start () {
  try {
    await cmd('echo "\n⏬ $(tput bold)Updating spreadsheet preload...$(tput sgr0)\n"')
    await updatePreload()
    await cmd('echo "./src/preload.ts"')
    // `vite` is called in package.json
    // in order to keep track of stdout in terminal
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}
