const gulp = require('gulp');

const $ = require('../plugins');
const conf = require('../conf').sass;

gulp.task('sass', () => {
  return gulp.src(conf.src)
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: conf.browsers,
      cascade: false
    }))
    .pipe($.rename(path => {
      path.dirname = path.dirname.replace('css', '.');
    }))
    .pipe(gulp.dest(conf.dest));
});
