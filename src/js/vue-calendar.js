/**
 * vue-calendar
*/

Vue.component('calendar', {
	template: '#calendar',
	props: {
		// 选中日期后的回调
		callback: {
			type: Function
		},
		// 默认月份
		date: {
			type: [ String, Number ],
			default: Date.now()
		},
		// 最小可选值
		min: {
			type: [ String, Number ],
			default: 0
		},
		// 最大可选值
		max: {
			type: [ String, Number ],
			default: 0
		}
	},
	data() {
		return {
			currentYear: 1970,
			currentMonth: 1,
			currentDay: 1,
			currentWeek: 1,
			cellNumber: 42,
			weekArray: [ '日', '一', '二', '三', '四', '五', '六' ],
			dates: [],
			selTimestamp: 0
		};
	},
	created() {
		this.initData(this.date);
	},
	methods: {
		initData(defaultDate) {
			let date;

			if (defaultDate) {
				date = new Date(this.formatDate(new Date(defaultDate).getFullYear(), new Date(defaultDate).getMonth() + 1, 1));
			} else {
				let now = new Date(),
					d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1));

				d.setDate(this.cellNumber);
				date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
			}

			this.currentYear = date.getFullYear();
			this.currentMonth = date.getMonth() + 1; // 0~11
			this.currentDay = date.getDate();
			this.currentWeek = date.getDay(); // 0~6

			let str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);
			this.dates.length = 0;

			//初始化本周
			for (let i = this.currentWeek; i >= 0; i--) {
				let d = new Date(str);
				d.setDate(d.getDate() - i);

				let dateObject = {};
				dateObject.day = d;

				this.dates.push(dateObject);
			}

			//其他周
			for (let i = 1; i < this.cellNumber - this.currentWeek; i++) {
				let d = new Date(str);
				d.setDate(d.getDate() + i);

				let dateObject = {};
				dateObject.day = d;

				this.dates.push(dateObject);
			}
		},
		// 上个月
		pickPre(year, month) {
			let d = new Date(this.formatDate(year, month, 1));
			d.setDate(0);
			this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
		},
		// 下个月
		pickNext(year, month) {
			let d = new Date(this.formatDate(year, month, 1));
			d.setDate(this.cellNumber);
			this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
		},
		/**
         * 对目标元素按指定长度进行补0处理
         * @param  {Number} number
         * @param  {int} length
         * @return {String}
         */
		pad(number, length) {
			let source = number,
				pre = '',
				negative = source < 0,
				string = Math.abs(source).toString();

			if (string.length < length) {
				pre = new Array(length - string.length + 1).join('0');
			}

			return (negative ? '-' : '') + pre + string;
		},
		// 返回 yyyy-MM-dd 格式的字符串
		formatDate(year, month, day) {
			return this.pad(year) + '/' + this.pad(month, 2) + '/' + this.pad(day, 2);
		},
		// 检查日期是否在[min,max]之间
		checkLimit: function(dateObject) {
			if (this.min) {
				if (dateObject.day.getTime() - new Date(this.min) <= 0) {
					return true;
				}
			}

			if (this.max) {
				if (dateObject.day.getTime() - new Date(this.max) >= 0) {
					return true;
				}
			}

			return false;
		},
		// 根据节点的日期设置不同className
		setClassName(dateObject) {
			let className = '';

			if (this.checkLimit(dateObject)) {
				className = 'plain-calendar__date_dis ';
				return className;
			}

			if (dateObject.day.getMonth() + 1 != this.currentMonth) {
				className += 'plain-calendar__other-month ';
			}

			if (dateObject.day.getFullYear() == new Date().getFullYear() && dateObject.day.getMonth() == new Date().getMonth() && dateObject.day.getDate() == new Date().getDate()) {
				className += 'plain-calendar__now ';
			}

			className += 'plain-calendar__normal ';

			if (dateObject.day.getTime() - this.selTimestamp === 0) {
				className += 'plain-calendar__selected';
			}

			return className;
		},
		// 对选择的时间节点进行处理
		selDate(dateObject, event) {
			let node = event.currentTarget,
				siblings = this.siblings(node),
				state = 'disabled';

			if (!node.classList.contains('plain-calendar__date_dis')) {
				state = 'normal';
				this.selTimestamp = dateObject.day.getTime();
				node.classList.add('plain-calendar__selected');

				for (let i = 0; i < siblings.length; i++) {
					siblings[i].classList.remove('plain-calendar__selected');
				}
			}

			this.$props['callback'](this.formatDate(dateObject.day.getFullYear(), dateObject.day.getMonth() + 1, dateObject.day.getDate()), dateObject, state);
		},
		// 获取指定节点的兄弟节点
		siblings(elem) {
			let nodes = [],
				_elem = elem;

			while ((elem = elem.previousSibling)) {
				if (elem.nodeType == 1) {
					nodes.push(elem);
				}
			}

			elem = _elem;

			while ((elem = elem.nextSibling)) {
				if (elem.nodeType == 1) {
					nodes.push(elem);
				}
			}

			return nodes;
		}
	}
});
