document.addEventListener('DOMContentLoaded', () => {
  const configPre = document.documentElement.querySelector('#lm-app-config')
  const config = JSON.parse(configPre.innerHTML)
  window.LM_APP_CONFIG = config
  document.dispatchEvent(new CustomEvent('LMAppConfigInjected'))
})
