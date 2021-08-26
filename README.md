# LM App.

This repo contains the code for the generic app structure of the longforms and snippets built by the Design Éditorial team at Le Monde. The [master branch](https://github.com/lm-maxfab/lm-app/tree/master/src "master branch") contains an empty project with the latest versin of the app wrapper. Every longform or snippet created from this repo has it's own branch named after this template :

`[PROJECT-NB]-[YYMM]-[PROJECT-NAME]`.

## Installation

- Have an up-to-date version of [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git "git"), and [Node.js](https://nodejs.org/en/ "Node.js"), preferably installed via [nvm](https://github.com/nvm-sh/nvm "nvm").
- In a new terminal shell, navigate to the place you want to install the code: 
```bash
> cd ~/wherever/you/want
```
- Clone the repo
```bash
> git clone https://github.com/lm-maxfab/lm-app
```
- Hop into the project and install its dependencies
```bash
> cd lm-app && npm i
```
- Start the dev server
```bash
> npm start
```

## File structure

|Path|Purpose|
|--|--|
|`package.json`|The ID card of the project, where dependencies and scripts are referenced|
|`tsconfig.json`|File descriptor of how typescript should be compiled for this project|
|`.templates`|Blank file templates|
|`build`|Where the bundled code outputs|
|`node_modules`|Where all the external dependencies are installed|
|`public`|Where lives the external contents of the React app, the index.html, the styles, the visual assets...|
|`scripts`|Scripts used for project development, like starting a dev server or bundling the production build|
|`src`|Where the code is|
