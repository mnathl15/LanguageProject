const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
        {
            test: path.join(__dirname, '.'),
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            options: {
                presets: [ 
                          '@babel/preset-env',
                          '@babel/react',{
                          'plugins': ['@babel/plugin-proposal-class-properties']}]
            }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public')
  }
};