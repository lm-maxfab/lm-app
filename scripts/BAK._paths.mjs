import { join, relative } from 'path'
import { readFileSync, readdirSync } from 'fs'

export const ROOT_DIR_PATH = process.cwd()

export const BUILD_CONFIG_JSON_PATH = join(ROOT_DIR_PATH, 'build.config.json')
export const BUILD_CONFIG_JSON_REL_PATH = relative(ROOT_DIR_PATH, BUILD_CONFIG_JSON_PATH)

export const INDEX_HTML_PATH = join(ROOT_DIR_PATH, 'index.html')
export const INDEX_HTML_REL_PATH = relative(ROOT_DIR_PATH, INDEX_HTML_PATH)

export const STATIC_DIR_PATH = join(ROOT_DIR_PATH, 'static')
export const STATIC_DIR_REL_PATH = relative(ROOT_DIR_PATH, STATIC_DIR_PATH)

export const DEV_STATIC_DIR_PATH = join(ROOT_DIR_PATH, 'static.dev')
export const DEV_STATIC_DIR_REL_PATH = relative(ROOT_DIR_PATH, DEV_STATIC_DIR_PATH)

export const SRC_DIR_PATH = join(ROOT_DIR_PATH, 'src')
export const SRC_DIR_REL_PATH = relative(ROOT_DIR_PATH, SRC_DIR_PATH)

export const CONFIG_JSON_PATH = join(SRC_DIR_PATH, 'config.json')
export const CONFIG_JSON_REL_PATH = relative(ROOT_DIR_PATH, CONFIG_JSON_PATH)

export const PRELOAD_TS_PATH = join(SRC_DIR_PATH, 'preload.ts')
export const PRELOAD_TS_REL_PATH = relative(ROOT_DIR_PATH, PRELOAD_TS_PATH)

export const TEMP_DIR_PATH = join(ROOT_DIR_PATH, '.temp')
export const TEMP_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_DIR_PATH)

export const TEMP_INDEX_HTML_PATH = join(TEMP_DIR_PATH, 'index.html')
export const TEMP_INDEX_HTML_REL_PATH = relative(ROOT_DIR_PATH, TEMP_INDEX_HTML_PATH)

export const TEMP_STATIC_DIR_PATH = join(TEMP_DIR_PATH, 'static')
export const TEMP_STATIC_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_STATIC_DIR_PATH)

export const TEMP_SRC_DIR_PATH = join(TEMP_DIR_PATH, 'src')
export const TEMP_SRC_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_SRC_DIR_PATH)

export const TEMP_CONFIG_JSON_PATH = join(TEMP_SRC_DIR_PATH, 'config.json')
export const TEMP_CONFIG_JSON_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CONFIG_JSON_PATH)

export const TEMP_PRELOAD_TS_PATH = join(TEMP_SRC_DIR_PATH, 'preload.ts')
export const TEMP_PRELOAD_TS_REL_PATH = relative(ROOT_DIR_PATH, TEMP_PRELOAD_TS_PATH)

export const TEMP_CURRENT_BUILD_DIR_NAME = '2a908cd8c20b-temp-current-build'
export const TEMP_CURRENT_BUILD_DIR_PATH = join(TEMP_DIR_PATH, TEMP_CURRENT_BUILD_DIR_NAME)
export const TEMP_CURRENT_BUILD_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_DIR_PATH)

export const TEMP_CURRENT_BUILD_INDEX_HTML_PATH = join(TEMP_CURRENT_BUILD_DIR_PATH, 'index.html')
export const TEMP_CURRENT_BUILD_INDEX_HTML_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_INDEX_HTML_PATH)

export const TEMP_CURRENT_BUILD_ASSETS_DIR_NAME = '8b575a2c19a9-temp-assets'
export const TEMP_CURRENT_BUILD_ASSETS_DIR_PATH = join(TEMP_CURRENT_BUILD_DIR_PATH, TEMP_CURRENT_BUILD_ASSETS_DIR_NAME)
export const TEMP_CURRENT_BUILD_ASSETS_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_ASSETS_DIR_PATH)

export const TEMP_CURRENT_BUILD_ROLLEDUP_JS_NAME = 'rolledup.js'
export const TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH = join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, TEMP_CURRENT_BUILD_ROLLEDUP_JS_NAME)
export const TEMP_CURRENT_BUILD_ROLLEDUP_JS_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH)

export const TEMP_FINAL_BUILD_DIR_NAME = '7a1b559fed17-temp-final-build'
export const TEMP_FINAL_BUILD_DIR_PATH = join(TEMP_DIR_PATH, TEMP_FINAL_BUILD_DIR_NAME)
export const TEMP_FINAL_BUILD_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_FINAL_BUILD_DIR_PATH)

export const BUILD_DIR_PATH = join(ROOT_DIR_PATH, 'build')
export const BUILD_DIR_REL_PATH = relative(ROOT_DIR_PATH, BUILD_DIR_PATH)

export async function listFilesInTempCurrentBuildAssets () {
  const assetsFilesList = readdirSync(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH)
  return assetsFilesList
}

export async function getTempCurrentBuildIndexJsPath () {
  const assetsList = await listFilesInTempCurrentBuildAssets()
  const indexJsName = assetsList.find(name => name.match(/^index.[a-f0-9]{8}.js$/))
  return join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, indexJsName)
}

export async function getTempCurrentBuildVendorJsPath () {
  const assetsList = await listFilesInTempCurrentBuildAssets()
  const vendorJsName = assetsList.find(name => name.match(/^vendor.[a-f0-9]{8}.js$/))
  return join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, vendorJsName)
}

export async function getTempCurrentBuildIndexCssPath () {
  const assetsList = await listFilesInTempCurrentBuildAssets()
  const indexCssName = assetsList.find(name => name.match(/^index.[a-f0-9]{8}.css$/))
  return join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, indexCssName)
}
