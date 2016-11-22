const gulp = require('gulp');

const $ = require('../plugins');
const conf = require('../conf').minifyCss;

gulp.task('minifyCss', () => {
  return gulp.src(conf.src)
    .pipe($.minifyCss())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(conf.dest));
});
