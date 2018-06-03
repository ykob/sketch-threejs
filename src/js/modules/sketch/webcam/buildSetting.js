const Vue = require('vue/dist/vue.min');

export default function() {
	return new Vue({
		el: '#vue-setting',
		data: {
			isOpened: 0,
		},
		mounted: function() {
		},
		methods: {
      toggleSetting: function() {
        this.isOpened = (this.isOpened === 1) ? 2 : 1;
      },
			openSetting: function() {
				this.isOpened = 1;
			},
			closeSetting: function() {
				this.isOpened = 2;
			},
		}
	})
}
