import { Log } from './modules/le-monde/utils/silent-log'
import { SheetBase } from './modules/le-monde/utils/sheet-base'
export declare global {
  interface Window {
    LM_APP_CONFIG: {
      assets_root_url: string
      sheetbases: {
        production: string
        staging: string
        testing: string
        developpment: string 
      }
      env: string
    }
    
    LM_APP_SHEETBASE: {
      error: any
      data: string|null
    }

    LM_APP_LOAD_STATUS: {
      loader: { time: number }
      config: { time: number }
      dom: { time: number }
      sheetbase: { time: number }
      app: { time: number }
    }

    LM_APP_BUILD?: {
      version: string
      branch: string
      time: string
      vendorJs: string
      indexJs: string
      indexCss: string
    }

    LM_APP_RENDERER: (sheetBaseTsv?: string) => void
  }
}
