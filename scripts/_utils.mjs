/* eslint-disable no-tabs */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import fetch from 'node-fetch'
import { exec as _exec } from 'child_process'

const exec = promisify(_exec)

async function cmd (line, verboseOpt = true) {
  const { stdout, stderr } = await exec(line)
  if (stderr) {
    if (verboseOpt) {
      console.log(stdout)
      console.log(stderr)
    }
    throw stderr
  } else if (stdout) {
    if (verboseOpt) console.log(stdout)
    return stdout
  }
}

async function laxcmd (line, verboseOpt = true) {
  try {
    const printed = await cmd(line, verboseOpt)
    return printed
  } catch (err) {
    if (verboseOpt) {
      console.log(err.stdout)
      console.log(err.stderr)
    }
    return err.stdout
  }
}

async function updatePreload () {
  const pwd = (await cmd('pwd', false)).trim()
  const preloadJsFilePath = join(pwd, 'src/preload.ts')
  const rawConfigJson = readFileSync('src/config.json', { encoding: 'utf8' })
  const config = JSON.parse(rawConfigJson)
  if (config.sheetbase_url) {
    const spreadsheetDataResponse = await fetch(config.sheetbase_url)
    const spreadsheetData = await spreadsheetDataResponse.text()
    const replacedPreloadJsContent = `const preload = \`${spreadsheetData}\`\n\nexport default preload\n`
    writeFileSync(preloadJsFilePath, replacedPreloadJsContent, { encoding: 'utf8' })
    return replacedPreloadJsContent
  } else {
    const replacedPreloadJsContent = 'const preload = `key	name	type`\n\nexport default preload\n'
    writeFileSync(preloadJsFilePath, replacedPreloadJsContent, { encoding: 'utf8' })
    return replacedPreloadJsContent
  }
}

export { cmd, laxcmd, updatePreload }
