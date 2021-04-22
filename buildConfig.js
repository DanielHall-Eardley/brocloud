const esbuild = require('esbuild')

esbuild.build({
  entryPoints: [
    'static/common/global.css',
    'static/landing/index.css',
    'static/landing/index.js',
    'static/main/index.css',
    'static/main/index.js',
    'static/signup/index.css',
    'static/signup/index.js',
  ],
  bundle: true,
  sourcemap: true,
  watch: true,
  outdir: 'dist',
  minify: true
}).then(result => {
  result.stop()
}).catch(error => {console.log(error)})

