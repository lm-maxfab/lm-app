import fse from 'fs-extra'
import path from 'path'
import { confirm } from '../terminal-display/index.mjs'
import { JSDOM } from 'jsdom'

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

  async delete () {
    const ok = await confirm(`Are you sure you want to delete ${this.path} ? (y/n)`)
    if (ok) return await fse.rm(this.path, { recursive: true, force: true })
    else throw new Error(`You prevented deletion of: ${this.path}`)
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
    for (let child of children) await child.delete()
    return this
  }
  
  async empty (name) {
    const toEmpty = await this.get(name)
    if (toEmpty instanceof File) {
      await toEmpty.write('')
    } else if (toEmpty instanceof Directory) {
      await toEmpty.delete()
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
    const ok = await confirm(`Are you sure you want to overwrite ${this.path} ? (y/n)`)
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
