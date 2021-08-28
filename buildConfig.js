const { build } = require('esbuild');
const watch = process.argv[2]

const config = {
  minify: true,
  sourcemap: true,
  bundle: true,
  entryPoints: [
    './static/common/global.js',
    './static/common/global.css',
    './static/landing/index.js',
    './static/landing/landing.css',
    './static/main/index.js',
    './static/main/main.css',
    './static/signup/index.js',
    './static/signup/signup.css',
  ],
  entryNames: '[dir]/[name]',
  outdir: 'dist'
};

const refreshBuild = onceOrWatch => {
  if (onceOrWatch === 'watch') {
    setInterval(() => {
      build(config)
      console.log('refreshing')
    }, 10000);
  } else {
    build(config)
  }
}

refreshBuild(watch)