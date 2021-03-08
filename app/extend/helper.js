// import hmac_sha1 from 'hmac_sha1';
module.exports = {
    formatDate(value,fmt) {
        function format(value,fmt) {
            var date = new Date(value);
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "w+": date.getDay(), //星期
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if(k === 'w+') {
                    if(o[k] === 0) {
                        fmt = fmt.replace('w', '周日');
                    }else if(o[k] === 1) {
                        fmt = fmt.replace('w', '周一');
                    }else if(o[k] === 2) {
                        fmt = fmt.replace('w', '周二');
                    }else if(o[k] === 3) {
                        fmt = fmt.replace('w', '周三');
                    }else if(o[k] === 4) {
                        fmt = fmt.replace('w', '周四');
                    }else if(o[k] === 5) {
                        fmt = fmt.replace('w', '周五');
                    }else if(o[k] === 6) {
                        fmt = fmt.replace('w', '周六');
                    }
                }else if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
        if(value) {
            value = format(value, fmt);
        }
        return value;
    },
    // 生成uid
    creatUid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    __newMsg(code, text, data) {
        var info;
        if (text && text.constructor == Array) {
            if (text.length >= 2) {
                info = text[1];
            };
            text = text[0];
        };
        return {
            code: code,
            msg: text,
            info: info,
            data: Object(data),
            time: Number(new Date()),
        };
    },
    __errorHandle(msg,code) {
        this.ctx.body = this.__newMsg(code || 400,msg);
    },
}