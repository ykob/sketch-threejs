// imagemin with pngquant
const gulp = require('gulp');
const pngquant = require('imagemin-pngquant');

const $ = require('../plugins');
const conf = require('../conf').imagemin;

gulp.task('imagemin', () => {
  return gulp.src(conf.src)
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe($.rename(path => {
      path.dirname = path.dirname.replace('img', '.');
    }))
    .pipe(gulp.dest(conf.dest));
});
