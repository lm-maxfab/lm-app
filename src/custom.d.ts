import { Config } from './modules/le-monde/utils/get-config'
import { AppNodeMap } from './modules/le-monde/utils/render-lm-app'
import { SheetBase } from './modules/le-monde/utils/sheet-base'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export declare global {
  interface Window {
    LM_APP?: {
      getConfig?: () => Config|undefined
      fetchSheetBase?: (url: string) => Promise<SheetBase | undefined>
      renderLMApp?: (renderList: AppNodeMap[], sheetBase?: SheetBase) => void
      init?: () => Promise<void>
    }
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
