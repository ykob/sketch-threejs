var gulp = require('gulp');
var sass = require('gulp-sass');
var CONFIG = require('../package.json').projectConfig;

gulp.task('sass', () => {
  return gulp.src([
      './' + CONFIG.SRC + '/scss/style.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css/'));
});
