const gulp = require('gulp');
const del = require('del');

const conf = require('../conf').clean;

gulp.task('cleanDest', cb => {
  del(conf.dest.path).then(() => {
    cb();
  });
});

gulp.task('cleanBuild', cb => {
  del(conf.build.path).then(() => {
    cb();
  });
});
