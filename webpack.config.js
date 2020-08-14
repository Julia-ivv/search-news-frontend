const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    // savedArticles: './saved-articles/index.js',
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      images: path.resolve(__dirname, 'src/images/'),
    },
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/images/favicon.png'),
          to: path.resolve(__dirname, 'dist/images'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new OptimizeCssAssetWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      // eslint-disable-next-line global-require
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default'],
      },
      canPrint: true,
    }),
    new WebpackMd5Hash(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        use: [
          'file-loader?name=./images/[name].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader?name=./vendor/[name].[ext]'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },
};
