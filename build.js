const _exec = require('child_process').exec
const promisify = require('util').promisify
const exec = promisify(_exec)

build()

async function build () {
  try {
    console.log('\n🛠  Building app...\n')
    var { stdout, stderr } = await exec('rm -rf ./build.zip && INLINE_RUNTIME_CHUNK=false GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true react-scripts build')
    if (stderr) throw stderr
    console.log(stdout)
    
    console.log('\n📦 Bundling everything inside index.html...\n')
    var { stdout, stderr } = await exec('npx gulp')
    if (stderr) throw stderr
    console.log(stdout)

    console.log('\n🧹 Removing unnecessary files...\n')
    var { stdout, stderr } = await exec('rm -rfv ./build/static ./build/asset-manifest.json')
    if (stderr) throw stderr
    console.log(stdout)

    console.log('\n🤐 Zipping the build...\n')
    var { stdout, stderr } = await exec('zip -r build.zip build && rm -rfv build')
    if (stderr) throw stderr
    console.log(stdout)

    console.log('\n🍸 That\'s all good my friend!\n')
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}
