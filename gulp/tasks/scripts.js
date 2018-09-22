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
  let bundler;

  bOpts.entries = [conf.common, entry]

  if (isWatch) {
    // bOpts.debug = true
    bOpts.cache = {};
    bOpts.packageCache = {};
    bOpts.fullPath = true;
    bundler = watchify(browserify(bOpts));
  } else {
    bundler = browserify(bOpts);
  }

  if (process.env.NODE_ENV === 'production') {
    bundler.plugin(licensify);
  }

  const bundle = () => {
    return bundler.bundle()
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

  bundler.on('update', bundle);
  bundler.on('log', (message) => {
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
