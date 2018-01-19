const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    script: path.join(__dirname, 'src', 'script.js')
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: path.join('[name].js')
  },
  module: {
    // Here will be the loaders
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'es2016']
          }
        }
      },
      {
        test: /\.css$/, // File Type
        // use: ['style-loader', 'css-loader'] // Loader(s)
        use: ExtractTextPlugin.extract({ // Loader + Extractor Plugin
          use: 'css-loader'
        })
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1801975
          }
        }
      }
    ]
  },
  plugins: [
    // Here will be the imported plugins
    new ExtractTextPlugin(path.join('style.css'))
  ]
}