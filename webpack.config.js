var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {test: /\.scss?$/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
      {test: /\.css?$/, loaders: ['style-loader', 'css-loader', 'sass-loader']}
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    host: '0.0.0.0',
    disableHostCheck: true
  },
  devtool: '#eval-source-map'
}
module.exports.plugins= (module.exports.plugins || []).concat([
 new CopyWebpackPlugin([
    {
      from: 'index_prod.html',
      to: 'index.html',
      toType: 'file'
    },
  ])

  ]);
module.exports.plugins= (module.exports.plugins || []).concat([
 new CopyWebpackPlugin([
    {
      from: 'logo.png',
      to: 'logo.png',
      toType: 'file'
    },
  ])

  ]);

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    
    
    new webpack.optimize.OccurrenceOrderPlugin()
  ])
}
