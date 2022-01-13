import SilentLog from './modules/le-monde/utils/silent-log'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export declare global {
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

  interface Window {
    LM_APP_SILENT_LOGGER: SilentLog
    LM_APP_BUILD?: {
      version: string
      branch: string
      time: string
      vendorJs: string
      indexJs: string
      indexCss: string
    }
  }
}
