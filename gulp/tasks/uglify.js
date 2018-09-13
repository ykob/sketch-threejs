const gulp = require('gulp');
const pump = require('pump');

const $ = require('../plugins');
const conf = require('../conf').uglify;

gulp.task('uglify', (cb) => {
  pump(
    [
      gulp.src(conf.src),
      $.uglify(conf.opts),
      $.rename({
        suffix: '.min'
      }),
      gulp.dest(conf.dest)
    ],
    cb
  );
});
