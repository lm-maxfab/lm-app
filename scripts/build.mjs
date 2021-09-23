/* eslint-disable no-template-curly-in-string */
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import moment from 'moment'
import chalk from 'chalk'
import {
  cmd,
  laxcmd,

  BUILD_CONFIG,
  
  lint,
  handleGitStatus,
  copySourceToTemp,
  stripDevElementsInIndex,
  getBuildInfoSpan,
  handleBuildConfig,

  updateTempConfigJson,
  updateTempPreload,

  buildFromTemp,
  rollupIndexAndVendor,
  deleteSourceMaps,
  deleteVendor,
  removeVendorPreloadAndTypeModule,
  relinkAssetsViaAssetsRootUrl,
  storeBuildInfo,
  prettifyIndexHtml,
  removeDsStores,
  createLongformAndSnippetBuildOutputs,
  editFile,
  editHtml,
  confirm,
  prettifyHtml
} from './_utils.mjs'

build()

async function build () {

  try {
    // await lint()
    // await handleGitStatus()
    await copySourceToTemp()
    await stripDevElementsInIndex()
    await handleBuildConfig()

    let currentBuildNb = 0
    for (const buildConf of BUILD_CONFIG) {
      currentBuildNb ++
      console.log(chalk.bold(`Building ${currentBuildNb}/${BUILD_CONFIG.length}...`))
      await updateTempConfigJson(buildConf)
      await updateTempPreload()
      await buildFromTemp()
      await rollupIndexAndVendor()
      await deleteSourceMaps()
      await deleteVendor()
      await removeVendorPreloadAndTypeModule()
      await relinkAssetsViaAssetsRootUrl()
      await storeBuildInfo()
      await prettifyIndexHtml()
      await removeDsStores()
      await createLongformAndSnippetBuildOutputs()
      console.log(chalk.green('Built.'))
    }

    // For each
      // UPDATE PRELOAD IN TEMP
      // BUILD TO .temp/builds
      // rollup
      // source maps
      // vendor
      // preload&module
      // relink
      // write build info
      // pretty
      // create longform & snippet & zip
      // rename them
      // rsync with .temp/builds/OUTPUT
    // mv .temp/builds/OUTPUT to build
    // rm -rf ./temp


    // await buildFromTemp()
    // await deleteTemp() <===== FUNC DELETED
    // await rollupIndexAndVendor()
    // await deleteSourceMaps()
    // await deleteVendor()
    // await removeVendorPreloadAndTypeModule()
    // await relinkAssetsViaAssetsRootUrl()
    // await storeBuildInfoInIndexHtml()
    // await prettifyIndexHtml()
    // await removeDsStores()
    // await createLongformAndSnippetBuildOutputs()


    // /* * * * * * * * * * * * * * * * * * * *
    //  *
    //  * END
    //  * 
    //  * * * * * * * * * * * * * * * * * * * */ 

    // // Done
    // await cmd(`echo "\n🍸 $(tput bold)That\'s all good my friend!$(tput sgr0)\n" &&
    //   echo "If you\'re building a longform, just take the zip and upload it." &&
    //   echo "If you\'re building a snippet, dont forget to upload statics to the place you specified in /src/config.json/assets_root_url!" &&
    //   echo "Bye now."`)
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}

export default build
