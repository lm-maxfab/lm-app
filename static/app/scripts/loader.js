!function () {
  window.LM_APP_LOAD_STATUS = {
    stager: { time: Date.now() },
    config: { time: null },
    dom: { time: null },
    sheetbase: { time: null },
    app: { time: null }
  }

  // DEVELOPPMENT config has loaded before
  if (window.LM_APP_CONFIG !== undefined) window.LM_APP_LOAD_STATUS.config.time = Date.now()
  
  // DEVELOPPMENT wait for config event to occur
  document.addEventListener('LMAppConfigJsonLoaded', () => { window.LM_APP_LOAD_STATUS.config.time = Date.now() })

  document.addEventListener('DOMContentLoaded', () => {
    window.LM_APP_LOAD_STATUS.dom.time = Date.now()
    
    // PRODUCTION config event will never happen
    if (window.LM_APP_CONFIG === undefined) {
      const configPre = document.documentElement.querySelector('#lm-app-config')
      const config = JSON.parse(configPre.innerHTML)
      window.LM_APP_CONFIG = config
      window.LM_APP_LOAD_STATUS.config.time = Date.now()
    }

    // Start loading sheetbase
    const config = window.LM_APP_CONFIG
    const env = config.env
    const sheetbaseUrl = config.sheetbases[env] ?? ''
    window.LM_APP_SHEETBASE = { error: null, data: null }
    if (sheetbaseUrl === '') {
      window.LM_APP_LOAD_STATUS.sheetbase.time = Date.now()
      window.LM_APP_SHEETBASE.data = null
      if (window.LM_APP_RENDERER !== undefined) window.LM_APP_RENDERER()
    } else {
      window.fetch(sheetbaseUrl)
        .then(res => res.ok ? res.text() : new Error(`${res.status}: ${res.statusText}`))
        .then(tsv => {
          window.LM_APP_LOAD_STATUS.sheetbase.time = Date.now()
          window.LM_APP_SHEETBASE.data = tsv
          if (window.LM_APP_RENDERER !== undefined) window.LM_APP_RENDERER(tsv)
        })
        .catch(error => {
          window.LM_APP_LOAD_STATUS.sheetbase.time = Date.now()
          window.LM_APP_SHEETBASE.error = error
        })
    }
  })

  document.addEventListener('LMAppLoaded', () => {
    window.LM_APP_LOAD_STATUS.app.time = Date.now()
    if (window.LM_APP_LOAD_STATUS.sheetbase.time !== null) {
      if (window.LM_APP_SHEETBASE.data === null) window.LM_APP_RENDERER()
      else window.LM_APP_RENDERER(window.LM_APP_SHEETBASE.data)
    }
  })
}()
