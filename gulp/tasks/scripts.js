const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const licensify = require('licensify');
const source = require('vinyl-source-stream');
const eventStream = require('event-stream');

const $ = require('../plugins');
const conf = require('../conf').scripts;

const bundler = (entry, isWatch) => {
  const bOpts = conf.browserifyOpts;
  var b;

  bOpts.entries = [conf.common, entry]

  if (isWatch) {
    // bOpts.debug = true
    bOpts.cache = {};
    bOpts.packageCache = {};
    bOpts.fullPath = true;
    b = watchify(browserify(bOpts));
  } else {
    b = browserify(bOpts);
  }

  if (process.env.NODE_ENV === 'production') {
    b.plugin(licensify);
  }

  const bundle = () => {
    return b.bundle()
      .on('error', err => {
        console.log(`bundle error: ${err}`);
      })
      .pipe(source(entry))
      .pipe($.rename({
        dirname: '',
        extname: '.js'
      }))
      .pipe(gulp.dest(conf.dest));
  };

  b
  .on('update', bundle)
  .on('log', message => {
    console.log(message);
  });

  return bundle();
};

gulp.task('browserify', () => {
  const tasks = conf.entryFiles.map(entry => {
    return bundler(entry);
  });
  return eventStream.merge.apply(null, tasks);
});

gulp.task('watchify', () => {
  const tasks = conf.entryFiles.map(entry => {
    return bundler(entry, true);
  });
  return eventStream.merge.apply(null, tasks);
});
