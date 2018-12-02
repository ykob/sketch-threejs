const gulp = require('gulp');
const browserSync = require('browser-sync');
const path = require("path");
const slash = require('slash');
const fs = require('fs');
const url = require("url");
const pug = require('pug');

const DIR = require('../conf').DIR;
const conf = require('../conf').serve;
const confPug = require('../conf').pug;

const getPugTemplatePath = (baseDir, req)=>{
  const requestPath = url.parse(req.url).pathname;
  const suffix = path.parse(requestPath).ext ? '' : 'index.html';
  return path.join(baseDir, "src/html", requestPath, suffix);
}

const pugMiddleWare = (req, res, next) => {
  const requestPath = getPugTemplatePath(process.cwd(), req);
  const data = JSON.parse(fs.readFileSync(confPug.json));
  data.meta.domain = confPug.domain;
  data.meta.path = confPug.path;
  if (path.parse(requestPath).ext !== '.html') {
    return next();
  }
  let pugPath = slash(requestPath.replace('.html', '.pug'));
  if (DIR.PATH.length > 0) {
    pugPath = pugPath.replace(`/src/html${DIR.PATH}/`, '/src/html/');
  }
  console.log(`[BS] try to file ${pugPath}`);
  const content = pug.renderFile(pugPath, {
    data: data,
    pretty: true,
  });
  res.end(Buffer.from(content));
}

gulp.task('serve',()=> {
  if (process.env.NODE_ENV == 'production') {
    browserSync(conf.build);
  } else {
    conf.dest.server.middleware = [pugMiddleWare];
    browserSync(conf.dest);
  }
});
