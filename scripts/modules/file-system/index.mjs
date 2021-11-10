import fse from 'fs-extra'
import path from 'path'
import { JSDOM } from 'jsdom'
import prompts from 'prompts'

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
    if (ok) return await fse.rm(this.path, { recursive: true, force: true })
    else throw new Error(`You prevented deletion of: ${this.path}`)
  }

  async copyTo (_path) {
    const destPath = path.join(this.path, '../', _path)
    console.log(this.path)
    console.log(destPath)
    console.log()
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
    console.log(this.path)
    console.log(fileOrDirectory.path)
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
  
  async empty (name) {
    const toEmpty = await this.get(name)
    if (toEmpty instanceof File) {
      await toEmpty.write('')
    } else if (toEmpty instanceof Directory) {
      await toEmpty.deleteSelf()
      await this.mkdir(name)
    } else {
      const childPath = path.join(this.path, name)
      throw new Error(`No child found at ${childPath}`)
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

  async write (content, options = { encoding: 'utf-8' }) {
    const ok = (await prompts({
      type: 'confirm',
      name: 'ok',
      message: `Overwrite ${this.path} ?`
    })).ok
    if (ok) {
      await fse.writeFile(this.path, content, options)
      return this
    }
    else throw new Error(`You prevented overwriting of: ${this.path}`)
  }

  async edit (editorFunc) {
    const content = await this.read()
    const result = await editorFunc(content)
    await this.write(result)
    return this
  }

  async emptySelf () {
    return await this.edit(() => '')
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

  async editHTML (editorFunc) {
    const jsdom = await this.readHTML()
    const result = await editorFunc(jsdom)
    if (result === undefined) return undefined
    await this.writeHTML(result)
    return this
  }
}
