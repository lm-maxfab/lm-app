import {
  updatePreload,
  copySourceToTemp,
  stripDevElementsInIndex,
  buildFromTemp,
  deleteTemp
} from './_utils.mjs'

rawBuild ()

async function rawBuild () {
  await updatePreload()
  await copySourceToTemp()
  await stripDevElementsInIndex()
  await buildFromTemp()
  await deleteTemp()
}

export default rawBuild
