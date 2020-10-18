const { default: webpackConfig, paths } = require('./webpack.config.utils')

module.exports = (env, options) => {
  const { src, dist } = paths()
  return webpackConfig(env, options, {
    entry: { app: src('main.ts') },
  })
}
