const gulp = require('gulp');
const babel = require('gulp-babel');
const pump = require('pump');

const $ = require('../plugins');
const conf = require('../conf').uglify;

gulp.task('uglify', (cb) => {
  pump(
    [
      gulp.src(conf.src),
      $.babel({
        babelrc: false,
        presets: [
          ['env', {
            targets: {
              browsers: ['last 2 versions', 'ie >= 11']
            }
          }]
        ]
      }),
      $.uglify(conf.opts),
      $.rename({
        suffix: '.min'
      }),
      gulp.dest(conf.dest)
    ],
    cb
  );
});
