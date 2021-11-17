document.addEventListener('LMAppConfigInjected', () => {
  const config = window.LM_APP_CONFIG
  const env = config.env
  const sheetbaseUrl = config.sheetbases[env]
  window.LM_APP_SHEETBASE = {
    loading: true,
    error: null,
    data: null
  }
  window.fetch(sheetbaseUrl)
    .then(res => res.ok ? res.text() : new Error())
    .then(tsv => {
      window.LM_APP_SHEETBASE.loading = false
      window.LM_APP_SHEETBASE.data = tsv
      document.dispatchEvent(new CustomEvent('LMAppSheetBaseLoaded'))
    })
    .catch(error => {
      window.LM_APP_SHEETBASE.loading = false
      window.LM_APP_SHEETBASE.error = error
      document.dispatchEvent(new CustomEvent('LMAppSheetBaseLoadFailed'))
    })
})

// !function () {
//   const env = window.LM_APP_CONFIG
//   console.log(env)

//   const env = window.LM_APP_CONFIG.env ?? 'developpment'
//   const sheetbaseUrl = window.LM_APP_CONFIG.sheetbases[env]
//   window.LM_APP_SHEETBASE = {
//     loading: true,
//     error: null,
//     data: null
//   }
//   window.fetch(sheetbaseUrl)
//     .then(res => res.ok ? res.text() : new Error())
//     .then(tsv => {
//       window.LM_APP_SHEETBASE.loading = false
//       window.LM_APP_SHEETBASE.data = tsv
//       document.dispatchEvent(new CustomEvent('lm-app_sheetbase_tsv_load_success'))
//     })
//     .catch(error => {
//       window.LM_APP_SHEETBASE.loading = false
//       window.LM_APP_SHEETBASE.error = error
//       document.dispatchEvent(new CustomEvent('lm-app_sheetbase_tsv_load_failure'))
//     })
// }()
