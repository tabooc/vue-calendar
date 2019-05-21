/**  
 * vue-calendar
*/

Vue.component('calendar', {
    template: '#calendar',
    props: [ 'callback' ],
    data() {
        return {
            currentYear: 1970,
            currentMonth: 1,
            currentDay: 1,
            currentWeek: 1,
            cellNumber: 42,
            weekArray: [ '日', '一', '二', '三', '四', '五', '六' ],
            dates: []
        };
    },
    created() {
        this.initData();
    },
    methods: {
        // dateStr: yyyy-MM-dd格式字符串
        initData(dateStr) {
            var date;

            if (dateStr) {
                date = new Date(dateStr);
            } else {
                let now = new Date(),
                    d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1));

                d.setDate(this.cellNumber);
                date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
            }

            this.currentYear = date.getFullYear();
            this.currentMonth = date.getMonth() + 1; // 0~11
            this.currentDay = date.getDate();
            this.currentWeek = date.getDay();// 0~6

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
            var d = new Date(this.formatDate(year, month, 1));
            d.setDate(0);
            this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        },
        // 下个月
        pickNext(year, month) {
            var d = new Date(this.formatDate(year, month, 1));
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
            var source = number,
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
            return this.pad(year) + '-' + this.pad(month, 2) + '-' + this.pad(day, 2);
        },
        // 根据节点的日期设置不同className
        setClassName(dateObject) {
            if (dateObject.day.getMonth() + 1 != this.currentMonth) {
                return 'plain-calendar__other-month';
            }

            if (dateObject.day.getFullYear() == new Date().getFullYear() && dateObject.day.getMonth() == new Date().getMonth() && dateObject.day.getDate() == new Date().getDate()) {
                return 'plain-calendar__now';
            }

            return 'plain-calendar__normal';
        },
        // 对选择的时间节点进行处理
        selDate(dateObject, event) {
            var node = event.currentTarget,
                siblings = this.siblings(node);

            node.classList.add('plain-calendar__selected');

            for (let i = 0; i < siblings.length; i++) {
                siblings[i].classList.remove('plain-calendar__selected');
            }

            this.$props['callback'](this.formatDate(dateObject.day.getFullYear(), dateObject.day.getMonth() + 1, dateObject.day.getDate()), dateObject);
        },
        // 获取指定节点的兄弟节点
        siblings(elem) {
            var nodes = [],
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
