export default function(_this) {
  return new Vue({
    el: '#index',
    data: {
      isOpened: false
    },
    methods: {
      toggle: function() {
        this.isOpened = !this.isOpened;
        if (this.isOpened) {
          _this.open();
        } else {
          _this.close();
        }
      }
    }
  })
}
