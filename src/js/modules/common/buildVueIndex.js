export default function(_this) {
  return new Vue({
    el: '#index',
    data: {
      isOpened: -1
    },
    methods: {
      toggle: function() {
        if (this.isOpened == 1) {
          this.isOpened = 0;
          _this.close();
        } else {
          this.isOpened = 1;
          _this.open();
        }
      }
    }
  })
}
