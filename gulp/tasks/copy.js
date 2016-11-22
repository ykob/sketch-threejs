const gulp = require('gulp');

const conf = require('../conf').copy;

gulp.task('copyToDest', () => {
  return gulp.src(conf.dest.src, conf.dest.opts)
    .pipe(gulp.dest(conf.dest.dest));
});

gulp.task('copyToBuild', () => {
  return gulp.src(conf.build.src, conf.build.opts)
    .pipe(gulp.dest(conf.build.dest));
});
