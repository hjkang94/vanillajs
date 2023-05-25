const path = require('path');

module.exports = {
  entry: './frontend/src/main.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'frontend/dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'frontend'),
    },
    historyApiFallback: true,
    hot: true,
    port: 8000,
  }
};