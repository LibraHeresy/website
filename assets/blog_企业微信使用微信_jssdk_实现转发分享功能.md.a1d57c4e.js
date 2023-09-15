import{_ as s,o as n,c as a,Q as p}from"./chunks/framework.28871c17.js";const u=JSON.parse('{"title":"企业微信使用微信 jssdk 实现转发分享功能","description":"","frontmatter":{},"headers":[],"relativePath":"blog/企业微信使用微信_jssdk_实现转发分享功能.md","filePath":"blog/企业微信使用微信_jssdk_实现转发分享功能.md","lastUpdated":1694760102000}'),l={name:"blog/企业微信使用微信_jssdk_实现转发分享功能.md"},o=p(`<h1 id="企业微信使用微信-jssdk-实现转发分享功能" tabindex="-1">企业微信使用微信 jssdk 实现转发分享功能 <a class="header-anchor" href="#企业微信使用微信-jssdk-实现转发分享功能" aria-label="Permalink to &quot;企业微信使用微信 jssdk 实现转发分享功能&quot;">​</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>又接到一个看似简单，实则难受的需求，实现企业微信环境转发 <code>H5</code> 页面到微信好友和朋友圈，并保留卡片形式。</p><p>需求简单明了，但是和微信沾边的，都不是一条好走的路。</p><p>一上手就发现问题了，企微的<code>jssdk</code>它不更新了。兜兜转转发现，好像企微和微信的<code>jssdk</code>统一用<code>@wecom/jssdk</code>。</p><p>果然不愧是微信啊，张小龙 <code>NB</code>。</p><p>而我在发现这个状况之前已经用了第三方封装的包，<code>weixin-js-sdk</code>。幸好问题不大，因为这个包只是将官方 js-sdk 转为了 CommonJS 格式。</p><p>但我的建议是使用 <code>@wecom/jssdk</code> ，因为我已经发现有些方法 <code>weixin-js-sdk</code> 并不支持，比如 <code>updateAppMessageShareData</code> 和 <code>updateTimelineShareData</code> ，这两个新的分享方法。</p><h2 id="环境" tabindex="-1">环境 <a class="header-anchor" href="#环境" aria-label="Permalink to &quot;环境&quot;">​</a></h2><blockquote><p>企业微信 4.1.3(21966)</p><p>weixin-js-sdk 1.6.0</p></blockquote><h2 id="实现" tabindex="-1">实现 <a class="header-anchor" href="#实现" aria-label="Permalink to &quot;实现&quot;">​</a></h2><h3 id="引入微信-jssdk" tabindex="-1">引入微信 jssdk <a class="header-anchor" href="#引入微信-jssdk" aria-label="Permalink to &quot;引入微信 jssdk&quot;">​</a></h3><p>我说我怎么引入的这么难受呢。。。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// terminal</span></span>
<span class="line"><span style="color:#E1E4E8;">npm install weixin</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">js</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">sdk</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// updateShare.js</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">*</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">as</span><span style="color:#E1E4E8;"> wx </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;weixin-js-sdk&#39;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// terminal</span></span>
<span class="line"><span style="color:#24292E;">npm install weixin</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">js</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">sdk</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// updateShare.js</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">*</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">as</span><span style="color:#24292E;"> wx </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;weixin-js-sdk&#39;</span></span></code></pre></div><h3 id="注册企微接口权限" tabindex="-1">注册企微接口权限 <a class="header-anchor" href="#注册企微接口权限" aria-label="Permalink to &quot;注册企微接口权限&quot;">​</a></h3><p>这一步其实挺简单的，调用 <code>wx.config</code> 接口就行，重点是参数的获取，还有就是注册以后的 <code>url</code> 不会变动了，如果切换页面你就要重新注册一次。</p><p><a href="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#0" target="_blank" rel="noreferrer">JS-SDK 说明文档</a></p><p><a href="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#62" target="_blank" rel="noreferrer">附录 1-JS-SDK 使用权限签名算法</a></p><p><a href="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#63" target="_blank" rel="noreferrer">附录 2-所有 JS 接口列表</a></p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// 注册接口权限</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">jsapiTicket</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">; </span><span style="color:#6A737D;">// 我是后端返回的，前端也可以自己获取，具体的看附录1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">timestamp</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Number</span><span style="color:#E1E4E8;">(Date.</span><span style="color:#B392F0;">now</span><span style="color:#E1E4E8;">().</span><span style="color:#B392F0;">toString</span><span style="color:#E1E4E8;">().</span><span style="color:#B392F0;">substring</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">10</span><span style="color:#E1E4E8;">)); </span><span style="color:#6A737D;">// 获取时间戳</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nonceStr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getuuid</span><span style="color:#E1E4E8;">(); </span><span style="color:#6A737D;">// 获取uuid</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">url</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">; </span><span style="color:#6A737D;">// 注册url，需要与当前页面一致</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">signature</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> CryptoJS.</span><span style="color:#B392F0;">SHA1</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">\`jsapi_ticket=\${</span><span style="color:#E1E4E8;">jsapiTicket</span><span style="color:#9ECBFF;">}&amp;noncestr=\${</span><span style="color:#E1E4E8;">nonceStr</span><span style="color:#9ECBFF;">}&amp;timestamp=\${</span><span style="color:#E1E4E8;">timestamp</span><span style="color:#9ECBFF;">}&amp;url=\${</span><span style="color:#E1E4E8;">url</span><span style="color:#9ECBFF;">}\`</span></span>
<span class="line"><span style="color:#E1E4E8;">).</span><span style="color:#B392F0;">toString</span><span style="color:#E1E4E8;">(); </span><span style="color:#6A737D;">// 生成签名</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">wx.</span><span style="color:#B392F0;">config</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  debug: </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 是否开启调试模式，开启的话，每调用一次api就会回调弹出结果弹窗。</span></span>
<span class="line"><span style="color:#E1E4E8;">  appId: </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 填写企业号corpid，但是要注意的是，如果该网页被分享到微信，那你就要用微信公众号的appid才能获取到接口权限</span></span>
<span class="line"><span style="color:#E1E4E8;">  timestamp: </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 必填，生成签名的时间戳。注意！微信要的时间戳精度是到秒</span></span>
<span class="line"><span style="color:#E1E4E8;">  nonceStr: </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 必填，生成签名的随机串。随便一个uuid就行，只要是不重复的随机串都可以。</span></span>
<span class="line"><span style="color:#E1E4E8;">  signature: </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 必填，签名，见附录1。</span></span>
<span class="line"><span style="color:#E1E4E8;">  jsApiList: [], </span><span style="color:#6A737D;">// 必填，需要使用的JS接口列表，所有JS接口列表见附录2。</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 成功回调</span></span>
<span class="line"><span style="color:#E1E4E8;">wx.</span><span style="color:#B392F0;">ready</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">res</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// config信息验证成功会执行ready函数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 检查环境是否支持指定JS接口</span></span>
<span class="line"><span style="color:#E1E4E8;">  wx.</span><span style="color:#B392F0;">checkJsApi</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">    jsApiList: [],</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">success</span><span style="color:#E1E4E8;">: </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">res</span><span style="color:#E1E4E8;">) {},</span></span>
<span class="line"><span style="color:#E1E4E8;">  });</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 失败回调</span></span>
<span class="line"><span style="color:#E1E4E8;">wx.</span><span style="color:#B392F0;">error</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">err</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// config信息验证失败会执行error函数，如签名过期导致验证失败</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 具体错误信息可以打开config的debug模式查看，也可以在返回的err参数中查看，对于SPA可以在这里更新签名。</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// 注册接口权限</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">jsapiTicket</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">; </span><span style="color:#6A737D;">// 我是后端返回的，前端也可以自己获取，具体的看附录1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">timestamp</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Number</span><span style="color:#24292E;">(Date.</span><span style="color:#6F42C1;">now</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">substring</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">)); </span><span style="color:#6A737D;">// 获取时间戳</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nonceStr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getuuid</span><span style="color:#24292E;">(); </span><span style="color:#6A737D;">// 获取uuid</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">url</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">; </span><span style="color:#6A737D;">// 注册url，需要与当前页面一致</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">signature</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> CryptoJS.</span><span style="color:#6F42C1;">SHA1</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">\`jsapi_ticket=\${</span><span style="color:#24292E;">jsapiTicket</span><span style="color:#032F62;">}&amp;noncestr=\${</span><span style="color:#24292E;">nonceStr</span><span style="color:#032F62;">}&amp;timestamp=\${</span><span style="color:#24292E;">timestamp</span><span style="color:#032F62;">}&amp;url=\${</span><span style="color:#24292E;">url</span><span style="color:#032F62;">}\`</span></span>
<span class="line"><span style="color:#24292E;">).</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">(); </span><span style="color:#6A737D;">// 生成签名</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">wx.</span><span style="color:#6F42C1;">config</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">  debug: </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 是否开启调试模式，开启的话，每调用一次api就会回调弹出结果弹窗。</span></span>
<span class="line"><span style="color:#24292E;">  appId: </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 填写企业号corpid，但是要注意的是，如果该网页被分享到微信，那你就要用微信公众号的appid才能获取到接口权限</span></span>
<span class="line"><span style="color:#24292E;">  timestamp: </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 必填，生成签名的时间戳。注意！微信要的时间戳精度是到秒</span></span>
<span class="line"><span style="color:#24292E;">  nonceStr: </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 必填，生成签名的随机串。随便一个uuid就行，只要是不重复的随机串都可以。</span></span>
<span class="line"><span style="color:#24292E;">  signature: </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 必填，签名，见附录1。</span></span>
<span class="line"><span style="color:#24292E;">  jsApiList: [], </span><span style="color:#6A737D;">// 必填，需要使用的JS接口列表，所有JS接口列表见附录2。</span></span>
<span class="line"><span style="color:#24292E;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 成功回调</span></span>
<span class="line"><span style="color:#24292E;">wx.</span><span style="color:#6F42C1;">ready</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">res</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// config信息验证成功会执行ready函数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 检查环境是否支持指定JS接口</span></span>
<span class="line"><span style="color:#24292E;">  wx.</span><span style="color:#6F42C1;">checkJsApi</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">    jsApiList: [],</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">success</span><span style="color:#24292E;">: </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">res</span><span style="color:#24292E;">) {},</span></span>
<span class="line"><span style="color:#24292E;">  });</span></span>
<span class="line"><span style="color:#24292E;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 失败回调</span></span>
<span class="line"><span style="color:#24292E;">wx.</span><span style="color:#6F42C1;">error</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">err</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// config信息验证失败会执行error函数，如签名过期导致验证失败</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 具体错误信息可以打开config的debug模式查看，也可以在返回的err参数中查看，对于SPA可以在这里更新签名。</span></span>
<span class="line"><span style="color:#24292E;">});</span></span></code></pre></div><h3 id="调用分享接口" tabindex="-1">调用分享接口 <a class="header-anchor" href="#调用分享接口" aria-label="Permalink to &quot;调用分享接口&quot;">​</a></h3><p>最难的就是注册接口权限了，如果你成功了，那接下来就是一片坦途。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">config</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  title: </span><span style="color:#9ECBFF;">&#39;&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 分享卡片标题</span></span>
<span class="line"><span style="color:#E1E4E8;">  desc: </span><span style="color:#9ECBFF;">&#39;&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 分享卡片描述</span></span>
<span class="line"><span style="color:#E1E4E8;">  imgUrl: </span><span style="color:#9ECBFF;">&#39;&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 分享卡片头像</span></span>
<span class="line"><span style="color:#E1E4E8;">  link: </span><span style="color:#9ECBFF;">&#39;&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 分享卡片点击打开的网址</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">success</span><span style="color:#E1E4E8;">: </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> () {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 用户确认分享后执行的回调函数</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">cancel</span><span style="color:#E1E4E8;">: </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> () {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 用户取消分享后执行的回调函数</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">。</span></span>
<span class="line"><span style="color:#6A737D;">// 分享接口的入参都差不多</span></span>
<span class="line"><span style="color:#6A737D;">// 分享到微信，即将废弃</span></span>
<span class="line"><span style="color:#E1E4E8;">wx.</span><span style="color:#B392F0;">onMenuShareAppMessage</span><span style="color:#E1E4E8;">(config)</span></span>
<span class="line"><span style="color:#6A737D;">// 分享到朋友圈，即将废弃</span></span>
<span class="line"><span style="color:#E1E4E8;">wx.</span><span style="color:#B392F0;">onMenuShareTimeline</span><span style="color:#E1E4E8;">(config)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">config</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  title: </span><span style="color:#032F62;">&#39;&#39;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 分享卡片标题</span></span>
<span class="line"><span style="color:#24292E;">  desc: </span><span style="color:#032F62;">&#39;&#39;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 分享卡片描述</span></span>
<span class="line"><span style="color:#24292E;">  imgUrl: </span><span style="color:#032F62;">&#39;&#39;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 分享卡片头像</span></span>
<span class="line"><span style="color:#24292E;">  link: </span><span style="color:#032F62;">&#39;&#39;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 分享卡片点击打开的网址</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">success</span><span style="color:#24292E;">: </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> () {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 用户确认分享后执行的回调函数</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">cancel</span><span style="color:#24292E;">: </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> () {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 用户取消分享后执行的回调函数</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">。</span></span>
<span class="line"><span style="color:#6A737D;">// 分享接口的入参都差不多</span></span>
<span class="line"><span style="color:#6A737D;">// 分享到微信，即将废弃</span></span>
<span class="line"><span style="color:#24292E;">wx.</span><span style="color:#6F42C1;">onMenuShareAppMessage</span><span style="color:#24292E;">(config)</span></span>
<span class="line"><span style="color:#6A737D;">// 分享到朋友圈，即将废弃</span></span>
<span class="line"><span style="color:#24292E;">wx.</span><span style="color:#6F42C1;">onMenuShareTimeline</span><span style="color:#24292E;">(config)</span></span></code></pre></div><h2 id="问题" tabindex="-1">问题 <a class="header-anchor" href="#问题" aria-label="Permalink to &quot;问题&quot;">​</a></h2><h3 id="再次分享卡片头像图不加载" tabindex="-1">再次分享卡片头像图不加载 <a class="header-anchor" href="#再次分享卡片头像图不加载" aria-label="Permalink to &quot;再次分享卡片头像图不加载&quot;">​</a></h3><p>常见原因就是你的头像图太大，导致加载失败，最好控制在 <code>200k</code> 以内，还有就是可能你的头像图链接挂了。</p><h3 id="错误码-63002-invalid-signature" tabindex="-1">错误码:63002, invalid signature <a class="header-anchor" href="#错误码-63002-invalid-signature" aria-label="Permalink to &quot;错误码:63002, invalid signature&quot;">​</a></h3><p>如果你确定你的 <code>noncestr</code> 和 <code>jsapi_ticket</code> 没有问题，但就是提示非法签名，那可能是因为你的 <code>timestamp</code>。</p><p>因为微信的 <code>timestamp</code> 精度是到秒，而 <code>JS</code> 的 <code>Date.now()</code> 方法精度是到毫秒。</p><p>真不愧是你啊，微信。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">js_timestamp</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> Date.</span><span style="color:#B392F0;">now</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">wx_timestamp</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Number</span><span style="color:#E1E4E8;">(Date.</span><span style="color:#B392F0;">now</span><span style="color:#E1E4E8;">().</span><span style="color:#B392F0;">toString</span><span style="color:#E1E4E8;">().</span><span style="color:#B392F0;">substring</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">10</span><span style="color:#E1E4E8;">)); </span><span style="color:#6A737D;">// 需要这样处理</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">js_timestamp</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Date.</span><span style="color:#6F42C1;">now</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">wx_timestamp</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Number</span><span style="color:#24292E;">(Date.</span><span style="color:#6F42C1;">now</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">toString</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">substring</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">)); </span><span style="color:#6A737D;">// 需要这样处理</span></span></code></pre></div>`,31),e=[o];function c(t,r,E,y,i,d){return n(),a("div",null,e)}const A=s(l,[["render",c]]);export{u as __pageData,A as default};
