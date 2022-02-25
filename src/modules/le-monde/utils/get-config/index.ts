interface Config {
  assets_root_url?: string
  spreadsheets_urls?: {
    production?: string
    staging?: string
    testing?: string
    developpment?: string
  }
  env?: 'production'|'staging'|'testing'|'developpment'
}

function getConfig () {
  const configElement = document.documentElement.querySelector('#lm-app-config')
  if (configElement === null) throw new Error('#lm-app-config is missing in page.')
  try {
    const config = JSON.parse(configElement.innerHTML) as Config
    return config
  } catch (error) {
    console.warn(error)
    console.log(configElement.innerHTML)
    return undefined
  }
}

export type { Config }
export default getConfig
