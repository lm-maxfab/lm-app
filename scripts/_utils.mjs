/* eslint-disable no-tabs */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import prompt from 'async-prompt'
import pretty from 'pretty'
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
    if (verboseOpt) console.log(err)
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

async function editHtml (path, transformation, verbose = true) {
  const fileContent = readFileSync(path, { encoding: 'utf8' })
  const dom = new JSDOM(fileContent)
  const rawTransformed = await transformation(dom.window.document)
  const transformed = rawTransformed?.documentElement !== undefined
    ? rawTransformed.documentElement.outerHTML
    : ''
  if (verbose) {
    console.log(path)
    console.log('\nINPUT:\n')
    console.log(fileContent)
    console.log('\nOUTPUT:\n')
    console.log(transformed)
    const ok = await confirm('Do you want to save this file? (y/n)')
    if (ok) return writeFileSync(path, transformed)
    else throw new Error('File edition aborted.')
  }
  return writeFileSync(path, transformed)
}

async function editFile (path, transformation, verbose = true) {
  const fileContent = readFileSync(path, { encoding: 'utf8' })
  const transformed = await transformation(fileContent)
  if (verbose) {
    console.log(path)
    console.log('\nINPUT:\n')
    console.log(fileContent)
    console.log('\nOUTPUT:\n')
    console.log(transformed)
    const ok = await confirm('Do you want to save this file? (y/n)')
    if (ok) return writeFileSync(path, transformed)
    else throw new Error('File edition aborted.')
  }
  return writeFileSync(path, transformed)
}

async function confirm (question = 'Continue ? (y/n)') {
  const userInput = await prompt(question)
  return userInput.match(/^y$/i)
}

async function prettifyHtml (path, verbose = true) {
  await editHtml(path, $document => {
    const outerHtml = $document.documentElement.outerHTML
    const prettified = pretty(outerHtml, { ocd: true })
    const $newDocument = new JSDOM(prettified).window.document
    return $newDocument
  }, verbose)
}

export { cmd, laxcmd, updatePreload, editHtml, editFile, confirm, prettifyHtml }
