const gulp = require('gulp');
const requireDir = require('require-dir');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const $ = require('./gulp/plugins');
const DIR = require('./gulp/conf').DIR;

requireDir('./gulp/tasks');

gulp.task('predefault', cb => {
  runSequence(
    'cleanDest',
    ['pug', 'sass', 'scripts', 'copyToDest'],
    'serve',
    cb
  );
});

gulp.task('default', ['predefault'], () => {
  $.watch(
    [`./${DIR.SRC}/**/*.{scss,sass}`],
    () => {
      gulp.start(['sass'])
    }
  ).on('change', reload);

  $.watch(
    [`./${DIR.SRC}/**/*.pug`],
    () => {
      gulp.start(['pug'])
    }
  ).on('change', reload);

  $.watch(
    [
      `./${DIR.SRC}/**/*.js`,
      `./${DIR.SRC}/**/*.vs`,
      `./${DIR.SRC}/**/*.fs`
    ],
    () => {
      gulp.start(['scripts'])
    }
  ).on('change', reload);
});

gulp.task('build', cb => {
  runSequence(
    'cleanDest',
    ['pug', 'sass', 'copyToDest'],
    'cleanBuild',
    'replaceHtml',
    ['minifyCss', 'scripts', 'imagemin'],
    'copyToBuild',
    cb
  );
});
