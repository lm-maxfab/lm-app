import { JSX } from 'preact'
import { Config } from '../lm-app-modules/utils/get-config'
import { PageSettings } from '../lm-app-modules/utils/get-page-settings'
import { AppNodeMap } from '../lm-app-modules/utils/render-app'
import { SheetBase } from '../modules/utils/sheet-base'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export declare global {
  interface Window {
    LM_APP?: {
      getConfig?: () => Config|undefined
      getPageSettings?: () => PageSettings|undefined
      fetchSheetBase?: (url: string) => Promise<SheetBase | undefined>
      renderLMApp?: (renderList: AppNodeMap[], sheetBase?: SheetBase) => JSX.Element[]
      init?: () => Promise<void>
      sheetBase?: SheetBase
    }
  }
}
