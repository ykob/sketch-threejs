const gulp = require('gulp');
const browserSync = require('browser-sync');

const conf = require('../conf').serve;

gulp.task('serve', () => {
  browserSync(conf.dest);
});

gulp.task('serveBuild', () => {
  browserSync(conf.build);
});
