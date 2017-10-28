import debounce from 'js-util/debounce';
import isiOS from 'js-util/isiOS';
import isAndroid from 'js-util/isAndroid';
import Hookes from './Hookes';
import ScrollItems from './ScrollItems';

const X_SWITCH_SMOOTH = 768;
const contents = document.querySelector('.js-contents');
const dummyScroll = document.querySelector('.js-dummy-scroll');

export default class SmoothScrollManager {
  constructor() {
    this.scrollItems = new ScrollItems(this);
    this.scrollTop = 0;
    this.scrollFrame = 0;
    this.resolution = {
      x: 0,
      y: 0
    };
    this.bodyResolution = {
      x: 0,
      y: 0
    };
    this.hookes = {};
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.renderPrev = null;
    this.renderNext = null;
    this.isWorking = false;
    this.isWorkingSmooth = false;

    this.on();
  }
  start(callback) {
    // Hookes と ScrollItems を初期化
    this.initHookes();
    this.scrollItems.init(document, contents);

    // Scroll Manager の動作を開始する
    this.resize(() => {
      this.scroll();
      this.isWorkingSmooth = true;
      this.renderLoop();
      if (callback) callback();
    });
  }
  initDummyScroll() {
    // ダミースクロールの初期化
    if (this.resolution.x <= X_SWITCH_SMOOTH) {
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
      contents: new Hookes({ k: 0.25, d: 0.7 }),
      smooth:   new Hookes({ k: 0.2, d: 0.8 }),
      parallax: new Hookes({ k: 0.2, d: 0.8 }),
    }
  }
  scrollBasis() {
    // 基礎的なスクロールイベントはここに記述する。
    // スクロール値を元に各Hookesオブジェクトを更新
    if (this.resolution.x > X_SWITCH_SMOOTH) {
      this.hookes.contents.anchor[1] = this.scrollTop * -1;
      this.hookes.smooth.velocity[1] += this.scrollFrame;
      this.hookes.parallax.anchor[1] = this.scrollTop + this.resolution.y * 0.5;
    }
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
    this.scrollItems.scroll();
    if (this.scrollNext) this.scrollNext();
  }
  resizeBasis() {
    // 基礎的なリサイズイベントはここに記述する。
  }
  resize(callback) {
    // リサイズイベントの一連の流れ
    // リサイズ中にスクロールイベントが勝手に叩かれるのをキャンセル
    this.isWorking = false;
    // 各値を取得
    this.scrollTop = window.pageYOffset;
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = document.body.clientWidth;
    this.bodyResolution.y = document.body.clientHeight;
    // window幅によってHookesオブジェクトの値を再設定する
    if (this.resolution.x > X_SWITCH_SMOOTH) {
      // PCの場合
      this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = -this.scrollTop;
      this.hookes.parallax.velocity[1] = this.hookes.parallax.anchor[1] = this.scrollTop;
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
    // 本文やダミースクロールのレイアウトを再設定
    this.initDummyScroll();
    this.render();
    window.scrollTo(0, this.scrollTop);
    // 個別のリサイズイベントを実行
    if (this.resizePrev) this.resizePrev();
    this.resizeBasis();
    this.scrollItems.resize();
    if (this.resizeNext) this.resizeNext();
    // スクロールイベントを再開
    this.isWorking = true;
    if (callback) callback();
  }
  render() {
    if (this.renderPrev) this.renderPrev();
    // 本文全体のラッパー(contents)をレンダリング
    contents.style.transform = `translate3D(0, ${this.hookes.contents.velocity[1]}px, 0)`;
    // Hookesオブジェクトをレンダリング
    for (var key in this.hookes) {
      this.hookes[key].render();
    }
    // スクロールイベント連動オブジェクトをレンダリング
    this.scrollItems.render(this.isWorking && this.resolution.x > X_SWITCH_SMOOTH);
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
    const hookEventForResize = (isiOS() || isAndroid()) ? 'orientationchange' : 'resize';

    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);
    window.addEventListener(hookEventForResize, debounce((event) => {
      this.resize();
    }, 400), false);
  }
  off() {
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.renderPrev = null;
    this.renderNext = null;
  }
}
