const { debounce } = require('@ykob/js-util');
const isiOS = require('../old/isiOS');
const isAndroid = require('../old/isAndroid');
const Hookes = require('./Hookes').default;
const ScrollItems = require('./ScrollItems').default;

const contents = document.querySelector('.js-contents');
const dummyScroll = document.querySelector('.js-dummy-scroll');

export default class SmoothScrollManager {
  constructor() {
    this.scrollItems = new ScrollItems(this);
    this.scrollTop = 0;
    this.scrollFrame = 0;
    this.scrollTopPause = 0;
    this.resolution = {
      x: 0,
      y: 0
    };
    this.bodyResolution = {
      x: 0,
      y: 0
    };
    this.X_SWITCH_SMOOTH = 1024;
    this.hookes = {};
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.renderPrev = null;
    this.renderNext = null;
    this.isWorking = false;
    this.isWorkingSmooth = false;
    this.isAlreadyAddEvent = false;
  }
  start(callback) {
    setTimeout(() => {
      this.scrollTop = window.pageYOffset;

      // Hookes と ScrollItems を初期化
      this.initHookes();
      this.scrollItems.init();

      // hash があった場合は指定の箇所にスクロール位置を調整する
      const { hash } = location;
      const target = (hash) ? document.querySelector(hash) : null;
      let anchorY = 0;
      if (target) {
        const targetRect = target.getBoundingClientRect();
        anchorY = this.scrollTop + targetRect.top;
      }
      // 初期スクロール値を強制的に0にする。(pjax遷移の際に有効にする)
      // window.scrollTo(0, anchorY);
      // this.scrollTop = anchorY;

      // Scroll Manager の動作を開始する
      this.resize(() => {
        this.scroll();
        this.isWorkingSmooth = true;
        this.renderLoop();
        this.on();
        if (callback) callback();
      });
    }, 100);
  }
  pause() {
    // スムーススクロールの一時停止
    this.isWorking = false;
    contents.style.position = 'fixed';
    // スマホ時には本文のtranslate値を更新してスクロールを固定する。
    this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = this.scrollTop * -1;
    this.scrollTopPause = this.scrollTop;
    window.scrollTo(0, this.scrollTop);
  }
  play() {
    // スムーススクロールの再生
    contents.style.position = '';
    this.scrollTop = this.scrollTopPause;
    // スマホ時には本文のtranslate値をゼロにしてスクロールを復帰させる。
    if (this.resolution.x <= this.X_SWITCH_SMOOTH) {
      this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = 0;
    }
    window.scrollTo(0, this.scrollTop);
    this.isWorking = true;
  }
  initDummyScroll() {
    // ダミースクロールの初期化
    if (this.resolution.x <= this.X_SWITCH_SMOOTH) {
      contents.style.transform = '';
      contents.classList.remove('is-fixed');
      dummyScroll.style.height = `0`;
    } else {
      contents.classList.add('is-fixed');
      dummyScroll.style.height = `${contents.clientHeight}px`;
    }
    this.render();
  }
  initHookes() {
    // Hookesオブジェクトの初期化
    this.hookes = {
      contents: new Hookes({ k: 0.575, d: 0.8 }),
      smooth:   new Hookes({ k: 0.18, d: 0.75 }),
      parallax: new Hookes({ k: 0.28, d: 0.7 }),
    }
  }
  scrollBasis() {
    // 基礎的なスクロールイベントはここに記述する。
    // スクロール値を元に各Hookesオブジェクトを更新
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      this.hookes.contents.anchor[1] = this.scrollTop * -1;
      this.hookes.smooth.velocity[1] += this.scrollFrame;
      this.hookes.parallax.anchor[1] = this.scrollTop + this.resolution.y * 0.5;
    }
    // ScrollItems のスクロールメソッドを実行
    this.scrollItems.scroll();
  }
  scroll(event) {
    // スクロールイベントの一連の流れ
    // フラグが立たない場合はスクロールイベント内の処理を実行しない。
    if (this.isWorking === false) return;
    // スクロール値の取得
    const pageYOffset = window.pageYOffset;
    this.scrollFrame = pageYOffset - this.scrollTop;
    this.scrollTop = pageYOffset;
    // 個別のスクロールイベントを実行
    if (this.scrollPrev) this.scrollPrev();
    this.scrollBasis();
    if (this.scrollNext) this.scrollNext();
  }
  tilt(event) {
    if (this.isWorking === false) return;
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      this.hookes.parallax.anchor[0] = (event.clientX / this.resolution.x * 2 - 1) * -100;
    }
  }
  resizeBasis() {
    // 基礎的なリサイズイベントはここに記述する。
    // ScrollItems のリサイズメソッドを実行
    this.scrollItems.resize();
  }
  resize(callback) {
    // リサイズイベントの一連の流れ
    // リサイズ中にスクロールイベントが勝手に叩かれるのをキャンセル
    this.isWorking = false;
    // リサイズイベントに関する要素の一時リセット
    if (this.resizeReset) this.resizeReset();
    // 各値を取得
    this.scrollTop = window.pageYOffset;
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = document.body.clientWidth;
    this.bodyResolution.y = document.body.clientHeight;
    // window幅によってHookesオブジェクトの値を再設定する
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      // PCの場合
      this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = -this.scrollTop;
      this.hookes.parallax.velocity[1] = this.hookes.parallax.anchor[1] = this.scrollTop + this.resolution.y * 0.5;
    } else {
      // スマホの場合
      for (var key in this.hookes) {
        switch (key) {
          case 'contents':
          case 'parallax':
            this.hookes[key].anchor[1] = this.hookes[key].velocity[1] = 0;
            break;
          default:
            this.hookes[key].velocity[1] = 0;
        }
      }
    }
    // 個別のリサイズイベントを実行（ページの高さ変更前）
    if (this.resizePrev) this.resizePrev();
    // 本文やダミースクロールのレイアウトを再設定
    this.initDummyScroll();
    this.render();
    window.scrollTo(0, this.scrollTop);
    // 個別のリサイズイベントを実行（ページの高さ変更後）
    this.resizeBasis();
    if (this.resizeNext) this.resizeNext();
    // スクロールイベントを再開
    this.isWorking = true;
    if (callback) callback();
  }
  render() {
    if (this.renderPrev) this.renderPrev();
    // 本文全体のラッパー(contents)をレンダリング
    const y = Math.floor(this.hookes.contents.velocity[1] * 1000) / 1000;
    contents.style.transform = `translate3D(0, ${y}px, 0)`;
    // Hookesオブジェクトをレンダリング
    for (var key in this.hookes) {
      this.hookes[key].render();
    }
    // スクロールイベント連動オブジェクトをレンダリング
    this.scrollItems.render(this.isValidSmooth());
    if (this.renderNext) this.renderNext();
  }
  renderLoop() {
    this.render();
    if (this.isWorkingSmooth) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
  }
  on() {
    if (this.isAlreadyAddEvent) return;

    const hookEventForResize = (isiOS() || isAndroid()) ? 'orientationchange' : 'resize';

    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);
    window.addEventListener('mousemove', (event) => {
      this.tilt(event);
    }, false);
    window.addEventListener(hookEventForResize, debounce((event) => {
      this.resize();
    }, 400), false);

    this.isAlreadyAddEvent = true;
  }
  off() {
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.renderPrev = null;
    this.renderNext = null;
  }
  isValidSmooth() {
    return this.isWorkingSmooth && this.resolution.x > this.X_SWITCH_SMOOTH;
  }
}
