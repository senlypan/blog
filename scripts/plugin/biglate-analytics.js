/***
 * CopyRight 
 * https://github.com/SunQQQ/SunQBlog-UserSide
 */

var _BIGLATE_ANALYTICSvar 
var _zhubaiVue
var _zhubaiError=0

class BiglateAnalytics {
    
    _LOCATION_COOKIE = '_wwwpanshenliancom_location'
    _OPEN_API_ = 'https://open.panshenlian.com'
    _DNS_API_ = 'https://dns.panshenlian.com/npm'
    _ANALY_ = '/app/data/analy/client'
    _SCAN_ = '/app/data/scan/'

    init(){ 
        var that = this
        that.createLog(
            {
                module : 'page', 
                operateType : 'view', 
                title : document.getElementsByTagName('title')[0].innerHTML, 
                intro : document.location.href
            }
        )
        if ( "/visit/" == document.location.pathname ){   
            that.buildSource(14) 
            that.buildTrend(14)
            that.buildTrack(2)
        }
        if ( "/2022/07/11/trial-001-zhubai/" == document.location.pathname ){
            that.buildZhubaiRand()
        }
    }

    buildTrack(_ds){
        var that = this
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: that._OPEN_API_ + that._ANALY_ + "/track/"+_ds,
            success: function(res){ 
                that.buildTrackVue(res,_ds)
            }
        });
    }

    buildTrend(_ds){
        var that = this
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: that._OPEN_API_ + that._ANALY_ + "/trend/"+_ds,
            success: function(res){ 
                that.buildTrendVue(res,_ds)
            }
        });
    }

    buildSource(_ds){
        var that = this
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: that._OPEN_API_ + that._ANALY_ + "/source/"+_ds,
            success: function(res){ 
                that.buildSourceVue(res,_ds)
            }
        });
    }

    buildZhubaiRand(){
        var that = this
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: that._OPEN_API_ + that._SCAN_ + "/zhubai/list/rand",
            success: function(res){ 
                that.buildZhubaiRandVue(res)
            }
        });
    }

    buildTrackVue(res,_ds){
        var that = this
        if (res && res.code == 200){
            document.getElementById("visit-user-track").innerHTML =   
                    '<div style="margin-bottom:10px;"> \
                        <div v-for="nav in navs" style="display:inline-block;"> \
                            <span v-bind:class="[nav.btnClass]" v-on:click="_BIGLATE_ANALYTICS.buildTrack(nav.ds)"> \
                                {{nav.title}} \
                            </span>  \
                            <span v-if="nav.split === true" >&nbsp;&nbsp;|&nbsp;&nbsp;</span>\
                        </div>  \
                        <div style="display:inline-block;float:right;"> \
                            轨迹总数：{{items.length}} \
                        </div>  \
                    </div> \
                    <table class="table table-striped" > \
                        <thead> \
                            <tr> \
                                <th width="15%" style="font-weight:100;" >访问IP</th> \
                                <th width="30%" style="font-weight:100;" >操作内容</th> \
                                <th width="20%" style="font-weight:100;" >访问来源</th> \
                                <th width="10%" style="font-weight:100;" >访问设备</th> \
                                <th width="20%" style="font-weight:100;" >访问时间</th> \
                            </tr> \
                        </thead> \
                        <tbody style="font-size:14px;"> \
                            <tr v-for="item in items" style="vertical-align:middle"> \
                                <td >{{item.ci}}</td> \
                                <td> \
                                    <span v-for="vtlItem in item.vtl"> \
                                        <span v-if="vtlItem.md === \'page\'"> \
                                            · <a :href=vtlItem.pn>{{vtlItem.tl}} </br>\
                                        </span> \
                                    <span>\
                                </td> \
                                <td>{{item.la}}</td> \
                                <td> \
                                {{item.st}}</br>{{item.cbt}}</br>{{item.cs}}  \
                                </td> \
                                <td>{{item.ct}}</td> \
                            </tr> \
                        </tbody> \
                    </table>' 
            var _userTrackVue = new Vue({
                el: '#visit-user-track',
                data: {
                    navs:[
                        {title:'今天',ds:1,split:true,btnClass:(1==_ds?'':'btn-link')},
                        {title:'最近2天',ds:2,split:true,btnClass:(2==_ds?'':'btn-link')},
                        {title:'最近3天',ds:3,split:false,btnClass:(3==_ds?'':'btn-link')},
                    ],
                    items: res.data
                }
            })
        }
    }

    buildTrendVue(res,_ds){
        var that = this
        if (res && res.code == 200){
            document.getElementById("visit-user-trend").innerHTML =   
                    '<div style="margin-bottom:10px;"> \
                        <div v-for="nav in navs" style="display:inline-block;"> \
                            <span v-bind:class="[nav.btnClass]" v-on:click="_BIGLATE_ANALYTICS.buildTrend(nav.ds)"> \
                                {{nav.title}} \
                            </span>  \
                            <span v-if="nav.split === true" >&nbsp;&nbsp;|&nbsp;&nbsp;</span>\
                        </div>  \
                    </div> '
            var _userTrendVue = new Vue({
                el: '#visit-user-trend',
                data: {
                    navs:[
                        {title:'最近7天',ds:7,split:true,btnClass:(7==_ds?'':'btn-link')},
                        {title:'最近14天',ds:14,split:true,btnClass:(14==_ds?'':'btn-link')},
                        {title:'最近30天',ds:30,split:true,btnClass:(30==_ds?'':'btn-link')},
                        {title:'最近60天',ds:60,split:false,btnClass:(60==_ds?'':'btn-link')}
                    ]
                }
            })
            // casvas
            $('#visit-user-trend-chart').remove();
            $("#visit-user-trend").append('<div id="visit-user-trend-chart" style="width: 100%;height:400px;"></div>');
            var myChart = echarts.init(document.getElementById('visit-user-trend-chart'));
            // data
            var dts=new Array()
            var rns=new Array()
            var ins=new Array()
            res.data.forEach((item,index) => {
                dts.push(item.dt)
                rns.push(item.rn)
                ins.push(item.in)
            })
            // option
            var option = {
                tooltip: {},
                xAxis: {
                    data: dts
                },
                yAxis: {},
                series: [
                    {
                        name: '独立IP数',
                        type: 'line',
                        data: ins,
                        smooth: true
                    },
                    {
                        name: '浏览量',
                        type: 'line',
                        data: rns,
                        smooth: true
                    }
                ]
            }
            // 绘制图表
            myChart.setOption(option);
        }
    }

    buildSourceVue(res,_ds){
        var that = this
        if (res && res.code == 200){
            document.getElementById("visit-user-source").innerHTML =   
                    '<div style="margin-bottom:10px;"> \
                        <div v-for="nav in navs" style="display:inline-block;"> \
                            <span v-bind:class="[nav.btnClass]" v-on:click="_BIGLATE_ANALYTICS.buildSource(nav.ds)"> \
                                {{nav.title}} \
                            </span>  \
                            <span v-if="nav.split === true" >&nbsp;&nbsp;|&nbsp;&nbsp;</span>\
                        </div>  \
                    </div> '
            var _userSourceVue = new Vue({
                el: '#visit-user-source',
                data: {
                    navs:[
                        {title:'今天',ds:1,split:true,btnClass:(1==_ds?'':'btn-link')},
                        {title:'最近7天',ds:7,split:true,btnClass:(7==_ds?'':'btn-link')},
                        {title:'最近14天',ds:14,split:true,btnClass:(14==_ds?'':'btn-link')},
                        {title:'最近30天',ds:30,split:true,btnClass:(30==_ds?'':'btn-link')},
                        {title:'最近60天',ds:60,split:false,btnClass:(60==_ds?'':'btn-link')},
                    ]
                }
            })
            // render
            $('#visit-user-source-chart').remove();
            $("#visit-user-source").append('<div id="visit-user-source-chart" style="width: 910px;height:650px;"></div>');
            var myChart = echarts.init(document.getElementById('visit-user-source-chart')); 
            const data = res.data.mdl;
            const geoCoordMap = res.data.gcm;   
            const convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            };  

            var option = {
                tooltip: {
                    show: false
                },
                geo: {
                    map: "china",
                    roam: false,// 一定要关闭拖拽
                    zoom: 1,
                    center: [105, 36], // 调整地图位置
                    label: {
                        normal: {
                            show: false, //省份名展示与否
                            fontSize: "10",
                            color: "#000"
                        },
                        emphasis: {
                            show: true
                        },
                        itemStyle: {
                          color: "#abcabc",
                        },
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "#ffffff",
                            borderColor: "#cccccc",
                            borderWidth: 1,
                            fontSize: "10",
                            color: "#000"
                        },
                        emphasis: {
                            areaColor: "#eeeeee",
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 5,
                            borderWidth: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                } ,
				series: [ 
					{
					  name: "全部访客来源",
					  type: "scatter",
					  coordinateSystem: "geo",
					  data: convertData(data), 
					  symbol: "circle",
					  symbolSize: 8,
					  hoverSymbolSize: 10, 
					  encode: {
						value: 2
					  },
					  label: {
						formatter: "{b}",
						position: "right",
						show: false
					  },
					  itemStyle: {
						color: "#01aaed",
					  },
					  emphasis: {
						label: {
						  show: false
						}
					  }
					},
					{
					  name: "Top 5",
					  type: "effectScatter",
					  coordinateSystem: "geo",
					  data: convertData(
                            data
                            .sort(function (a, b) {
                                return b.value - a.value;
                            })
                            .slice(0, 6)
                      ),
					  symbolSize: 15,
					  tooltip: {
						show: false
					  },
					  encode: {
						value: 2
					  },
					  showEffectOn: "render",
					  rippleEffect: {
						brushType: "stroke",
						color: "#01aaed",
						period: 9,
						scale: 5
					  },
					  hoverAnimation: true,
					  label: {
						formatter: "{b}",
						position: "right",
						show: true
					  },
					  itemStyle: {
						color: "#01aaed",
						shadowBlur: 2,
						shadowColor: "#333"
					  },
					  zlevel: 1
					}
				]
            }
            myChart.setOption(option);  
            
        }
    }

    enrollZhubai(){
        var that = this
        var kw = $("#zhubai_kw").val()
        if (kw){ 
            $("#zhubai_kw_rs").html("快马加鞭 ~ 传送中 ~")
            $("#zhubai_kw_rs").css("color","#ccc")
            $("#zhubai_error").html("")
            _zhubaiError = 0
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: that._OPEN_API_ + that._SCAN_ + "/zhubai/enroll/"+kw,
                success: function(res){ 
                    console.log("res>>>"+res)
                    $("#zhubai_kw").val("")
                    $("#zhubai_kw_rs").html("成功收录 ~ 你可真是棒棒 ~")
                    $("#zhubai_kw_rs").css("color","#60b044")
                    $("#zhubai_error").html("")
                    _zhubaiError = 0
                }
            });
        } else {
            _zhubaiError ++
            $("#zhubai_kw_rs").html("壮士 ~ 高抬贵手 ~")
            $("#zhubai_kw_rs").css("color","rgb(240, 5, 14)") 
            if ( Number(_zhubaiError) > Number(1) ){
                $("#zhubai_error").html( " x " + _zhubaiError)
                $("#zhubai_error").css("color","rgb(240, 5, 14)") 
            }
        }
    }

    buildZhubaiRandVue(res){
        var that = this
        if (res && res.code == 200){
            document.getElementById("zhubai-rand").innerHTML =    
                    '<div style="margin-bottom:10px;"> \
                        <div style="display:inline-block;"> \
                                <span class="input-group-addon" style="display:inline-block;">https://</span> \
                                <input type="text" class="form-control" id="zhubai_kw" style="display:inline-block;width:100px;"> \
                                <span class="input-group-addon" style="display:inline-block;">.zhubai.love/</span> \
                                <button  v-on:click="_BIGLATE_ANALYTICS.enrollZhubai()" \
                                    type="button" class="btn btn-primary" style="display:inline-block;margin:0px 15px;">提交收录</button> \
                                <span class="input-group-addon" style="display:inline-block;" id="zhubai_kw_rs" ></span> \
                                <span class="input-group-addon" style="display:inline-block;" id="zhubai_error" ></span> \
                        </div>  \
                        <div style="display:inline-block;margin-top:5px;color:rgb(240 5 14);float:right;"> \
                             {{zhubai_reflush_times}} 秒后自动刷新数据 \
                        </div>  \
                    </div> \
                    <table class="table table-striped" > \
                        <thead> \
                            <tr> \
                                <th width="10%" style="font-weight:100;" align="center">竹白</th> \
                                <th width="10%" style="font-weight:100;" align="center">配色推荐</th> \
                                <th width="20%" style="font-weight:100;" >专栏</th> \
                                <th width="15%" style="font-weight:100;" >作者</th> \
                                <th width="10%" style="font-weight:100;" >微信</th> \
                                <th width="10%" style="font-weight:100;" >邮箱</th> \
                                <th width="10%" style="font-weight:100;" >RSS</th> \
                                <th width="10%" style="font-weight:100;" >会员</th> \
                            </tr> \
                        </thead> \
                        <tbody style="font-size:14px;"> \
                            <tr v-for="item in items" style="vertical-align:middle"> \
                                <td :style="item.style"  align="center"> \
                                    <img :src="item.ar" height="50px" width="50px" :id="item.tk" \
                                        style="border-radius:50%;border:2px solid #fff;" > \
                                </td> \
                                <td style="white-space:nowrap;" align="center" vertical-align="middle"> \
                                    <span v-for="cc in item.color_arr" > \
                                        <span :style="cc"></span> \
                                    </span> \
                                </td> \
                                <td> \
                                    <a :href=item.tk target="_blank">《{{item.ne}}》</a> \
                                    <span style="color:#aaa"> | {{item.dp}}</span> \
                                </td> \
                                <td align="center">\
                                    {{item.am}} \
                                    <span v-if="item.fm === 1" \
                                        style="display:block;width:90px;border-radius:5%;background: rgb(212, 192, 130);padding:5px;color:#fff;font-size:12px;margin-top:10px;">\
                                            网友提交收录</span>\
                                    <span v-else-if="item.fm === 2" \
                                        style="display:block;width:90px;border-radius:5%;background: rgb(190, 81, 142);padding:5px;color:#fff;font-size:12px;margin-top:10px;">\
                                            搜索引擎抓取</span>\
                                    <span v-else \
                                        style="display:block;width:90px;border-radius:5%;background: rgb(172, 180, 188);padding:5px;color:#fff;font-size:12px;margin-top:10px;">\
                                            中英词库抓取</span>\
                                </td> \
                                <td align="center" ><span v-if="item.iw === true" >✔️</span><span v-else>❌</span></td> \
                                <td align="center" ><span v-if="item.ie === true" >✔️</span><span v-else>❌</span></td> \
                                <td align="center" ><span v-if="item.ir === true" >✔️</span><span v-else>❌</span></td> \
                                <td align="center" style="white-space:nowrap;"> \
                                    <span v-if="item.fs === true" > \
                                        <ul v-for="kk in item.mps_arr" > \
                                            <li>{{kk}}</li> \
                                        </ul> \
                                    </span><span v-else>❌</span> \
                                </td> \
                            </tr> \
                        </tbody> \
                    </table>' 
        
            for (var i = 0; i < res.data.length; i++) {
                // 设置主色
                var color_arr = res.data[i].ac.split(';')
                var color = color_arr[0]
                res.data[i].style =  "background:"+color+" !important;"
                // 设置配色
                var color_arr_style =[]  
                for (var c = 0; c < color_arr.length-1; c++) {
                    var color_rgb = color_arr[c]
                    var color_style = {
                        display: "block",
                        width: "80px",
                        height: "20px",
                        margin: "0px 0px 2px",
                        background: color_rgb
                    }
                    color_arr_style[c] = color_style
                }
                res.data[i].color_arr = color_arr_style
                // 设置会员
                if(res.data[i].fs == true){  
                    var arr = res.data[i].mps.split(',')  
                    res.data[i].mps_arr = arr
                    res.data[i].mps_arr.length = (res.data[i].mps_arr.length - 1)
                }
            } 
            _zhubaiVue = new Vue({
                el: '#zhubai-rand',
                data: {
                    items: res.data,
                    zhubai_reflush_times: 60
                }
            })
            // 数秒刷新
            var timer = setInterval(function(){
                _zhubaiVue.zhubai_reflush_times--;
                if(_zhubaiVue.zhubai_reflush_times <= 0){ 
                    clearInterval(timer)
                    that.buildZhubaiRand() 
                }
           },1000)
        }
    }

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
     * 动态加载函数 【异步场景下实用，否则会出现未完全加载导致某些undefined的问题】
     * @param src cookie名称
     * @param attrs cookie值
     */
    loadScript(srcArray,attrs) { 
        return new Promise((resolve, reject) => {
            try {
                for(let src of srcArray){
                    let scriptEle = document.createElement('script')
                    scriptEle.type = 'text/javascript'
                    scriptEle.src = src
                    for (let key in attrs) {
                        scriptEle.setAttribute(key, attrs[key])
                    }
                    scriptEle.addEventListener('load', function () {
                        resolve('load "'+ src +'" successful.')
                    })
                    document.body.appendChild(scriptEle)
                }
            } catch (err) {
                reject(err)
            }
        })
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
        var that = this
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: that._OPEN_API_ + that._ANALY_ + "/push",
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

// init
_BIGLATE_ANALYTICS = new BiglateAnalytics()
_BIGLATE_ANALYTICS.init()