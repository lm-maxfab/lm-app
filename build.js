const _exec = require('child_process').exec
const promisify = require('util').promisify
const exec = promisify(_exec)

build()

async function build () {
  try {
    await cmd('echo "\n🛠  Building app...\n"')
    await cmd('rm -rf ./build.zip && INLINE_RUNTIME_CHUNK=false GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true react-scripts build')
    
    if (process.argv[2] === '--onefile') {
      await cmd('echo "\n📦 Bundling everything inside index.html...\n"')
      await cmd('npx gulp')
      
      await cmd('echo "\n🧹 Removing unnecessary files...\n"')
      await cmd('rm -rfv ./build/static ./build/asset-manifest.json')
    }
    
    await cmd('echo "\n🤐 Zipping the build...\n"')
    await cmd('zip -r build.zip build')
    
    await cmd('echo "\n🍸 That\'s all good my friend!\n"')
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}

async function cmd (line) {
  const { stdout, stderr } = await exec(line)
  if (stderr) throw stderr
  console.log(stdout)
}
