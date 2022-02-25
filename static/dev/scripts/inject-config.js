/* Generated via /scripts/dev.mjs */
!(() => {
  const configPre = document.documentElement.querySelector('#lm-app-config')
  if (configPre === null) return
  const innerText = JSON.stringify({
    "assets_root_url": "",
    "spreadsheets_urls": {
      "production": "",
      "staging": "",
      "testing": "",
      "developpment": ""
    },
    "env": "developpment"
  })
  configPre.innerText = innerText
})();
