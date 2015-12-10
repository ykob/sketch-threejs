var gulp = require('gulp');
var browserSync = require('browser-sync');
var sequence = require('gulp-sequence');
var requireDir = require('require-dir');
var CONFIG = require('./package.json').projectConfig;

requireDir('./tasks');

reload = browserSync.reload;

// ローカルサーバ
gulp.task('serve', function() {
  var obj = {};
  
  return browserSync({
    notify: false,
    startPath: CONFIG.PATH,
    server: {
      baseDir: CONFIG.DST,
      index: 'index.html',
      routes: (
        obj['' + CONFIG.PATH] = '' + CONFIG.DST + CONFIG.PATH + '/',
        obj
      )
    }
  });
});

// 'default' タスク実行前に処理しておきたいタスク
gulp.task('start', sequence([
  'sass',
  'watchify'
], 'serve'));

// 作業開始
// ファイルの変更監視で対象タスク実行とブラウザのオートリロード
gulp.task('default', ['start'], function() {
  gulp.watch(['./' + CONFIG.SRC + '/**/*.{scss,sass}'], ['sass', reload]);
});
