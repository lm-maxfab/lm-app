# LM App.

This repo contains the code for the generic app structure of the longforms and snippets built by the Design Éditorial team at Le Monde. The [master branch](https://github.com/lm-maxfab/lm-app/tree/master/src "master branch") contains an empty project with the latest version of the app wrapper. Every longform or snippet created from this repo has its own branch named after this template :

`[PROJECT-NB]-[YYMM]-[PROJECT-NAME]`.

## Installation

Before starting the installation process, make sure you have an up-to-date version of [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git "git") and [Node.js](https://nodejs.org/en/ "Node.js"), preferably installed via [nvm](https://github.com/nvm-sh/nvm "nvm").

```bash
# In a new terminal shell, navigate to the place you want to install the code: 
cd ~/wherever/you/want

# Clone the repo
git clone https://github.com/lm-maxfab/lm-app

# Hop into the project and install its dependencies
cd lm-app && npm i

# Start the dev server
npm start
```

## File structure

Note: this project has been bootstraped via [`create-react-app`](https://github.com/facebook/create-react-app), hence, no need for Webpack/Babel configuration.

|Path|Purpose|
|--|--|
|`package.json`|The ID card of the project, where dependencies and scripts are referenced|
|`tsconfig.json`|File descriptor of how TypeScript should be compiled for this project|
|`.templates`|Blank file templates|
|`build`|Where the bundled code outputs|
|`node_modules`|Where all the external dependencies are installed|
|`public`|Where lives the external contents of the React app, the index.html, the styles, the visual assets...|
|`scripts`|Scripts used for project development, like starting a dev server or bundling the production build|
|`src`|Where the actual code is|

## Spreadsheets

The longforms can rely on data hosted in a remote TSV file. You can host the TSV file yourself, any URL will do. You can also create a Google Spreadsheet and link it to lm-wiki/sheet-happens if you know how.

Here is the procedure to create a correctly formed TSV file that can be read by the longform.

### 1. Init the file
- Create an empty tsv file
- Fill the first cells as follows: A1 = `key`, A2 = `name`, A3 = `type`
- If you read the file via lm-wiki/sheet-happens

The TSV file is supposed to work as a regular database containing tables. Each line under the first
