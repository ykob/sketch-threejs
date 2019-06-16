// 設定ファイル
// 対象パスやオプションを指定

const DIR = module.exports.DIR =  {
  PATH: '/sketch-threejs',
  SRC: 'src',
  DEST: 'dst',
  BUILD: 'docs'
};
const WEBPACK_CONFIG = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
};

module.exports.serve = {
  dest: {
    //tunnel: 'test',
    notify: false,
    startPath: `${DIR.PATH}/`,
    ghostMode: false,
    server: {
      baseDir: DIR.DEST,
      index: 'index.html',
      routes: {
        [DIR.PATH]: `${DIR.DEST}/`
      }
    },
    https: true,
  },
  build: {
    //tunnel: 'test',
    notify: false,
    startPath: `${DIR.PATH}/`,
    ghostMode: false,
    server: {
      baseDir: DIR.BUILD,
      index: 'index.html',
      routes: {
        [DIR.PATH]: `${DIR.BUILD}/`
      }
    },
    https: true,
  }
};

const { DefinePlugin } = require('webpack');
module.exports.scripts = {
  src: [
    `./${DIR.SRC}/**/*.js`,
    `./${DIR.SRC}/**/*.vs`,
    `./${DIR.SRC}/**/*.fs`,
    `./${DIR.SRC}/**/*.glsl`,
  ],
  dest: {
    development: `./${DIR.DEST}/js/`,
    production: `./${DIR.BUILD}/js/`,
  },
  webpack: {
    entry: {
      main: `./${DIR.SRC}/js/main.js`,
    },
    output: {
      filename: `[name].js`
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
        },
        {
          test: /\.(glsl|fs|vs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'glslify-import-loader',
          }
        },
        {
          test: /\.(glsl|fs|vs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'raw-loader',
          }
        },
        {
          test: /\.(glsl|fs|vs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'glslify-loader',
          }
        }
      ]
    },
    plugins: [
      new DefinePlugin(WEBPACK_CONFIG),
    ],
  }
};

module.exports.pug = {
  src: [
    `${DIR.SRC}/**/*.pug`,
    `!${DIR.SRC}/**/_**/*.pug`,
    `!${DIR.SRC}/**/_*.pug`
  ],
  dest: `${DIR.DEST}`,
  json: `${DIR.SRC}/data.json`,
  opts: {
    pretty: true
  }
};

module.exports.sass = {
  src: [
    `${DIR.SRC}/**/*.{sass,scss}`,
    `!${DIR.SRC}/**/_**/*.{sass,scss}`,
    `!${DIR.SRC}/**/_*.{sass,scss}`
  ],
  dest: `${DIR.DEST}/css`,
};

module.exports.replace = {
  html: {
    src: [
      `${DIR.DEST}/**/*.html`
    ],
    dest: `${DIR.BUILD}`,
    path: `${DIR.PATH}`
  }
};

module.exports.sprite = {
  src: [
    `${DIR.SRC}/img/sprite/**/*.png`
  ],
  dest: {
    img: `${DIR.DEST}/img/common`,
    css: `${DIR.SRC}/css/foundation`
  },
  opts: {
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../img/common/sprite.png',
    padding: 10,
    cssOpts: {
      functions: false
    }
  }
};

module.exports.cleanCss = {
  src: `${DIR.DEST}/css/main.css`,
  dest: `${DIR.BUILD}/css`,
};

module.exports.uglify = {
  src: [
    `./${DIR.DEST}/js/vendor.js`,
    `./${DIR.DEST}/js/main.js`,
  ],
  dest: `${DIR.BUILD}/js`,
  opts: {
  }
};

module.exports.copy = {
  dest: {
    src: [
      `${DIR.SRC}/img/**/*.*`,
      `${DIR.SRC}/font/**/*.*`,
      `${DIR.SRC}/model/**/*.*`,
      `${DIR.SRC}/js/vendor/clmtrackr/**/*`,
    ],
    dest: `${DIR.DEST}`,
    opts: {
      base: `${DIR.SRC}`
    }
  },
  build: {
    src: [
      `${DIR.DEST}/img/**/*.ico`,
      `${DIR.DEST}/font/**/*.*`,
      `${DIR.DEST}/model/**/*.*`,
      `${DIR.DEST}/js/vendor/clmtrackr/**/*`,
    ],
    dest: `${DIR.BUILD}`,
    opts: {
      base: `${DIR.DEST}`
    }
  }
};

module.exports.imagemin = {
  src: [
    `${DIR.DEST}/**/*.{jpg,jpeg,png,gif,svg}`,
    `!${DIR.DEST}/img/**/no_compress/*.*`,
  ],
  dest: `${DIR.BUILD}/img`,
  opts: {
    pngquant: {
      quality: [0.6, 0.8],
      speed: 1,
    },
    mozjpeg: {
      quality: 80,
      progressive: true,
    },
    svgo: {
      plugins: [
        { removeViewBox: false },
        { cleanupIDs: true },
      ]
    },
  }
};

module.exports.clean = {
  dest: {
    path: [`${DIR.DEST}`]
  },
  build: {
    path: [`${DIR.BUILD}`]
  }
};
