const _exec = require('child_process').exec
const promisify = require('util').promisify
const exec = promisify(_exec)

build()

async function build () {
  try {
    await cmd(`echo "\n🧹  Removing previous builds...\n"`)
    await cmd(`rm -rfv build build.zip`)

    await cmd(`echo "\n🛠  Building app...\n"`)
    await cmd(`INLINE_RUNTIME_CHUNK=false GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true react-scripts build`)
    
    if (process.argv[2] === '--onefile') {
      await cmd(`echo "\n🤖 Creating gulpfile.js ...\n"`)
      await cmd(`rm -rfv gulpfile.js`)
      await cmd(`echo "const gulp = require('gulp')" >> gulpfile.js`)
      await cmd(`echo "const inlinesource = require('gulp-inline-source')" >> gulpfile.js`)
      await cmd(`echo "const replace = require('gulp-replace')" >> gulpfile.js`)
      await cmd(`echo "gulp.task('default', () => gulp" >> gulpfile.js`)
      await cmd(`echo "  .src('./build/*.html')" >> gulpfile.js`)
      await cmd(`echo "  .pipe(replace('.js\\"></script>', '.js\\" inline></script>'))" >> gulpfile.js`)
      await cmd(`echo "  .pipe(replace('rel=\\"stylesheet\\">', 'rel=\\"stylesheet\\" inline>'))" >> gulpfile.js`)
      await cmd(`echo "  .pipe(inlinesource())" >> gulpfile.js`)
      await cmd(`echo "  .pipe(gulp.dest('./build')))" >> gulpfile.js`)
      await cmd(`echo gulpfile.js`)
      
      await cmd(`echo "\n📦 Bundling everything inside index.html...\n"`)
      await cmd(`npx gulp`)
      
      await cmd(`echo "\n🧽 Removing bundled files...\n"`)
      await cmd(`rm -rfv gulpfile.js build/static build/asset-manifest.json`)
    }
    
    await cmd(`echo "\n🤐 Zipping the build...\n"`)
    await cmd(`zip -r build.zip build`)
    
    await cmd(`echo "\n🍸 That\'s all good my friend!\n"`)
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}

async function cmd (line) {
  const { stdout, stderr } = await exec(line)
  if (stderr) throw stderr
  if (stdout) console.log(stdout)
}
