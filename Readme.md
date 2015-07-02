# yen

[![NPM Downloads](https://img.shields.io/npm/dm/yen.svg?style=flat)](https://www.npmjs.com/package/yen) 
[![NPM Version](http://img.shields.io/npm/v/yen.svg?style=flat)](https://www.npmjs.com/package/yen) 

类似 jQuery 的 DOM 选择与操作库。


## Usage - 使用

### 浏览器

如果你的 Web 应用后端是基于 Express 或者 Koa 开发的，那么推荐使用 [oceanify][oceanify]
管理前端组件，用过的都说好。也可以使用 browserify、webpack 这种静态编译方案。

以上方式无论哪种，使用 npm 就可以安装、更新 yen 了：

```bash
$ npm install yen --save
```

如果你的网站需要支持 IE[6-8]，请在你的页面中加入如下条件注释：

```html
<!--[if lte IE 9]><!-->
<script src="http://amo.alicdn.com/L1/377/10010/assets/es5-7dfe7fb63d161c704e2f35874957b921.js"></script>
<script src="http://amo.alicdn.com/L1/377/10010/assets/json2-0caa31693309e1d7afbb55b0b2b0410e.js"></script>
<!--<![endif]-->
```

这两段 JS 分别提供了基本的 es5 垫片和 JSON 支持，两者在 yen 里都有用到。json2.js 来自
<https://github.com/douglascrockford/JSON-js>


### Node.js

yen 仅适合在浏览器中选择、操作 DOM。

如果你需要在 Node.js 中用 DOM 或者 jQuery API 操作 HTML 字符串，可以考虑使用模仿
jQuery API 的 [cheerio][cheerio]。


## API

### Selection

TODO

### Manipulation

TODO

### Events

TODO

### Tweening

TODO


## Gotcha - 坑

在实践过程中，我们遇到一些坑，有些可以填，有些填起来很麻烦，代价比较大。yen 非常重视文件尺寸，
也尽量不在源代码中做 UA 判断，因此有些性价比不高的填坑方案，都被我们放弃了，随着网速提升、
浏览器更迭，这些坑可能在不久的将来会成为历史，暂且统一列在这里。


### .hasAttr('id')

在 IE 6 和 7 里执行 `.getAttribute('id')` 返回的会是一个空字符串，而不是规范的 null，
会导致 yen.fn.hasAttr 所采用的兼容方式判断失败，详见 #5。

@luckydrq 是第一个踩到这个坑的人。


### .css('margin')

在 Firefox 与 Safari 5 里执行 `.css('margin')` 并不会返回缩写的 margin 值，而是返回空。


### .position()

[jQuery.fn.position()][jQuery#position] 返回的 `top` 与 `left` 会去掉节点的
marginTop 和 marginLeft，而 Element#offsetLeft 和 Element#offsetTop 是会把节点的
margin 考虑进去的。不清楚这个区别的前因后果，但我一直以为是等价的，所以 yen#position
的返回值采用的后者，即：

```js
return {
  top: el.offsetTop,
  left: el.offsetLeft
}
```

不过，这个返回值[在 IE[67] 里是有问题的][cssom#offsetLeft]，会无视 `position: relative`
的父节点。


### 有关 `.each()` and `.map()`

在 jQuery 里，`.each()` 和 `.map()` 在调用传入的回调函数时，会动态改变这个函数的 this，
变为当前迭代的节点：

```js
$('div').each(function(index, el) {
  expect(this === el).to.be(true)
})

$('div').map(function(index, el) {
  expect(this === el).to.be(true)
})
```

在 yen 里，`.each()` 和 `.map()` 的行为和 `Array.prototype` 上的一致（其实就是直接用了
数组原型链上的这两个方法）：

```js
$('div').each(function(el, index) {
  expect(this === window).to.be(true)
})

$('div').map(function(el, index) {
  expect(this === window).to.be(true)
})

// 还有 .forEach()，和 .each() 的区别是 .forEach 没有返回值
$('div').forEach(function(el, index) {
  expect(this === window).to.be(true)
})
```

总结一下，yen 里的 `.each()` 和 `.map()` 和 jQuery 的区别在于：

1. jQuery 是 `function(index, el) {}`，而 yen 则是 `function(el, index) {}`
2. 不会动态绑定 `this`，和 `Array.prototype` 上的一样，默认指向全局，但可以传入第二个
   参数指定 `context`。

但是我相信你会用得更加顺手。


## Tests - 测试

我们使用 [oceanifier][oceanifier] 运行 HTTP 服务，默认端口 5000。

```bash
$ npm install
$ npm start
$ open http://localhost:5000/test/runner.html
```


### mocha & expect.js

我们用的测试框架是 mocha，用的断言写法是 expect.js 风格。


### totoro

我们使用 totoro 运行多个浏览器的集成测试：

```bash
$ npm start
$ totoro --runner http://`oceanify ip`/test/runner.html
```

也可以直接执行：

```bash
$ npm start
$ npm test
```


## 延伸阅读

1. [yen][1]


[cheerio]: https://github.com/cheeriojs/cheerio
[oceanify]: https://github.com/erzu/oceanify
[oceanifier]: https://github.com/erzu/oceanifier
[jQuery#position]: http://api.jquery.com/position/
[1]: http://cyj.me/f2e/2015/05/25/yen/
