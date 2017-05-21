const gulp = require('gulp');

const $ = require('../plugins');
const conf = require('../conf').pug;

gulp.task('pug', () => {
  return gulp.src(conf.src)
    .pipe($.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
    }))
    .pipe($.data((file) => {
      return { data: require(`../../${conf.json}`) }
    }))
    .pipe($.pug(conf.opts))
    .pipe($.rename(path => {
      path.dirname = path.dirname.replace('html', '.');
    }))
    .pipe(gulp.dest(conf.dest));
});
