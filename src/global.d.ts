import { Log } from './modules/le-monde/utils/silent-log'
import { SheetBase } from './modules/le-monde/utils/sheet-base'
export declare global {
  interface Window {
    __LM_GET_SILENT_LOG_REGISTER?: () => Log[]
    __LM_PRINT_SILENT_LOG_REGISTER?: () => void
    __LM_GLOBAL_SNIPPET_ID?: string
    __LM_GLOBAL_SNIPPET_TSV_PRELOAD?: string
    __LM_GLOBAL_SHEET_BASE?: SheetBase
  }
}
