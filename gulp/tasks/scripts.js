const gulp = require('gulp');
const webpackStream = require("webpack-stream");
const webpack = require("webpack");

const $ = require('../plugins');
const DIR = require('../conf').DIR;
const conf = require('../conf').scripts;

gulp.task('scripts', () => {
  conf.webpack.mode = process.env.NODE_ENV;
  if (conf.webpack.mode == 'development') {
    return webpackStream(conf.webpack, webpack)
      .pipe(gulp.dest(conf.dest[conf.webpack.mode]));
  } else {
    return webpackStream(conf.webpack, webpack)
      .pipe($.rename({suffix: '.min'}))
      .pipe(gulp.dest(conf.dest[conf.webpack.mode]));
  }
});
