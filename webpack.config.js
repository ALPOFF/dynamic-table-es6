const path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/index.js', './src/styles.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  resolve: {
    extensions: [".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html' //relative to root of the application
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'file-loader',
                options: { outputPath: 'css/', name: '[name].css'}
            },
            'sass-loader'
        ]
      }
    ]
  }
};