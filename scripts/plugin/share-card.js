/***
 * CopyRight 
 * https://github.com/bh-lay/blog
 */
 (function(){
    // 卡片宽度
    const cardWidth = 800
    const footerHeight = 250
    const pixelRatio = window.devicePixelRatio || 1

    function loadImg (src) {
        return new Promise((resolve, reject) => {
            var img = new Image()
            img.crossOrigin = 'Anonymous'
            img.onload = function () {
                resolve(img)
            }
            img.onerror = function () {
                resolve()
            }

            img.src = src
        })
    }

    // 加载页脚图片
    const buildFooterImageDataUrl = (title, intro) => {
        let introFontSize = 15;
        if (intro){
            if (intro.length < 30){
                introFontSize = 28;
            }
            if (intro.length < 40){
                introFontSize = 22;
            }
        }
        let svgText = 
            `<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">` +
                `<rect width="800" height="200" fill="#fff" x="0" y="50"></rect>` + 
                `<path transform="translate(30, 84) scale(0.03)" d="M2.221258 1024V535.32321c-2.221258-68.859002 6.663774-135.496746 28.876356-197.691974s55.531453-115.505423 95.5141-162.151843 88.850325-86.629067 144.381778-115.505423c55.531453-31.097614 117.726681-51.088937 184.364426-59.97397v211.019523c-82.186551 26.655098-137.718004 68.859002-166.594361 122.169197s-44.425163 119.947939-44.425162 199.913232h211.019523v490.898048H2.221258z m679.704989 0V535.32321c-2.221258-68.859002 6.663774-135.496746 28.876356-197.691974s53.310195-115.505423 95.5141-162.151843c39.982646-46.646421 88.850325-86.629067 144.381779-115.505423 55.531453-31.097614 117.726681-51.088937 184.364425-59.97397v211.019523c-82.186551 26.655098-137.718004 68.859002-166.59436 122.169197-31.097614 53.310195-44.425163 119.947939-44.425163 199.913232h211.019523v490.898048H681.926247z" fill="#e8e8e8"/>` + 
                `<text dx="85" dy="110" font-size="30" text-anchor="start">${title}</text><circle r="180" cx="650" cy="180" fill="#fff" /><rect width="120" height="120" fill="#fff" x="590" y="70" />` + 
                `<text dx="650" dy="220" font-size="17" text-anchor="middle" fill="#aaa">阅读全文</text>` +
                `<foreignObject width="500" height="80" x="50" y="140" style="pointer-events: none;">` + 
                    `<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: `+introFontSize+`px;color: #666;">${intro}</div>` + 
                `</foreignObject>` + 
            `</svg>`
        return 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgText)))
    }
    // 创建二维码图片 URL 
    const buildQRCodeImg = (url) => {
        var _qrCodeElement = document.createElement("div")
        _qrCodeElement.setAttribute("style","display:none;")
        var _p = document.createElement("p")
        _p.innerHTML = "长按或扫描分享给你的好友～";
        var _shareCard = document.getElementsByClassName("share-card")
        _shareCard[0].appendChild(_qrCodeElement)
        _shareCard[0].appendChild(_p)
        var qrcode = new QRCode(_qrCodeElement, {
            text: url,
            width: 240,
            height: 240,
            colorDark : "#aaaaaa",
            //colorLight : "#000000",
            correctLevel : QRCode.CorrectLevel.M
        });
        var _qrCanvas = _qrCodeElement.getElementsByTagName('canvas')
        var _qrCanvas0 = _qrCanvas[0]
        var _dataUrl = _qrCanvas0.toDataURL("image/jpeg")
        return loadImg(_dataUrl)
    }

    // 渲染图片
    const render = (coverImg, footerImg, QRCodeImg) => {
        let img = new Image()
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        let newImageHeight = 0
        canvas.width = cardWidth * pixelRatio

        if (coverImg) {
            newImageHeight = cardWidth * coverImg.height / coverImg.width
            canvas.height = (newImageHeight + footerHeight - 50) * pixelRatio
            // 将封面填入 canvas
            context.drawImage(coverImg, 0, 0, canvas.width, newImageHeight * pixelRatio)
        } else {
            canvas.height = (footerHeight - 50) * pixelRatio
        }

        if (footerImg) {
            // 将页脚插入 canvas
            context.drawImage(footerImg, 0, (newImageHeight - 50) * pixelRatio, canvas.width, pixelRatio * footerHeight)
        }
        if (QRCodeImg) {
            let QRCodeWidth = 120 * pixelRatio
            // 将二维码绘制进 canvas
            context.drawImage(QRCodeImg, 590 * pixelRatio, (newImageHeight + 20) * pixelRatio, QRCodeWidth, QRCodeWidth)
        }
        img.src = canvas.toDataURL('image/jpeg', 1)
        return img
    }

    function createShareCard ({ title, intro, url, coverUrl }) {
        // 构建页脚图片
        let footerDataUrl = buildFooterImageDataUrl(title, intro)
        return Promise.all([
            // 加载封面图
            loadImg(coverUrl),
            // 加载页脚图片
            loadImg(footerDataUrl),
            // 创建二维码图片 URL
            buildQRCodeImg(url)
        ]).then(([coverImg, footerImg, QRCodeImg]) => {
            return render(coverImg, footerImg, QRCodeImg)
        })
    }

    let canvas = createShareCard({
        title: document.getElementsByTagName('sharetitle')[0].innerHTML,
        intro: document.getElementsByTagName('shareintroduce')[0].innerHTML,
        url: window.location.pathname,
        coverUrl: document.getElementsByTagName('shareimg')[0].innerHTML
    }).then(img => {  
        var _shareCard = document.getElementsByClassName('share-card')[0];      
        _shareCard.appendChild(img)
    })
})();