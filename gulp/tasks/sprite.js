const gulp = require('gulp');
const merge = require('merge-stream');

const $ = require('../plugins');
const conf = require('../conf').sprite;

gulp.task('sprite', function () {
  const spriteData = gulp.src(conf.src)
    .pipe($.spritesmith(conf.opts));
  const imgStream = spriteData.img
    .pipe(gulp.dest(conf.dest.img));
  const cssStream = spriteData.css
    .pipe(gulp.dest(conf.dest.css));
  return merge(imgStream, cssStream);
});
