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
    const ok = await confirm('Are you sure you want to delete', this.path, '?')
    if (ok) console.log('Yeah ok i should delete shit')
    else console.log('I wont delete ok.')
    // if (ok) return await fse.rm(this.path, { recursive: true, force: true })
    // else return false
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

  async get (name) {
    const list = await this.list()
    return list.find(elt => elt.name === name)
  }

  async mkdir (...names) {
    console.log('mkdir', names)
    let lastCreated = this
    console.log('lastCreated', lastCreated, '\n')
    for (let namePos in names) {
      const name = names[namePos]
      const target = await lastCreated.get(name)
      const alreadyExists = target !== undefined
      console.log('name', name)
      console.log('target', target)
      console.log('alreadyExists', alreadyExists)
      if (alreadyExists) {
        if (target instanceof File) throw new Error(`Cannot mkdir at ${path.join(lastCreated.path, name)} because this file exists and is not a directory.`)
        else lastCreated = target
        console.log('lastCreated', lastCreated, '\n')
      } else {
        
        const dirPath = path.join(this.path, ...names.slice(0, namePos + 1))
        console.log('new path', dirPath)
        await fse.mkdir(dirPath)
        // console.log('CREATED', dirPath)
        lastCreated = await lastCreated.get(name)
        console.log('lastCreated', lastCreated, '\n')
      }
    }
    return lastCreated
  }

  async empty () {
    const children = await this.list()
    for (let child of children) await child.delete()
    return this
  }
  
  async emptyChild (name) {
    const toEmpty = await this.get(name)
    console.log(toEmpty)
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

  async readHTML () {
    const content = await this.read()
    return new JSDOM(content)
  }
  
  async write (content, options = { encoding: 'utf-8' }) {
    const ok = await confirm('Are you sure you want to overwrite', this.path, '?')
    if (ok) console.log('Yeah ok i should write shit')
    else console.log('I wont write ok.')
    // if (ok) return await fse.writeFile(this.path, content, options)
    // else return false
  }

  async writeHTML (jsdom) {
    const content = jsdom.window.document.documentElement.outerHTML
    await this.write(content)
  }
}
