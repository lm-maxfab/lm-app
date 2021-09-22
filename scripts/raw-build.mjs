import {
  cmd,
  updatePreload,
  emptyPreload,
  copySourceToTemp,
  stripDevElementsInIndex,
  buildFromTemp,
  deleteTemp
} from './_utils.mjs'

rawBuild ()

async function rawBuild () {
  // Update spreadsheet preload
  await cmd('echo "\n⏬ $(tput bold)Updating spreadsheet preload...$(tput sgr0)\n"')
  const shouldEmptyPreload = process.argv.find(arg => (arg === 'no-preload'))
  const preloadedData = shouldEmptyPreload
    ? await emptyPreload()
    : await updatePreload()
  console.log(preloadedData)
  await cmd('echo "./src/preload.ts"')

  await copySourceToTemp()
  await stripDevElementsInIndex()
  await buildFromTemp()
  await deleteTemp()
}

export default rawBuild
