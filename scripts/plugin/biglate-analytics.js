/***
 * CopyRight 
 * https://github.com/SunQQQ/SunQBlog-UserSide
 */
class BiglateAnalytics {

    client() {
        var that = this
        var _client = {
            browser: that.blowser(),
            screen: screen.width + "*" + window.screen.height,
        }
        return _client
    }

    blowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf('Opera') > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf('compatible') > -1
            && userAgent.indexOf('MSIE') > -1 && !isOpera; //判断是否IE浏览器
        var isEdge = userAgent.indexOf('Edge') > -1; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf('Firefox') > -1; //判断是否Firefox浏览器
        var isSafari = userAgent.indexOf('Safari') > -1
            && userAgent.indexOf('Chrome') == -1; //判断是否Safari浏览器
        var isChrome = userAgent.indexOf('Chrome') > -1
            && userAgent.indexOf('Safari') > -1; //判断Chrome浏览器

        if (isIE) {
            var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp['$1']);
            if (fIEVersion == 7) {
                return 'IE7';
            } else if (fIEVersion == 8) {
                return 'IE8';
            } else if (fIEVersion == 9) {
                return 'IE9';
            } else if (fIEVersion == 10) {
                return 'IE10';
            } else if (fIEVersion == 11) {
                return 'IE11';
            } else {
                return '0';
            }//IE版本过低
            return 'IE';
        }
        if (isFF) {
            return 'FireFox';
        }
        if (isOpera) {
            return 'Opera';
        }
        if (isEdge) {
            return 'Edge';
        }
        if (isChrome) {
            return 'Chrome';
        }
        if (isSafari) {
            return 'Safari';
        }
    }

    createLog(log) {
        var that = this
        var data = {
            module: log.module,
            operateType: log.operateType,
            title: log.title,
            intro: log.intro,
            fromUrl: document.referrer,
            localUrl: document.location.href,
            client: that.client(),
        }
        console.log(data)
    }

    demo() {
        var that = this
        that.createLog({
            module: 'page',
            operateType: 'view',
            title: '主页',
            intro: '潘深练的个人网站'
        })

        new AjaxRequest({
            type: "get",
            url: "https://api.map.baidu.com/location/ip",
            param: {
                ak: '9b055a31453d34f3f7bdde1590735347'
            },
            isShowLoader: true,
            dataType: "",
            callBack: function(res){
                console.log(res);
            }    
        });
    }
}