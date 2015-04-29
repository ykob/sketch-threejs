var path = {
  src: './src',
  dst: './'
};

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: path.dst
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('uglify', function(){
  var src = [path.src + '/js/*.js'];
  var dst = path.dst + '/js/';
  
  gulp.src(src)
    .pipe(plumber())
    .pipe(concat('common.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dst))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('sass', function() {
  var src = [path.src + '/scss/style.scss'];
  var dst = path.dst + '/css/';
  var option = {
    style: 'compressed'
  };
  
  return sass(src, option)
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dst))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('watch', function(){
  gulp.watch(path.dst + '/*.html', ['bs-reload']);
  gulp.watch(path.src + '/js/*.js', ['uglify']);
  gulp.watch(path.src + '/scss/*.scss', ['sass']);
});

gulp.task('default', ['browser-sync', 'watch']);
