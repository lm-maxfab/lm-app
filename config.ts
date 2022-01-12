interface Config {
  assets_root_url: string
  sheetbases: {
    production: string
    staging: string
    testing: string
    developpment: string
  }
  env: 'production'|'staging'|'testing'|'developpment'
}

const config: Config = {
  assets_root_url: 'https://assets-decodeurs.lemonde.fr/redacweb/9-2112-porno-assets',
  sheetbases: {
    production: 'https://assets-decodeurs.lemonde.fr/sheets/8Zd2oW-IUwl9RTamJSBnZbqwJaJZhg_773',
    staging: 'https://assets-decodeurs.lemonde.fr/sheets/8Zd2oW-IUwl9RTamJSBnZbqwJaJZhg_774',
    testing: 'https://assets-decodeurs.lemonde.fr/sheets/8Zd2oW-IUwl9RTamJSBnZbqwJaJZhg_775',
    developpment: 'https://assets-decodeurs.lemonde.fr/sheets/8Zd2oW-IUwl9RTamJSBnZbqwJaJZhg_776'
  },
  env: 'developpment'
}

export default config
