import fse from 'fs-extra'
import path from 'path'
import { JSDOM } from 'jsdom'
import prompts from 'prompts'
import pretty from 'pretty'

/* * * * * * * * * * * * * * * *
 *
 * DIRECTORY OR FILE
 * 
 * * * * * * * * * * * * * * * */
export class DirectoryOrFile {
  constructor (path) {
    this.path = path
  }

  get name () {
    return this.path.split('/').slice(-1)[0]
  }

  async stat () {
    return await fse.stat(this.path)
  }

  async isDirectory () {
    return (await this.stat()).isDirectory()
  }

  async deleteSelf () {
    const ok = (await prompts({
      type: 'confirm',
      name: 'ok',
      message: `Delete ${this.path} ?`
    })).ok
    if (ok) return await this.deleteSelfQuiet()
    else throw new Error(`You prevented deletion of: ${this.path}`)
  }

  async deleteSelfQuiet () {
    return await fse.rm(this.path, { recursive: true, force: true })
  }

  async copyTo (_path) {
    const destPath = path.join(this.path, '../', _path)
    await fse.copy(this.path, destPath)
    const isDirectory = await this.isDirectory()
    if (isDirectory) return new Directory(destPath)
    else return new File(destPath)
  }
  
  async moveTo (_path) {
    const destPath = path.join(this.path, '../', _path)
    await fse.move(this.path, destPath)
    this.path = destPath
    return this
  }

  pathTo (fileOrDirectory) {
    return path.relative(this.path, fileOrDirectory.path)
  }
}

/* * * * * * * * * * * * * * * *
 *
 * DIRECTORY
 * 
 * * * * * * * * * * * * * * * */
export class Directory extends DirectoryOrFile {
  constructor (path) {
    super(path)
  }

  async list () {
    const childrenNames = await fse.readdir(this.path)
    const children = []
    for (let childName of childrenNames) {
      const childPath = path.join(this.path, childName)
      const isDirectory = (await fse.stat(childPath)).isDirectory()
      if (isDirectory) children.push(new Directory(childPath))
      else children.push(new File(childPath))
    }
    return children
  }

  async get (_path) {
    const filePath = path.join(this.path, _path)
    const exists = await fse.pathExists(filePath)
    if (!exists) return undefined
    const isDirectory = (await fse.stat(filePath)).isDirectory()
    if (isDirectory) return new Directory(filePath)
    else return new File(filePath)
  }

  async mkdir (_path) {
    const dirPath = path.join(this.path, _path)
    await fse.mkdir(dirPath, { recursive: true })
    const dirs = _path.split('/')
    let returned = this
    for (let dirName of dirs) {
      const dir = await returned.get(dirName)
      returned = dir
    }
    return returned
  }

  async copy (source, destination) {
    const sourcePath = path.join(this.path, source)
    const destinationPath = path.join(this.path, destination)
    await fse.copy(sourcePath, destinationPath)
    const result = await this.get(destination)
    return result
  }

  async edit (_path, editorFunc) {
    const foundFile = await this.get(_path)
    if (foundFile === undefined) return undefined
    return await foundFile.edit(editorFunc)
  }

  async editHTML (_path, editorFunc) {
    const foundFile = await this.get(_path)
    if (foundFile === undefined) return undefined
    return await foundFile.editHTML(editorFunc)
  }

  async emptySelf () {
    const children = await this.list()
    for (let child of children) await child.deleteSelf()
    return this
  }

  async emptySelfQuiet () {
    const children = await this.list()
    for (let child of children) await child.deleteSelfQuiet()
    return this
  }
  
  async empty (name) {
    const toEmpty = await this.get(name)
    if (toEmpty === undefined) {
      return undefined
    } else if (toEmpty instanceof File) {
      await toEmpty.write('')
    } else {
      await toEmpty.deleteSelf()
      await this.mkdir(name)
    }
    return await this.get(name)
  }

  async emptyQuiet (name) {
    const toEmpty = await this.get(name)
    if (toEmpty === undefined) {
      return undefined
    } else if (toEmpty instanceof File) {
      await toEmpty.writeQuiet('')
    } else {
      await toEmpty.deleteSelfQuiet()
      await this.mkdir(name)
    }
    return await this.get(name)
  }
}

/* * * * * * * * * * * * * * * *
 *
 * FILE
 * 
 * * * * * * * * * * * * * * * */
export class File extends DirectoryOrFile {
  constructor (path) {
    super(path)
  }

  async read (options = { encoding: 'utf-8' }) {
    return await fse.readFile(this.path, options)
  }

  async write (content, options) {
    const ok = (await prompts({
      type: 'confirm',
      name: 'ok',
      message: `Overwrite ${this.path} ?`
    })).ok
    if (ok) return this.writeQuiet(content, options)
    else throw new Error(`You prevented overwriting of: ${this.path}`)
  }

  async writeQuiet (content, options = { encoding: 'utf-8' }) {
    await fse.writeFile(this.path, content, options)
    return this
  }

  async edit (editorFunc) {
    const content = await this.read()
    const result = await editorFunc(content)
    await this.write(result)
    return this
  }

  async editQuiet (editorFunc) {
    const content = await this.read()
    const result = await editorFunc(content)
    await this.writeQuiet(result)
    return this
  }

  async emptySelf () {
    return await this.edit(() => '')
  }

  async emptySelfQuiet () {
    return await this.editQuiet(() => '')
  }

  async readHTML () {
    const content = await this.read()
    return new JSDOM(content)
  }

  async writeHTML (jsdom) {
    const content = jsdom.window.document.documentElement.outerHTML
    await this.write(content)
    return this
  }

  async writeHTMLQuiet (jsdom) {
    const content = jsdom.window.document.documentElement.outerHTML
    await this.writeQuiet(content)
    return this
  }

  async editHTML (editorFunc) {
    const jsdom = await this.readHTML()
    const result = await editorFunc(jsdom)
    if (result === undefined) return undefined
    await this.writeHTML(result)
    return this
  }

  async editHTMLQuiet (editorFunc) {
    const jsdom = await this.readHTML()
    const result = await editorFunc(jsdom)
    if (result === undefined) return undefined
    await this.writeHTMLQuiet(result)
    return this
  }

  async prettifyHTML () {
    return this.edit(content => {
      const lines = content.split('\n')
      const noWhiteLines = lines.filter(line => line.trim() !== '')
      const noIndentLines = noWhiteLines.map(line => line.trim())
      const prettified = pretty(noIndentLines.join('\n'), { ocd: true })
      return prettified + '\n'
    })
  }

  async prettifyHTMLQuiet () {
    return this.editQuiet(content => {
      const lines = content.split('\n')
      const noWhiteLines = lines.filter(line => line.trim() !== '')
      const noIndentLines = noWhiteLines.map(line => line.trim())
      const prettified = pretty(noIndentLines.join('\n'), { ocd: true })
      return prettified + '\n'
    })
  }
}
