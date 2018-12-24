const gulp = require('gulp');

const $ = require('../plugins');
const conf = require('../conf').cleanCss;

gulp.task('cleanCss', () => {
  const rename = { suffix: '.min' };
  return gulp.src(conf.src)
    .pipe($.cleanCss())
    .pipe($.rename(rename))
    .pipe(gulp.dest(conf.dest));
});
