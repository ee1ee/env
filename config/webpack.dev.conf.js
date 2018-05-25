const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {sandbox} = require('./index')

module.exports = {
  mode: 'development',
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
    filename: 'static/js/[name].[hash].js',
    chunkFilename: 'static/js/[name].[hash].js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../static'),
    compress: true,
    historyApiFallback: {
      index: path.resolve(__dirname, `../dist/${process.env.npm_package_name}/index.html`),
      rewrites: [
        {
          from: `/${process.env.npm_package_name}/static/`, 
          to(context){
            return context.parsedUrl.pathname.replace(`${process.env.npm_package_name}/static/`, '')
          }
        }
      ]
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Expose-Headers": "*"
    },
    stats: 'errors-only',
    port: 8080,
    open: true,
    publicPath: `/${process.env.npm_package_name}/`,
    openPage: `mobileapps/${process.env.npm_package_name}/`,
    hot: true,
    clientLogLevel: 'warning'
  },
  devtool: 'cheap-module-eval-source-map',
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
          'style-loader',
          {
            loader: 'css-loader',
            options: {importLoaders: 1}
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, '../src')],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {importLoaders: 2}
          },
          'postcss-loader',
          'sass-loader'
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
    minimizer: [],
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
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        ...sandbox,
        'NODE_ENV': '"development"'
      }
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      templateParameters: {
        faviconPath: `/${process.env.npm_package_name}/static/img/favicon.ico`
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
