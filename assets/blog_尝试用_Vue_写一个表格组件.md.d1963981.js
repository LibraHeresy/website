import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.28871c17.js";const d=JSON.parse('{"title":"尝试用 Vue 写一个表格组件","description":"","frontmatter":{},"headers":[],"relativePath":"blog/尝试用_Vue_写一个表格组件.md","filePath":"blog/尝试用_Vue_写一个表格组件.md","lastUpdated":1694760102000}'),p={name:"blog/尝试用_Vue_写一个表格组件.md"},o=l(`<h1 id="尝试用-vue-写一个表格组件" tabindex="-1">尝试用 Vue 写一个表格组件 <a class="header-anchor" href="#尝试用-vue-写一个表格组件" aria-label="Permalink to &quot;尝试用 Vue 写一个表格组件&quot;">​</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>工作中接到一个小程序表格展示信息的需求，让我一惊，因为<code>Taro UI Vue3</code>这个框架根本没有表格组件。</p><p>没办法咯，只能自己写了，因为没写过表格组件，心里还是有点畏惧的。但是写完以后，我发现在这个<code>gird</code>网格布局大行其道的时代，编写一个实现基本功能的表格组件并不难。</p><p>特别是有很多成功的框架珠玉在前，比如<code>Antd</code>，所以我仿照<code>Antd</code>的表格组件实现了一个青春版。</p><p>给阅读这篇博客的人提个醒，我没看过<code>Antd</code>源码，以下实现代码是我自己写的。😂</p><h2 id="需求" tabindex="-1">需求 <a class="header-anchor" href="#需求" aria-label="Permalink to &quot;需求&quot;">​</a></h2><ol><li>表格的结构和数据分离</li><li>默认表格宽度根据容器宽度均分，有<code>width</code>属性使用自定义宽度</li><li>无数据提示</li><li>控制表格边框展示</li><li>斑马纹</li></ol><h2 id="实现" tabindex="-1">实现 <a class="header-anchor" href="#实现" aria-label="Permalink to &quot;实现&quot;">​</a></h2><h3 id="释义" tabindex="-1">释义 <a class="header-anchor" href="#释义" aria-label="Permalink to &quot;释义&quot;">​</a></h3><p>讲一下我用到的不太常见的属性。</p><h4 id="_1-display-grid" tabindex="-1">1. <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/display" target="_blank" rel="noreferrer">display: grid</a> <a class="header-anchor" href="#_1-display-grid" aria-label="Permalink to &quot;1. [display: grid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)&quot;">​</a></h4><p>设置元素为网格布局。</p><h4 id="_2-grid-template-columns" tabindex="-1">2. <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid-template-columns" target="_blank" rel="noreferrer">grid-template-columns</a> <a class="header-anchor" href="#_2-grid-template-columns" aria-label="Permalink to &quot;2. [grid-template-columns](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid-template-columns)&quot;">​</a></h4><p>这个属性的书面定义是基于网格列的维度，去定义网格线的名称和网格轨道的尺寸大小，用口语就是设置网格一个方向的宽度并可以对其命名。</p><h3 id="思路" tabindex="-1">思路 <a class="header-anchor" href="#思路" aria-label="Permalink to &quot;思路&quot;">​</a></h3><p>首先数据结构我仿照<code>Antd</code>分为两个数组，分为<code>columns</code>（表头结构）和<code>dataSource</code>（表身数据）两个对象数组。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">default</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">......</span></span>
<span class="line"><span style="color:#E1E4E8;">  props: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    columns: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Array,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">default</span><span style="color:#E1E4E8;">: () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> [],</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    dataSource: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Array,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">default</span><span style="color:#E1E4E8;">: () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> [],</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">......</span></span>
<span class="line"><span style="color:#24292E;">  props: {</span></span>
<span class="line"><span style="color:#24292E;">    columns: {</span></span>
<span class="line"><span style="color:#24292E;">      type: Array,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">default</span><span style="color:#24292E;">: () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> [],</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    dataSource: {</span></span>
<span class="line"><span style="color:#24292E;">      type: Array,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">default</span><span style="color:#24292E;">: () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> [],</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>然后将表头和表身分开渲染，表头直接循环<code>columns</code>渲染；表身先循环<code>dataSource</code>取出对象，再循环<code>columns</code>取值渲染。</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  ......</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;table-header grid&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;colStyle&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column in columns&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">:id</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      {{ column.title }}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;table-content&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;(data, index) in dataSource&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;data&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;content-col grid&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;colStyle&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;dataColumn in columns&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;index + dataColumn.dataIndex&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  ......</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">&lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  ......</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;table-header grid&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;colStyle&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column in columns&quot;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">:id</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#24292E;">    &gt;</span></span>
<span class="line"><span style="color:#24292E;">      {{ column.title }}</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;table-content&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;(data, index) in dataSource&quot;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;data&quot;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;content-col grid&quot;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;colStyle&quot;</span></span>
<span class="line"><span style="color:#24292E;">    &gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;dataColumn in columns&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;index + dataColumn.dataIndex&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#24292E;">      &gt;</span></span>
<span class="line"><span style="color:#24292E;">        {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  ......</span></span>
<span class="line"><span style="color:#24292E;">&lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span></code></pre></div><p>计算列宽度，通过动态添加<code>grid-template-columns</code>属性实现宽度自适应。</p><p>这个<code>1fr</code>属性就像是<code>flex</code>弹性布局子元素的<code>flex: 1</code>属性，自动填充剩下的宽度，如果有其他相同属性的元素，则按设定数值的比例分配宽度。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">colStyle</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">computed</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">number</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> props.columns.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;grid-template-columns&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#B392F0;">setWidth</span><span style="color:#E1E4E8;">(),</span></span>
<span class="line"><span style="color:#E1E4E8;">  };</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">setWidth</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> props.columns</span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">item</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;1fr&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    })</span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#B392F0;">join</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot; &quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">colStyle</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">computed</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> props.columns.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;grid-template-columns&quot;</span><span style="color:#24292E;">: </span><span style="color:#6F42C1;">setWidth</span><span style="color:#24292E;">(),</span></span>
<span class="line"><span style="color:#24292E;">  };</span></span>
<span class="line"><span style="color:#24292E;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setWidth</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> props.columns</span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">item</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;1fr&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    })</span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#6F42C1;">join</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><p>最后添加斑马纹、边框、无数据提示，就完成了。</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">&lt;!-- showBorder 边框 --&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;table&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">      &#39;border-left&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">    }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;table-header grid&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;colStyle&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column in columns&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:id</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">          &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">        }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        {{ column.title }}</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;table-content&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;(data, index) in dataSource&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;data&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;content-col grid&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;colStyle&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">&lt;!-- zebra-color 斑马纹 --&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;dataColumn in columns&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;index + dataColumn.dataIndex&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">          }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">&lt;!-- 无数据提示 --&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;dataSource.length === 0 &amp;&amp; showEmpty&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;tips&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">image</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;tips-img&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">src</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;./list.png&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">mode</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;aspectFit&quot;</span><span style="color:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;tips-text&quot;</span><span style="color:#E1E4E8;">&gt; 暂无数据 &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">&lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">&lt;!-- showBorder 边框 --&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;table&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">      &#39;border-left&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">    }&quot;</span></span>
<span class="line"><span style="color:#24292E;">  &gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;table-header grid&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;colStyle&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column in columns&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:id</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">          &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">        }&quot;</span></span>
<span class="line"><span style="color:#24292E;">      &gt;</span></span>
<span class="line"><span style="color:#24292E;">        {{ column.title }}</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;table-content&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;(data, index) in dataSource&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;data&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;content-col grid&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;colStyle&quot;</span></span>
<span class="line"><span style="color:#24292E;">      &gt;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">&lt;!-- zebra-color 斑马纹 --&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;dataColumn in columns&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;index + dataColumn.dataIndex&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">            &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#032F62;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">          }&quot;</span></span>
<span class="line"><span style="color:#24292E;">        &gt;</span></span>
<span class="line"><span style="color:#24292E;">          {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">&lt;!-- 无数据提示 --&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;dataSource.length === 0 &amp;&amp; showEmpty&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;tips&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">image</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;tips-img&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">src</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;./list.png&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">mode</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;aspectFit&quot;</span><span style="color:#24292E;"> /&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;tips-text&quot;</span><span style="color:#24292E;">&gt; 暂无数据 &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">&lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span></code></pre></div><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">default</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">......</span></span>
<span class="line"><span style="color:#E1E4E8;">  props: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">......</span></span>
<span class="line"><span style="color:#E1E4E8;">    showEmpty: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Boolean,</span></span>
<span class="line"><span style="color:#E1E4E8;">      default: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    showBorder: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Boolean,</span></span>
<span class="line"><span style="color:#E1E4E8;">      default: </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">......</span></span>
<span class="line"><span style="color:#24292E;">  props: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">......</span></span>
<span class="line"><span style="color:#24292E;">    showEmpty: {</span></span>
<span class="line"><span style="color:#24292E;">      type: Boolean,</span></span>
<span class="line"><span style="color:#24292E;">      default: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    showBorder: {</span></span>
<span class="line"><span style="color:#24292E;">      type: Boolean,</span></span>
<span class="line"><span style="color:#24292E;">      default: </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>最后我们来看看最终实现效果。</p><p><img src="https://gcore.jsdelivr.net/gh/LibraHeresy/BaiduNetDisk/blog-images/202305291518102.png" alt="表格" title="表格"></p><p><img src="https://gcore.jsdelivr.net/gh/LibraHeresy/BaiduNetDisk/blog-images/202305291519542.png" alt="表格" title="表格"></p><h2 id="拓展" tabindex="-1">拓展 <a class="header-anchor" href="#拓展" aria-label="Permalink to &quot;拓展&quot;">​</a></h2><h3 id="fixed-属性" tabindex="-1">fixed 属性 <a class="header-anchor" href="#fixed-属性" aria-label="Permalink to &quot;fixed 属性&quot;">​</a></h3><p>产品总会提出一些很“合理”的需求，比如右边列固定，问题是我要自己写啊！</p><p>没办法了，继续薅<code>Antd</code>的羊毛吧，在<code>columns</code>对象数组里面的对象上添加<code>fixed</code>属性。</p><h4 id="方案" tabindex="-1">方案 <a class="header-anchor" href="#方案" aria-label="Permalink to &quot;方案&quot;">​</a></h4><p>实现右边列固定我想过两个方案：</p><h5 id="_1-两个表格-一个表格固定在右边-用来展示有fixed属性的列" tabindex="-1">1. 两个表格，一个表格固定在右边，用来展示有<code>fixed</code>属性的列 <a class="header-anchor" href="#_1-两个表格-一个表格固定在右边-用来展示有fixed属性的列" aria-label="Permalink to &quot;1. 两个表格，一个表格固定在右边，用来展示有\`fixed\`属性的列&quot;">​</a></h5><h5 id="_2-position-sticky-粘性定位" tabindex="-1">2. <code>position：sticky</code>，粘性定位 <a class="header-anchor" href="#_2-position-sticky-粘性定位" aria-label="Permalink to &quot;2. \`position：sticky\`，粘性定位&quot;">​</a></h5><p><code>方案 1</code> 简单，不用修改原有组件，但是我发现，会出现左右两个表格高度不一，所以放弃。</p><p><code>方案 2</code> ，很完美的一个 <code>css</code> 属性，需要注意的是生效先决条件比较多，建议看看网上的 <a href="https://www.cnblogs.com/coco1s/p/14180476.html" target="_blank" rel="noreferrer">探究 position-sticky 失效问题</a> 这篇博客后，再开始使用粘性定位。</p><p>最后选择<code>方案 2</code>。</p><h4 id="问题" tabindex="-1">问题 <a class="header-anchor" href="#问题" aria-label="Permalink to &quot;问题&quot;">​</a></h4><p>实现途中还是出现了一些问题。</p><h5 id="_1-元素堆叠" tabindex="-1">1. 元素堆叠 <a class="header-anchor" href="#_1-元素堆叠" aria-label="Permalink to &quot;1. 元素堆叠&quot;">​</a></h5><p>我发现粘性定位会堆叠在一起，需要你手动调整元素位置，所以我选择将<code>fixed</code>列都放到一起，用一个容器包裹，这样只需要控制父容器位置就可以了。</p><p>那父容器的宽度如何设置呢，特别是<code>fixed</code>列单位有多种，如<code>%</code>和<code>px</code>，很自然的，我想到了计算属性<code>calc()</code>，直接使用计算属性得出总宽度即可。</p><h5 id="_2-宽度失准" tabindex="-1">2. 宽度失准 <a class="header-anchor" href="#_2-宽度失准" aria-label="Permalink to &quot;2. 宽度失准&quot;">​</a></h5><p>我在外面设置的列宽度是根据表格宽度来设置的，但是用父容器包裹以后，锚点就从表格变成了父容器了，会出现宽度失准的问题。</p><p>但其实父容器的宽度就等于<code>fixed</code>列的总宽度，我们只要保证在父容器内部，各列的比例不变就可以实现宽度校准，用<code>flex</code>弹性布局的<code>flex</code>属性就可以实现这个效果。</p><h4 id="具体代码" tabindex="-1">具体代码 <a class="header-anchor" href="#具体代码" aria-label="Permalink to &quot;具体代码&quot;">​</a></h4><p>判断左右，控制组件展示</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">&lt;!-- 表头 --&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  ......</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;table-header grid&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;colStyle&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;!!fixedLeftCol.length&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;left: 0px&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;fixed&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column in fixedLeftCol&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:id</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{ flex: \`calc(\${columns.width}) / \${fixedLeftColWidthStr}\` }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">          }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          {{ column.title }}</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    ......</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;!!fixedRightCol.length&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;right: 0px&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;fixed&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column in fixedRightCol&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:id</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{ flex: \`calc(\${columns.width}) / \${fixedRightColWidthStr}\` }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">          }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          {{ column.title }}</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">&lt;!-- 表身 --&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;(data, index) in dataSource&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;data&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;content-col grid&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;colStyle&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;!!fixedLeftCol.length&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;left: 0px&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;fixed&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;dataColumn in fixedLeftCol&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;\`\${index}\${dataColumn.dataIndex}fixed\`&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{ flex: \`calc(\${columns.width}) / \${fixedLeftColWidthStr}\` }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">          }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    ......</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;!!fixedRightCol.length&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;right: 0px&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;fixed&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;dataColumn in fixedRightCol&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;\`\${index}\${dataColumn.dataIndex}fixed\`&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{ flex: \`calc(\${columns.width}) / \${fixedRightColWidthStr}\` }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">          }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  ......</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">&lt;!-- 表头 --&gt;</span></span>
<span class="line"><span style="color:#24292E;">&lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  ......</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;table-header grid&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;colStyle&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;!!fixedLeftCol.length&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;left: 0px&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;fixed&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column in fixedLeftCol&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:id</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{ flex: \`calc(\${columns.width}) / \${fixedLeftColWidthStr}\` }&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">          }&quot;</span></span>
<span class="line"><span style="color:#24292E;">        &gt;</span></span>
<span class="line"><span style="color:#24292E;">          {{ column.title }}</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    ......</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;!!fixedRightCol.length&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;right: 0px&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;fixed&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column in fixedRightCol&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:id</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{ flex: \`calc(\${columns.width}) / \${fixedRightColWidthStr}\` }&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">          }&quot;</span></span>
<span class="line"><span style="color:#24292E;">        &gt;</span></span>
<span class="line"><span style="color:#24292E;">          {{ column.title }}</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">&lt;!-- 表身 --&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;(data, index) in dataSource&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;data&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;content-col grid&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;colStyle&quot;</span></span>
<span class="line"><span style="color:#24292E;">  &gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;!!fixedLeftCol.length&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;left: 0px&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;fixed&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;dataColumn in fixedLeftCol&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;\`\${index}\${dataColumn.dataIndex}fixed\`&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{ flex: \`calc(\${columns.width}) / \${fixedLeftColWidthStr}\` }&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">            &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#032F62;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">          }&quot;</span></span>
<span class="line"><span style="color:#24292E;">        &gt;</span></span>
<span class="line"><span style="color:#24292E;">          {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    ......</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;!!fixedRightCol.length&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;right: 0px&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;fixed&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;dataColumn in fixedRightCol&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;\`\${index}\${dataColumn.dataIndex}fixed\`&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{ flex: \`calc(\${columns.width}) / \${fixedRightColWidthStr}\` }&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">            &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#032F62;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">          }&quot;</span></span>
<span class="line"><span style="color:#24292E;">        &gt;</span></span>
<span class="line"><span style="color:#24292E;">          {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  ......</span></span>
<span class="line"><span style="color:#24292E;">&lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span></code></pre></div><p>添加粘性定位，<code>flex</code>弹性布局等<code>css</code>样式属性。</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">.fixed</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">position</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">sticky</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">height</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">inherit</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">display</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">flex</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  &amp; &gt; </span><span style="color:#79B8FF;">view</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">flex</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">.fixed</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">position</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">sticky</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">height</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">inherit</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">display</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">flex</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  &amp; &gt; </span><span style="color:#005CC5;">view</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">flex</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>通过<code>js</code>动态计算出父容器宽度。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedLeftCol</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> props.columns.</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">i</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> i.fixed </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;left&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedLeftColWidthArr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> fixedLeftCol.</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">item</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;1fr&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedLeftColWidthStr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`calc(\${</span><span style="color:#E1E4E8;">fixedLeftColWidthArr</span><span style="color:#9ECBFF;">.</span><span style="color:#B392F0;">join</span><span style="color:#9ECBFF;">(</span><span style="color:#9ECBFF;">&quot; + &quot;</span><span style="color:#9ECBFF;">)</span><span style="color:#9ECBFF;">})\`</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedRightCol</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> props.columns.</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">i</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> i.fixed </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;right&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedRightColWidthArr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> fixedRightCol.</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">item</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;1fr&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedRightColWidthStr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`calc(\${</span><span style="color:#E1E4E8;">fixedRightColWidthArr</span><span style="color:#9ECBFF;">.</span><span style="color:#B392F0;">join</span><span style="color:#9ECBFF;">(</span><span style="color:#9ECBFF;">&quot; + &quot;</span><span style="color:#9ECBFF;">)</span><span style="color:#9ECBFF;">})\`</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">setWidth</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">normalcolWidth</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> props.columns</span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">i</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">i.fixed)</span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">item</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;1fr&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> colWidth </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> [];</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">!!</span><span style="color:#E1E4E8;">fixedLeftCol.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> colWidth.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(fixedLeftColWidthStr);</span></span>
<span class="line"><span style="color:#E1E4E8;">  colWidth.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">...</span><span style="color:#E1E4E8;">normalcolWidth);</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">!!</span><span style="color:#E1E4E8;">fixedRightCol.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> colWidth.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(fixedRightColWidthStr);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> colWidth.</span><span style="color:#B392F0;">join</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot; &quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedLeftCol</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> props.columns.</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">((</span><span style="color:#E36209;">i</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> i.fixed </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;left&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedLeftColWidthArr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> fixedLeftCol.</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">item</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;1fr&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">});</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedLeftColWidthStr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`calc(\${</span><span style="color:#24292E;">fixedLeftColWidthArr</span><span style="color:#032F62;">.</span><span style="color:#6F42C1;">join</span><span style="color:#032F62;">(</span><span style="color:#032F62;">&quot; + &quot;</span><span style="color:#032F62;">)</span><span style="color:#032F62;">})\`</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedRightCol</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> props.columns.</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">((</span><span style="color:#E36209;">i</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> i.fixed </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;right&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedRightColWidthArr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> fixedRightCol.</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">item</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;1fr&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">});</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedRightColWidthStr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`calc(\${</span><span style="color:#24292E;">fixedRightColWidthArr</span><span style="color:#032F62;">.</span><span style="color:#6F42C1;">join</span><span style="color:#032F62;">(</span><span style="color:#032F62;">&quot; + &quot;</span><span style="color:#032F62;">)</span><span style="color:#032F62;">})\`</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setWidth</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">normalcolWidth</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> props.columns</span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">((</span><span style="color:#E36209;">i</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">!</span><span style="color:#24292E;">i.fixed)</span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">item</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;1fr&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> colWidth </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> [];</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">!!</span><span style="color:#24292E;">fixedLeftCol.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> colWidth.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(fixedLeftColWidthStr);</span></span>
<span class="line"><span style="color:#24292E;">  colWidth.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">...</span><span style="color:#24292E;">normalcolWidth);</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">!!</span><span style="color:#24292E;">fixedRightCol.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> colWidth.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(fixedRightColWidthStr);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> colWidth.</span><span style="color:#6F42C1;">join</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><h2 id="代码" tabindex="-1">代码 <a class="header-anchor" href="#代码" aria-label="Permalink to &quot;代码&quot;">​</a></h2><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;table&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">      &#39;border-left&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">    }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;table-header grid&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;colStyle&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;!!fixedLeftCol.length&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;left: 0px&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;fixed&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column in fixedLeftCol&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">:id</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">              flex: \`calc(\${columns.width}) / \${fixedLeftColWidthStr}\`,</span></span>
<span class="line"><span style="color:#9ECBFF;">            }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">              &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">            }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">            {{ column.title }}</span></span>
<span class="line"><span style="color:#E1E4E8;">          &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column in columns.filter((i) =&gt; !i.fixed)&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:id</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">          &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">        }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        {{ column.title }}</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;!!fixedRightCol.length&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;right: 0px&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;fixed&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column in fixedRightCol&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">:id</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">              flex: \`calc(\${columns.width}) / \${fixedRightColWidthStr}\`,</span></span>
<span class="line"><span style="color:#9ECBFF;">            }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">              &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">            }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">            {{ column.title }}</span></span>
<span class="line"><span style="color:#E1E4E8;">          &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;table-content&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;(data, index) in dataSource&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;data&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;content-col grid&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;colStyle&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;!!fixedLeftCol.length&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;left: 0px&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;fixed&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">            &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;dataColumn in fixedLeftCol&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;\`\${index}\${dataColumn.dataIndex}fixed\`&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">                flex: \`calc(\${columns.width}) / \${fixedLeftColWidthStr}\`,</span></span>
<span class="line"><span style="color:#9ECBFF;">              }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">                &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#9ECBFF;">                &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">              }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">              {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#E1E4E8;">            &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;dataColumn in columns.filter((i) =&gt; !i.fixed)&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;\`\${index}\${dataColumn.dataIndex}\`&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#9ECBFF;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">          }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;!!fixedRightCol.length&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;right: 0px&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;fixed&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">            &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;dataColumn in fixedRightCol&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">:key</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;\`\${index}\${dataColumn.dataIndex}fixed\`&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">:style</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">                flex: \`calc(\${columns.width}) / \${fixedRightColWidthStr}\`,</span></span>
<span class="line"><span style="color:#9ECBFF;">              }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">:class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;{</span></span>
<span class="line"><span style="color:#9ECBFF;">                &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#9ECBFF;">                &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#9ECBFF;">              }&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            &gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">              {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#E1E4E8;">            &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">v-if</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;dataSource.length === 0 &amp;&amp; showEmpty&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;tips&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">image</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;tips-img&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">src</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;./list.png&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">mode</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;aspectFit&quot;</span><span style="color:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        &lt;</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">class</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;tips-text&quot;</span><span style="color:#E1E4E8;">&gt; 暂无数据 &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;/</span><span style="color:#FDAEB7;font-style:italic;">view</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { computed } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;vue&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">default</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  props: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    columns: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Array,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">default</span><span style="color:#E1E4E8;">: () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> [],</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    dataSource: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Array,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">default</span><span style="color:#E1E4E8;">: () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> [],</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    showEmpty: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Boolean,</span></span>
<span class="line"><span style="color:#E1E4E8;">      default: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    showBorder: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Boolean,</span></span>
<span class="line"><span style="color:#E1E4E8;">      default: </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">setup</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">props</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">colStyle</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">computed</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#9ECBFF;">&quot;grid-template-columns&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#B392F0;">setWidth</span><span style="color:#E1E4E8;">(),</span></span>
<span class="line"><span style="color:#E1E4E8;">      };</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedLeftCol</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> props.columns.</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">i</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> i.fixed </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;left&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedLeftColWidthArr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> fixedLeftCol.</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">item</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;1fr&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedLeftColWidthStr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`calc(\${</span><span style="color:#E1E4E8;">fixedLeftColWidthArr</span><span style="color:#9ECBFF;">.</span><span style="color:#B392F0;">join</span><span style="color:#9ECBFF;">(</span><span style="color:#9ECBFF;">&quot; + &quot;</span><span style="color:#9ECBFF;">)</span><span style="color:#9ECBFF;">})\`</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedRightCol</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> props.columns.</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">i</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> i.fixed </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;right&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedRightColWidthArr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> fixedRightCol.</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">item</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;1fr&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fixedRightColWidthStr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`calc(\${</span><span style="color:#E1E4E8;">fixedRightColWidthArr</span><span style="color:#9ECBFF;">.</span><span style="color:#B392F0;">join</span><span style="color:#9ECBFF;">(</span><span style="color:#9ECBFF;">&quot; + &quot;</span><span style="color:#9ECBFF;">)</span><span style="color:#9ECBFF;">})\`</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">setWidth</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">normalcolWidth</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> props.columns</span></span>
<span class="line"><span style="color:#E1E4E8;">        .</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">i</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">i.fixed)</span></span>
<span class="line"><span style="color:#E1E4E8;">        .</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">item</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> item.width </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;1fr&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> colWidth </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> [];</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">!!</span><span style="color:#E1E4E8;">fixedLeftCol.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> colWidth.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(fixedLeftColWidthStr);</span></span>
<span class="line"><span style="color:#E1E4E8;">      colWidth.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">...</span><span style="color:#E1E4E8;">normalcolWidth);</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">!!</span><span style="color:#E1E4E8;">fixedRightCol.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> colWidth.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(fixedRightColWidthStr);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> colWidth.</span><span style="color:#B392F0;">join</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot; &quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      colStyle,</span></span>
<span class="line"><span style="color:#E1E4E8;">      fixedLeftCol,</span></span>
<span class="line"><span style="color:#E1E4E8;">      fixedLeftColWidthStr,</span></span>
<span class="line"><span style="color:#E1E4E8;">      fixedRightCol,</span></span>
<span class="line"><span style="color:#E1E4E8;">      fixedRightColWidthStr,</span></span>
<span class="line"><span style="color:#E1E4E8;">    };</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">style</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">lang</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;scss&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#B392F0;">.table</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">overflow-y</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">scroll</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  .</span><span style="color:#79B8FF;">table-header</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">text-align</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">center</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">#f0f3ff</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#79B8FF;">header-item</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">#f0f3ff</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">#4a6cf7</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">font-size</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">20</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">height</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">60</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">line-height</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">60</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">font-weight</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">400</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">.table-content</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">width</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">100</span><span style="color:#F97583;">%</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#79B8FF;">content-col</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">width</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">100</span><span style="color:#F97583;">%</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">position</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">relative</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      .</span><span style="color:#79B8FF;">col-item</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">text-align</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">center</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        // </span><span style="color:#79B8FF;">text-overflow</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">ellipsis</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">white-space</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">nowrap</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">#ffffff</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">height</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">60</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">line-height</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">60</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">padding</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">0</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">10</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        // </span><span style="color:#79B8FF;">flex</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">.zebra-color</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">background-color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">#f0f3ff</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">.tips</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">display</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">flex</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">flex-direction</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">column</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">align-items</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">center</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">justify-content</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">center</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">height</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">300</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      .</span><span style="color:#79B8FF;">tips-img</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">width</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">210</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">height</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">100</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">margin-bottom</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">16</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">.tips-text</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">font-size</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">20</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">font-weight</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">500</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">#999999</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">.grid</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">display</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">grid</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#B392F0;">.table-font</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">font-size</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">20</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">color</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">#333333</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">font-weight</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">400</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#B392F0;">.border-right</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">border-right</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">1</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">solid</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">#e6e6e6</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#B392F0;">.border-left</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">border-left</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">1</span><span style="color:#F97583;">px</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">solid</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">#e6e6e6</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#B392F0;">.fixed</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">position</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">sticky</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">height</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">inherit</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">display</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">flex</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  &amp; &gt; </span><span style="color:#79B8FF;">view</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">flex</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">style</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">&lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;table&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">      &#39;border-left&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">    }&quot;</span></span>
<span class="line"><span style="color:#24292E;">  &gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;table-header grid&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;colStyle&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;!!fixedLeftCol.length&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;left: 0px&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;fixed&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">          &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column in fixedLeftCol&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">:id</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">              flex: \`calc(\${columns.width}) / \${fixedLeftColWidthStr}\`,</span></span>
<span class="line"><span style="color:#032F62;">            }&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">              &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">            }&quot;</span></span>
<span class="line"><span style="color:#24292E;">          &gt;</span></span>
<span class="line"><span style="color:#24292E;">            {{ column.title }}</span></span>
<span class="line"><span style="color:#24292E;">          &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column in columns.filter((i) =&gt; !i.fixed)&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:id</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">          &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">        }&quot;</span></span>
<span class="line"><span style="color:#24292E;">      &gt;</span></span>
<span class="line"><span style="color:#24292E;">        {{ column.title }}</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;!!fixedRightCol.length&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;right: 0px&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;fixed&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">          &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column in fixedRightCol&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">:id</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column.dataIndex&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;column&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">              flex: \`calc(\${columns.width}) / \${fixedRightColWidthStr}\`,</span></span>
<span class="line"><span style="color:#032F62;">            }&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;header-item&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">              &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">            }&quot;</span></span>
<span class="line"><span style="color:#24292E;">          &gt;</span></span>
<span class="line"><span style="color:#24292E;">            {{ column.title }}</span></span>
<span class="line"><span style="color:#24292E;">          &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;table-content&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;(data, index) in dataSource&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;data&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;content-col grid&quot;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;colStyle&quot;</span></span>
<span class="line"><span style="color:#24292E;">      &gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;!!fixedLeftCol.length&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">          &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;left: 0px&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;fixed&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">            &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;dataColumn in fixedLeftCol&quot;</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;\`\${index}\${dataColumn.dataIndex}fixed\`&quot;</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">                flex: \`calc(\${columns.width}) / \${fixedLeftColWidthStr}\`,</span></span>
<span class="line"><span style="color:#032F62;">              }&quot;</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">                &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#032F62;">                &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">              }&quot;</span></span>
<span class="line"><span style="color:#24292E;">            &gt;</span></span>
<span class="line"><span style="color:#24292E;">              {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#24292E;">            &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">          &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;dataColumn in columns.filter((i) =&gt; !i.fixed)&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;\`\${index}\${dataColumn.dataIndex}\`&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">            &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#032F62;">            &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">          }&quot;</span></span>
<span class="line"><span style="color:#24292E;">        &gt;</span></span>
<span class="line"><span style="color:#24292E;">          {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;!!fixedRightCol.length&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">          &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;right: 0px&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;fixed&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">            &lt;</span><span style="color:#B31D28;font-style:italic;">view</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">v-for</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;dataColumn in fixedRightCol&quot;</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">:key</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;\`\${index}\${dataColumn.dataIndex}fixed\`&quot;</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">:style</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">                flex: \`calc(\${columns.width}) / \${fixedRightColWidthStr}\`,</span></span>
<span class="line"><span style="color:#032F62;">              }&quot;</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;col-item table-font&quot;</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">:class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;{</span></span>
<span class="line"><span style="color:#032F62;">                &#39;zebra-color&#39;: index % 2 !== 0,</span></span>
<span class="line"><span style="color:#032F62;">                &#39;border-right&#39;: showBorder,</span></span>
<span class="line"><span style="color:#032F62;">              }&quot;</span></span>
<span class="line"><span style="color:#24292E;">            &gt;</span></span>
<span class="line"><span style="color:#24292E;">              {{ data[dataColumn.dataIndex] }}</span></span>
<span class="line"><span style="color:#24292E;">            &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">          &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">v-if</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;dataSource.length === 0 &amp;&amp; showEmpty&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;tips&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">image</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;tips-img&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">src</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;./list.png&quot;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">mode</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;aspectFit&quot;</span><span style="color:#24292E;"> /&gt;</span></span>
<span class="line"><span style="color:#24292E;">        &lt;</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">class</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;tips-text&quot;</span><span style="color:#24292E;">&gt; 暂无数据 &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  &lt;/</span><span style="color:#B31D28;font-style:italic;">view</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">&lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">&lt;</span><span style="color:#22863A;">script</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { computed } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;vue&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  props: {</span></span>
<span class="line"><span style="color:#24292E;">    columns: {</span></span>
<span class="line"><span style="color:#24292E;">      type: Array,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">default</span><span style="color:#24292E;">: () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> [],</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    dataSource: {</span></span>
<span class="line"><span style="color:#24292E;">      type: Array,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">default</span><span style="color:#24292E;">: () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> [],</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    showEmpty: {</span></span>
<span class="line"><span style="color:#24292E;">      type: Boolean,</span></span>
<span class="line"><span style="color:#24292E;">      default: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    showBorder: {</span></span>
<span class="line"><span style="color:#24292E;">      type: Boolean,</span></span>
<span class="line"><span style="color:#24292E;">      default: </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">setup</span><span style="color:#24292E;">(</span><span style="color:#E36209;">props</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">colStyle</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">computed</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&quot;grid-template-columns&quot;</span><span style="color:#24292E;">: </span><span style="color:#6F42C1;">setWidth</span><span style="color:#24292E;">(),</span></span>
<span class="line"><span style="color:#24292E;">      };</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedLeftCol</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> props.columns.</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">((</span><span style="color:#E36209;">i</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> i.fixed </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;left&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedLeftColWidthArr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> fixedLeftCol.</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">item</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;1fr&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedLeftColWidthStr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`calc(\${</span><span style="color:#24292E;">fixedLeftColWidthArr</span><span style="color:#032F62;">.</span><span style="color:#6F42C1;">join</span><span style="color:#032F62;">(</span><span style="color:#032F62;">&quot; + &quot;</span><span style="color:#032F62;">)</span><span style="color:#032F62;">})\`</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedRightCol</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> props.columns.</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">((</span><span style="color:#E36209;">i</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> i.fixed </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;right&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedRightColWidthArr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> fixedRightCol.</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">item</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;1fr&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fixedRightColWidthStr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`calc(\${</span><span style="color:#24292E;">fixedRightColWidthArr</span><span style="color:#032F62;">.</span><span style="color:#6F42C1;">join</span><span style="color:#032F62;">(</span><span style="color:#032F62;">&quot; + &quot;</span><span style="color:#032F62;">)</span><span style="color:#032F62;">})\`</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setWidth</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">normalcolWidth</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> props.columns</span></span>
<span class="line"><span style="color:#24292E;">        .</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">((</span><span style="color:#E36209;">i</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">!</span><span style="color:#24292E;">i.fixed)</span></span>
<span class="line"><span style="color:#24292E;">        .</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">item</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> item.width </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;1fr&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> colWidth </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> [];</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">!!</span><span style="color:#24292E;">fixedLeftCol.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> colWidth.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(fixedLeftColWidthStr);</span></span>
<span class="line"><span style="color:#24292E;">      colWidth.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">...</span><span style="color:#24292E;">normalcolWidth);</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">!!</span><span style="color:#24292E;">fixedRightCol.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> colWidth.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(fixedRightColWidthStr);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> colWidth.</span><span style="color:#6F42C1;">join</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot; &quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      colStyle,</span></span>
<span class="line"><span style="color:#24292E;">      fixedLeftCol,</span></span>
<span class="line"><span style="color:#24292E;">      fixedLeftColWidthStr,</span></span>
<span class="line"><span style="color:#24292E;">      fixedRightCol,</span></span>
<span class="line"><span style="color:#24292E;">      fixedRightColWidthStr,</span></span>
<span class="line"><span style="color:#24292E;">    };</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#24292E;">&lt;/</span><span style="color:#22863A;">script</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">&lt;</span><span style="color:#22863A;">style</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">lang</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;scss&quot;</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#6F42C1;">.table</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">overflow-y</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">scroll</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  .</span><span style="color:#005CC5;">table-header</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">text-align</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">center</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">#f0f3ff</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#005CC5;">header-item</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">#f0f3ff</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">#4a6cf7</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">font-size</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">20</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">height</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">60</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">line-height</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">60</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">font-weight</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">400</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">.table-content</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">width</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">100</span><span style="color:#D73A49;">%</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#005CC5;">content-col</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">width</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">100</span><span style="color:#D73A49;">%</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">position</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">relative</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      .</span><span style="color:#005CC5;">col-item</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">text-align</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">center</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        // </span><span style="color:#005CC5;">text-overflow</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">ellipsis</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">white-space</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">nowrap</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">#ffffff</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">height</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">60</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">line-height</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">60</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">padding</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">0</span><span style="color:#D73A49;">px</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        // </span><span style="color:#005CC5;">flex</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">.zebra-color</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">background-color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">#f0f3ff</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">.tips</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">display</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">flex</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">flex-direction</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">column</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">align-items</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">center</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">justify-content</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">center</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">height</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">300</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      .</span><span style="color:#005CC5;">tips-img</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">width</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">210</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">height</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">100</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">margin-bottom</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">16</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">.tips-text</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">font-size</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">20</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">font-weight</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">500</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">#999999</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">.grid</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">display</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">grid</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">.table-font</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">font-size</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">20</span><span style="color:#D73A49;">px</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">color</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">#333333</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">font-weight</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">400</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">.border-right</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">border-right</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">1</span><span style="color:#D73A49;">px</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">solid</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">#e6e6e6</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">.border-left</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">border-left</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">1</span><span style="color:#D73A49;">px</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">solid</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">#e6e6e6</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#6F42C1;">.fixed</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">position</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">sticky</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">height</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">inherit</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">display</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">flex</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  &amp; &gt; </span><span style="color:#005CC5;">view</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">flex</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"><span style="color:#24292E;">&lt;/</span><span style="color:#22863A;">style</span><span style="color:#24292E;">&gt;</span></span></code></pre></div>`,57),t=[o];function e(c,r,E,y,i,F){return n(),a("div",null,t)}const C=s(p,[["render",e]]);export{d as __pageData,C as default};
