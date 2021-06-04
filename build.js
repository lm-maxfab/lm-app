/* eslint-disable no-template-curly-in-string */

const _exec = require('child_process').exec
const promisify = require('util').promisify
const exec = promisify(_exec)

build()

/*
 * WIP
 * - Dev in site simulation, build in empty template
 * - Auto commit on build
 * - Build correctly the assets and stuff
 */

async function build () {
  try {
    await cmd('echo "\n👀 $(tput bold)Running standard.js...$(tput sgr0)\n"')
    await laxcmd('npx ts-standard --verbose | snazzy')

    await cmd('echo "\n📡 $(tput bold)Checking git status...$(tput sgr0)\n"')
    await cmd('git status')

    await cmd('echo "\n🧹 $(tput bold)Removing previous builds...$(tput sgr0)\n"')
    await cmd('rm -rfv ./build ./build.zip')

    await cmd('echo "\n🛠  $(tput bold)Building the app...$(tput sgr0)\n"')
    await cmd('INLINE_RUNTIME_CHUNK=false GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true react-scripts build')

    await cmd('echo "\n🧽 $(tput bold)Removing asset-manifest.json...$(tput sgr0)\n"')
    await cmd('rm -rfv ./build/asset-manifest.json')

    if (process.argv[2] === '--onefile') {
      await cmd('echo "\n🤖 $(tput bold)Creating gulpfile.js ...$(tput sgr0)\n"')
      await cmd('rm -rfv gulpfile.js')
      await cmd('echo "const gulp = require(\'gulp\')" >> gulpfile.js')
      await cmd('echo "const inlinesource = require(\'gulp-inline-source\')" >> gulpfile.js')
      await cmd('echo "const replace = require(\'gulp-replace\')" >> gulpfile.js')
      await cmd('echo "gulp.task(\'default\', () => gulp" >> gulpfile.js')
      await cmd('echo "  .src(\'./build/*.html\')" >> gulpfile.js')
      await cmd('echo "  .pipe(replace(\'.js\\"></script>\', \'.js\\" inline></script>\'))" >> gulpfile.js')
      await cmd('echo "  .pipe(replace(\'rel=\\"stylesheet\\">\', \'rel=\\"stylesheet\\" inline>\'))" >> gulpfile.js')
      await cmd('echo "  .pipe(inlinesource())" >> gulpfile.js')
      await cmd('echo "  .pipe(gulp.dest(\'./build\')))" >> gulpfile.js')
      await cmd('cat gulpfile.js')

      await cmd('echo "\n📦 $(tput bold)Bundling everything inside index.html...$(tput sgr0)\n"')
      await cmd('npx gulp')

      await cmd('echo "\n🧽 $(tput bold)Removing bundled files...$(tput sgr0)\n"')
      await cmd('rm -rfv build/static')

      await cmd('echo "\n🧽 $(tput bold)Removing gulpfile.js...$(tput sgr0)\n"')
      await cmd('rm -rfv gulpfile.js')
    }

    await cmd('touch build/.DS_Store')
    await cmd('echo "\n🧽 $(tput bold)Removing .DS_Store files...$(tput sgr0)\n"')
    await cmd('find . -name ".DS_Store" -print -delete')

    await cmd('echo "\n🤐 $(tput bold)Zipping the build...$(tput sgr0)\n"')
    await cmd('zip -r build.zip build')

    await cmd('echo "\n🍸 $(tput bold)That\'s all good my friend!$(tput sgr0)\n"')
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}

async function cmd (line) {
  const { stdout, stderr } = await exec(line)
  if (stderr) throw stderr
  else if (stdout) console.log(stdout)
}

async function laxcmd (line) {
  try {
    await cmd(line)
  } catch (err) {
    console.log(err.stdout)
    console.log(err.stderr)
  }
}
