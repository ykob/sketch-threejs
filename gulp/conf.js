// 設定ファイル
// 対象パスやオプションを指定

const DIR = module.exports.DIR =  {
  PATH: '/sketch-threejs',
  SRC: 'src',
  DEST: 'dst',
  BUILD: 'build'
};

module.exports.serve = {
  dest: {
    //tunnel: 'test',
    notify: false,
    startPath: DIR.PATH,
    ghostMode: false,
    server: {
      baseDir: DIR.DEST,
      index: 'index.html',
      routes: {
        [DIR.PATH]: `${DIR.DEST}/`
      }
    }
  },
  build: {
    //tunnel: 'test',
    notify: false,
    startPath: DIR.PATH,
    ghostMode: false,
    server: {
      baseDir: DIR.BUILD,
      index: 'index.html',
      routes: {
        [DIR.PATH]: `${DIR.BUILD}/`
      }
    }
  }
};

module.exports.scripts = {
  common: '',
  entryFiles: [
    `./${DIR.SRC}/js/main.js`,
  ],
  browserifyOpts: {
    transform: [
      ['babelify', {
        babelrc: false,
        presets: ['es2015']
      }],
      'envify',
      'glslify'
    ]
  },
  dest: `${DIR.DEST}/js`
};

module.exports.vendorScripts = {
  src: [
    `./${DIR.SRC}/js/vendor/three.js`,
    `./${DIR.SRC}/js/vendor/dat.gui.js`,
    `./${DIR.SRC}/js/vendor/stats.js`,
    `./${DIR.SRC}/js/vendor/vue.js`,
  ],
  concat: 'vendor.js',
  dest: `./${DIR.DEST}/js/`
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
  browsers: [
    'last 2 versions',
    'ie >= 9',
    'Android >= 4',
    'ios_saf >= 8',
  ]
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

module.exports.minifyCss = {
  src: `${DIR.DEST}/css/main.css`,
  dest: `${DIR.BUILD}/css`
};

module.exports.uglify = {
  src: [
    `./${DIR.DEST}/js/vendor.js`,
    `./${DIR.DEST}/js/main.js`,
  ],
  dest: `${DIR.BUILD}/js`,
  opts: {
    preserveComments: 'some'
  }
};

module.exports.copy = {
  dest: {
    src: [
      `${DIR.SRC}/img/**/*.*`,
      `${DIR.SRC}/font/**/*.*`,
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
    ],
    dest: `${DIR.BUILD}`,
    opts: {
      base: `${DIR.DEST}`
    }
  }
};

module.exports.imagemin = {
  src: [
    `${DIR.DEST}/**/*.{jpg,jpeg,png,gif,svg}`
  ],
  dest: `${DIR.BUILD}/img`
};

module.exports.clean = {
  dest: {
    path: [
      `${DIR.DEST}/**/*.html`,
      `${DIR.DEST}/css/`,
      `${DIR.DEST}/js/`
    ]
  },
  build: {
    path: [`${DIR.BUILD}`]
  }
};
