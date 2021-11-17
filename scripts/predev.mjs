import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Directory } from './modules/file-system/index.mjs'

// function jsonToDataTag (json) {
//   const obj = JSON.parse(json)
//   if (['string', 'boolean', 'number'].includes(typeof obj)) {
//     return `<data value="typeval">
//       <data value="type">${typeof obj}</data>
//       <data value="value">${obj}</data>
//     </data>`

//   } else if (obj === null) {
//     return `<data value="typeval">
//       <data value="type">null</data>
//       <data value="value">null</data>
//     </data>`

//   } else if (Array.isArray(obj)) {
//     return `<data value="typeval">
//       <data value="type">array</data>
//       <data value="value">
//         ${obj.map((elt, pos) => `<data value="key" id="key-${pos}">
//           ${jsonToDataTag(JSON.stringify(elt))}
//         </data>`).join('\n')}
//       </data>
//     </data>`

//   } else {
//     return `<data value="typeval">
//       <data value="type">object</data>
//       <data value="value">
//         ${Object.keys(obj).map(key => `<data value="key" id="key-${key}">
//           ${jsonToDataTag(JSON.stringify(obj[key]))}
//         </data>`).join('\n')}
//       </data>
//     </data>`
//   }
// }

// function dataTagToJson (dataTag) {
//   console.log('data tag to json')
//   console.log(dataTag)
// }

async function start () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const ROOT = new Directory(path.join(__dirname, '../'))
  const CONFIG_JSON = await ROOT.get('config.json')
  const config = JSON.parse(await CONFIG_JSON.read())
  const configWithEnv = {
    ...config,
    env: 'developpment'
  }
  const INDEX_HTML = await ROOT.get('index.html')
  await INDEX_HTML.editHTMLQuiet(jsdom => {
    const document = jsdom.window.document
    const preConfig = document.querySelector('pre#lm-app-config')
    const strConfig = JSON
      .stringify(configWithEnv, null, 2)
      .replace(/\n/gm, '\n    ')
    // const strConfig = JSON
    //   .stringify(configWithEnv, null, 2)
    //   .split('\n')
    //   .map(line => '    ' + line)
    //   .join('\n')
    preConfig.innerHTML = strConfig
    return jsdom
  })
  
  // let STATIC_APP_SCRIPTS_CONFIG_JS = await ROOT.get('static/app/scripts/config.js')
  // if (STATIC_APP_SCRIPTS_CONFIG_JS === undefined) await ROOT.touch('static/app/scripts/config.js')
  // STATIC_APP_SCRIPTS_CONFIG_JS = await ROOT.get('static/app/scripts/config.js')
  // await STATIC_APP_SCRIPTS_CONFIG_JS.editQuiet(() => configWithEnv.toS)
}

start ()


