var path = require('path');
var webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({"process.env": {NODE_ENV: JSON.stringify("production")}}),
        new webpack.optimize.DedupePlugin(), //dedupe similar code
        new webpack.optimize.UglifyJsPlugin(), //minify everything
        new webpack.optimize.AggressiveMergingPlugin()//Merge chunks
    ],
	entry: {
		'app': ['./static/js/app.jsx'],
		'searchBox': ['./searchBox.user'],
        'inventory': ['./src/inventory.jsx'],
        'expeditions': ['./src/expeditionsHelper.jsx']
	},
  output: { path: __dirname+'/build', filename: '[name].js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
            plugins: ["transform-decorators-legacy"],
          presets: ['es2015', 'react', 'stage-1']
        }
      },
        {
      test: /\.css$/,
      loaders: ['style', 'css']
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'postcss', 'sass']
    }, {
      test: /\.less$/,
      loaders: ['style', 'css', 'less']
    }, {
      test: /\.woff$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
    }, {
      test: /\.woff2$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"
    }, {
      test: /\.(eot|ttf|svg|gif|png)$/,
      loader: "file-loader"
    }]
  },
};
