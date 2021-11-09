/* eslint-disable no-template-curly-in-string */
import chalk from 'chalk'
import {
  log,
  BUILD_CONFIG,
  lint,
  handleGitStatus,
  copySourceToTemp,
  stripDevElementsInIndex,
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
  rsyncToTempFinal,
  moveTempFinalToBuild,
} from './BAK._utils.mjs'

build()

async function build () {
  try {
    await lint()
    await handleGitStatus()
    await copySourceToTemp()
    await stripDevElementsInIndex()
    await handleBuildConfig()
    let currentBuildNb = 0
    const quietBuild = BUILD_CONFIG.length !== 1
    for (const buildConf of BUILD_CONFIG) {
      currentBuildNb ++
      log(chalk.bold(`\n🏗️  Building ${currentBuildNb}/${BUILD_CONFIG.length}...\n`), !quietBuild)
      log(`sheetbase_url: ${buildConf.sheetbase_url}`, !quietBuild)
      log(`build_name: ${buildConf.build_name}`, !quietBuild)
      await updateTempConfigJson(buildConf, { quiet: quietBuild })
      await updateTempPreload({ quiet: quietBuild })
      await buildFromTemp({ quiet: quietBuild })
      await rollupIndexAndVendor({ quiet: quietBuild })
      await deleteSourceMaps({ quiet: quietBuild })
      await deleteVendor({ quiet: quietBuild })
      await removeVendorPreloadAndTypeModule({ quiet: quietBuild })
      await relinkAssetsViaAssetsRootUrl({ quiet: quietBuild })
      await storeBuildInfo({ quiet: quietBuild })
      await prettifyIndexHtml({ quiet: quietBuild })
      await removeDsStores({ quiet: quietBuild })
      await createLongformAndSnippetBuildOutputs(buildConf, { quiet: quietBuild })
      await rsyncToTempFinal({ quiet: quietBuild })
    }
    await moveTempFinalToBuild()
    log(chalk.bold('\n🍸 That\'s all good my friend!\n'))
    let endAdvice = 'If you\'re building a longform, just take the zip and upload it.\n'
    endAdvice += 'If you\'re building a snippet, dont forget to upload statics to the place you specified in /src/config.json/assets_root_url!"\n'
    endAdvice += 'Bye now.\n'
    log(endAdvice)
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}

export default build
