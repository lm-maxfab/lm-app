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
    "layouts": [
      {
        "name": "some-name",
        "DOM_nodes": [
          "<div class='ma-div-1'>MA DIV 1</div>",
          "<div class='ma-div-2'>MA DIV 2</div>",
          "<div class='ma-div-3'>MA DIV 3</div>"
        ]
      },
      {
        "name": "some-other-name",
        "DOM_nodes": [
          "<div class='ma-div-4'>MA DIV 4</div>",
          "<div class='ma-div-5'>MA DIV 5</div>",
          "<div class='ma-div-6'>MA DIV 6</div>"
        ]
      }
    ],
    "env": "developpment"
  })
  configPre.innerText = innerText
})();
