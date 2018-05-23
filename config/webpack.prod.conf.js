const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const Config = require('./index')
const env = process.env.npm_config_env || 'sandbox'

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, "../"),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
    extensions: [".js", ".json"]
  },
  entry: {
    app: ['./config/polyfills.js', './src/index.js']
  },
  output: {
    path: path.resolve(__dirname, `../dist/${process.env.npm_package_name}`),
    publicPath: `/${process.env.npm_package_name}/`,
    hashDigestLength: 5,
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '../src')],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, '../src')],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {importLoaders: 1}
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif|ico)(\?.*)?$/,
        include: [path.resolve(__dirname, '../src')],
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: 'static/img/[name].[hash:5].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        include: [path.resolve(__dirname, '../src')],
        loader: 'file-loader',
        options: {
          name: 'static/font/[name].[hash:5].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin(),
      new OptimizeCssAssetsPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /src/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          name: 'commons'
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1,
          name: 'vendor'
        },
        styles: {
          test: /\.css$/,
          chunks: 'all',
          minSize: 0,
          minChunks: 1,
          name: 'app',
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      verbose: false
    }),
    new CopyWebpackPlugin([
      {
        from: 'static',
        to: 'static'
      }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        ...Config[env],
        'NODE_ENV': '"production"'
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[chunkhash].css'
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      templateParameters: {
        faviconPath: `/${process.env.npm_package_name}/static/img/favicon.ico`
      }
    }),
    new CompressionWebpackPlugin({
      test: /\.(js|css)$/
    })
  ]
}
