const { writeFileSync } = require('fs')
const path = require('path')
const { promisify } = require('util')
const fetch = require('node-fetch')
const config = require('../src/config.json')
const _exec = require('child_process').exec

const exec = promisify(_exec)

async function cmd (line, verboseOpt = true) {
  const { stdout, stderr } = await exec(line)
  if (stderr) throw stderr
  else if (stdout) {
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
    return err.stderr
  }
}

async function updatePreload () {
  const pwd = (await cmd('pwd', false)).trim()
  const preloadJsFilePath = path.join(pwd, 'src/preload.js')
  if (config.sheetbase_url) {
    const spreadsheetDataResponse = await fetch(config.sheetbase_url)
    const spreadsheetData = await spreadsheetDataResponse.text()
    let replacedPreloadJsContent = `const preload = \`${spreadsheetData}\`\n\nexport default preload`
    writeFileSync(preloadJsFilePath, replacedPreloadJsContent, { encoding: 'utf8' })
    return replacedPreloadJsContent
  } else {
    let replacedPreloadJsContent = `const preload = \`key	name	type\`\n\nexport default preload`
    writeFileSync(preloadJsFilePath, replacedPreloadJsContent, { encoding: 'utf8' })
    return replacedPreloadJsContent
  }
}

module.exports = { cmd, laxcmd, updatePreload }
