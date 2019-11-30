/**
 * Created by K on 2019/11/16.
 */
const path = require('path');
const webpack = require('webpack'); // 用于访问内置插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pages = [{
  title: '首页',
  name: 'index',
}, {
  title: '素材分类',
  name: 'material',
}, {
  title: '素材列表',
  name: 'material-list',
}, {
  title: '素材详情',
  name: 'material-detail',
}, {
  title: '案例中心',
  name: 'example-case',
}, {
  title: '案例列表',
  name: 'example-list',
}, {
  title: '案例详情',
  name: 'example-detail',
}, {
  title: '产品矩阵',
  name: 'product-matrix',
}, {
  title: '各地展厅',
  name: 'display-everywhere',
}, {
  title: '展厅详情',
  name: 'display-everywhere-detail',
}, {
  title: '企业介绍',
  name: 'enterprise',
}]

const outPath = '_dist'

const config = {
  entry: {
    // index: path.resolve(__dirname, './src/page/index'),
    // material: path.resolve(__dirname, './src/page/material'),
    vendors: './node_modules/vue'
  },
  output: {
    path: path.resolve(__dirname, outPath),
    filename: '[name].bundle.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.vue', '.es6', '.less']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true
        }
      },
      {
        test: /\.(less|css)/,
        use: ['style-loader', MiniCssExtractPlugin.loader,'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      // 处理字体文件
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?[\s\S]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 3048,
            name: 'static/fonts/[name].[ext]'
          }
        }]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),

    new VueLoaderPlugin(),

    new MiniCssExtractPlugin({
      filename: "[name].css"                     // 提取出来的css文件路径以及命名
    }),

    new CopyWebpackPlugin([
      {
        from: __dirname + '/static',
        to: `${__dirname}/${outPath}/static`
      }
    ])
  ]
};

config.optimization = {
  splitChunks: {
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        chunks: 'all',
        priority: -10 // 优先
      }
    }
  }
}

pages.forEach(function ({ name, title }) {

  config.entry[name] = path.resolve(__dirname, `./src/page/${name}`)

  config.plugins.push(new HtmlWebpackPlugin({
    title,
    filename: name + '.html',
    inject: 'body',
    chunks: ['vendors', name],
    template: path.resolve(__dirname, './src/index.html')
  }))

})

module.exports = function (env, argv) {

  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(argv.mode)
    }
  }))

  return config
};