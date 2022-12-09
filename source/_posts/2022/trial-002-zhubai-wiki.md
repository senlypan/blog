---
title: 为什么我又做了竹白百科？
date: 2022-12-03 20:24:18
tags:
- 实验
- 竹白
preview: https://www.panshenlian.com/images/post/product/zhubai/zhubai.jpg
introduce: |
    不忘初心，为了发现好内容，我对竹白检索工具做了一次版本升级。
---

## 背景

一直以来，我在信息获取方面，基本有三个渠道：Github，RSS，Email 。隔三差五，我会通过这三个渠道去消化新增的信息源。

- [Github](https://github.com/) , 作为技术爱好者，也是相关从业者，自然是非常熟悉，最近发现国内的开源慢慢成长起来，但依然需要时间。

- RSS , 我使用的客户端是 [feedly](https://feedly.com/) ，不一定是最好的，但目前适合我，并且经过几年取舍，留存下来的这一批技术类、艺术类以及新闻类的信息源，基本质量都很高，至少是我希望了解的内容。 

- Email , 依然有很多优质的信息源或站点，弥补 RSS 的空缺。

互联网是张神奇的网，只要你一直在网上，大部分高质量，或者说有趣的人和事，最终都会传递到你这个点。

所以 [竹白](https://zhubai.love/)，就是我从 [GeekPlux](https://geekplux.com/) 了解到的。

## 初心

作为一名信息源收集狂，对于高质量的内容，我自然是爱不释手，但由于 [竹白平台](https://zhubai.love/) 的一些定位原因，之后我做了一个小工具弥补了部分遗憾，我在之前有具体聊过，详细见 [《竹白网站实现专栏与文章检索》](/2022/08/07/trial-001-zhubai/)。

## 回声

在竹白检索小工具诞生之后，我有意发了一些群，和部分站点，作为宣传，希望对他人也有所用。

后面陆续收到不少反馈，总体上大家认为工具好用，但存在不足，这些声音，我都心中有数，可惜精力有限。

## 升级

恰巧国庆之后，我居家办公长达一月有余，通勤的时间减少了，企业业务减缓了，自然我的可支配时长增加了，所以开始琢磨着，要不把之前的竹白小工具做一个升级。于是基本做了几件事：

#### 1、域名

申请了竹白百科独立域名 [zhubai.wiki](https://www.zhubai.wiki/)，之前把竹白检索工具集成在我的某篇博文中，自然不合适，主要也是不方便使用，所以申请了一个独立域名，好记，也比较纯粹，当然还是为了便利性。

#### 2、数据

内容新增了竹白作品展示，之前只有创作者榜单，和文章检索，但是不够直接，所以我索引把竹白创作者和作品，都一一作了展示，并且雨露均沾。

另外对于一些创作维度，个人角度做了一些统计分析，目前包括：

- 先锋作品
- 先锋创作者
- 新锐作品
- 新锐创作者
- 活跃创作者
- 日更创作者
- 周更创作者
- 新收录

统计依据和数据含义，[竹白百科](https://www.zhubai.wiki/) 上我做了详细说明。


![article](/images/post/product/zhubai/article.jpg)

![author](/images/post/product/zhubai/author.jpg)



- 检索结果



![search-box](/images/post/product/zhubai/search-box.jpg)

![search-result](/images/post/product/zhubai/search-result.jpg)

#### 3、UI

我是全栈工程师，但如果要说 UI ，那真的是难倒我了，于是鉴于自己一直收听的播客节目 [《枫言枫语》](https://www.xiaoyuzhoufm.com/episode/62d58b0664f141ad8150151f) 之前也做了一件类似的事 [《中文播客榜》](https://xyzrank.com/)，所以我直接把 UI 样式搬了过来，然后用 React 搭建了几个组件，基本就用了。

#### 4、分享

初心一如从前，做竹白百科的目的，也是为了让用户发现竹白的好内容，独乐乐不如众乐乐。以往分享的形式，是链接形式，于是我写了一个分享插件，希望能够让大家以图片海报的形式，在朋友圈或网上，更好的分享传阅，把竹白的好内容和优秀创作者，分享给更多人。

- 支持作品分享
- 支持创作者分享

![share](/images/post/product/zhubai/share.jpg)

![sharecard](/images/post/product/zhubai/sharecard.jpg)

#### 5、访迹

另外，添加了一个简单的访问痕迹统计页面 - [竹白访迹](http://analy.zhubai.wiki/)，方便分析竹白百科的流量模型和用户行为，也提供了流量的来源渠道，方便大家 **反向** 查看更多有意思的信息源。

- 访客总览

![analy1](/images/post/product/zhubai/analy1.jpg)

- 流量趋势

![analy1](/images/post/product/zhubai/analy2.jpg)

- 访客来源

![analy1](/images/post/product/zhubai/analy3.jpg)

- 用户轨迹

![analy1](/images/post/product/zhubai/analy4.jpg)



## 末尾

更多功能，建议到 [竹白百科](https://www.zhubai.wiki/)  or [竹白访迹](http://analy.zhubai.wiki/) 上细细查阅，如有问题，请随时联系我。








