import { Log } from './modules/le-monde/utils/silent-log'
import { SheetBase } from './modules/le-monde/utils/sheet-base'
export declare global {
  interface Window {
    __LM_GET_SILENT_LOG_REGISTER?: () => Log[]
    __LM_PRINT_SILENT_LOG_REGISTER?: () => void
    __LM_GLOBAL_SNIPPET_ID?: string
    __LM_GLOBAL_SNIPPET_TSV_PRELOAD?: string
    __LM_GLOBAL_SHEET_BASE?: SheetBase
    
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
      loading: boolean
      error: any
      data: string|null
    }

    LM_APP_GLOBALS: {
      sheetbase_tsv: string
      sheetbase_tsv_load_error: any
      fetchSheetbaseTsv: () => void
      print_silent_log_register: (n?: number) => void
      build: {
        version: string
        branch: string
        time: string
      }
    }
  }
}
