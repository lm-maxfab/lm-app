import { Log } from './modules/le-monde/utils/silent-log'
export declare global {
  interface Window {
    __LM_GET_SILENT_LOG_REGISTER: () => Log[]
    __LM_PRINT_SILENT_LOG_REGISTER: () => void
  }
}
