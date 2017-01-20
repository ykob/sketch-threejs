export default class ConsoleSignature {
  constructor() {
    this.message = `created by yoichi kobayashi`;
    this.url = `http://www.tplh.net`;
    this.show();
  }
  show() {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      const args = [
        `\n%c ${this.message} %c%c ${this.url} \n\n`,
        'color: #fff; background: #222; padding:3px 0;',
        'padding:3px 1px;',
        'color: #fff; background: #47c; padding:3px 0;',
      ];
      console.log.apply(console, args);
    } else if (window.console) {
      console.log(`${this.message} ${this.url}`);
    }
  }
}
