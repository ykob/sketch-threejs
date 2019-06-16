const gulp = require('gulp');
const browserSync = require('browser-sync');

const $ = require('../plugins');
const DIR = require('../conf').DIR;

const reload = (done) => {
  browserSync.reload();
  done();
};

gulp.task('watch', () => {
  gulp.watch(
    [
      `./${DIR.SRC}/**/*.{scss,sass}`
    ],
    gulp.series('sass', reload)
  );

  gulp.watch(
    [
      `./${DIR.SRC}/**/*.pug`
    ],
    gulp.series(reload)
  );

  gulp.watch(
    [
      `./${DIR.SRC}/**/*.{js,vs,fs,glsl}`,
    ],
    gulp.series('scripts', reload)
  );

  gulp.watch(
    [
      `./${DIR.SRC}/{img,model,json}/**/*.*`,
    ],
    gulp.series('copyToDest', reload)
  );
});
