/***
 * CopyRight 
 * https://github.com/SunQQQ/SunQBlog-UserSide
 */
class BiglateAnalytics {
    
    _LOCATION_COOKIE = '_wwwpanshenliancom_location'

    /**
     * 获取当前时间
     * @returns {string:YYYY-MM-DD hh:mm:ss}
     */
    getTime() {
        let dateObject = new Date(),
        year = dateObject.getFullYear(),
        month = dateObject.getMonth() + 1,
        day = dateObject.getDate(),
        hour = dateObject.getHours(),
        min = dateObject.getMinutes(),
        second = dateObject.getSeconds(),
        result = '';

        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        if (hour < 10) hour = '0' + hour;
        if (min < 10) min = '0' + min;
        if (second < 10) second = '0' + second;

        result = '' + year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second;
        return result;
    }

    /**
     * 设置cookie
     * @param key cookie名称
     * @param value cookie值
     * @param exHour 过期时间,单位小时
     */
    setCookie(key, value, exHour) {
        var d = new Date()
        d.setTime(d.getTime() + exHour * 60 * 60 * 1000)
        var expires = 'expires=' + d.toGMTString() // cookie的语法要求是这个标志，和这个时间格式
        document.cookie = key + '=' + value + '; ' + expires
    }

    /**
     * 获取cookie
     * @param key cookie的名称
     */
    getCookie(key) {
        let name = key + '=',
            cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
            let cleanItem = cookies[i].trim()
            if (cleanItem.indexOf(name) == 0) {
                return cleanItem.substring(name.length, cookies[i].length)
            }
        }
        return ''
    }

    removeCookie(key){
        var that = this
        that.setCookie(key, '', 0)
    }

    client() {
        var that = this
        var _client = {
            browser: that.blowser(),
            screen: screen.width + "*" + window.screen.height,
            userAgent:navigator.userAgent,
        }
        return _client
    }

    isPhone() {
        var isPhone = 0;
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            isPhone = 1;
        } 
        return isPhone;
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

    getLocation(callback) {
        let that = this,
          locationCookie = this.getCookie(that._LOCATION_COOKIE);
        if(locationCookie){
            let locationCookieData = JSON.parse(locationCookie)
            callback(locationCookieData);
        }else {
            new AjaxRequest({
                type: "get",
                url: "https://api.map.baidu.com/location/ip",
                param: {
                    ak: '6zR1Pk0LoCMv9NYFICGNSNHT2Qgrc9HF'
                },
                isShowLoader: true,
                dataType: "JSONP",
                callBack: function (locationData) {
                    callback(locationData);
                    // 相隔6小时同一浏览器再次访问时会重新定位
                    let jsonStr = JSON.stringify(locationData)
                    that.setCookie(that._LOCATION_COOKIE,jsonStr,6); 
                }
            })
        }
    }

    push(data) { 
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "https://open.panshenlian.com/app/data/analy/client/push",
            data: JSON.stringify(data),
            success: function(res){
                //console.log("push finished >>> " + JSON.stringify(res))
            }
        });
    }

    doCreateLog(location, log) {
        var that = this
        var data = {
            clientTime: that.getTime(),
            module: log.module,
            operateType: log.operateType,
            title: log.title,
            intro: log.intro,
            referrer: document.referrer,
            localUrl: document.location.href,
            pathName: document.location.pathname,
            location: location,
            isPhone: that.isPhone(),
            client: that.client(),
        }
        that.push(data) 
    }

    createLog(log) {
        var that = this
        that.getLocation(
            function(location){
                that.doCreateLog(location,log)
            }
        )
    } 
}

// demo
new BiglateAnalytics().createLog(
    {
        module : 'page', 
        operateType : 'view', 
        title : document.getElementsByTagName('title')[0].innerHTML, 
        intro : document.location.href
    }
)