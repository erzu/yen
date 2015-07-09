# Yen

[![NPM Downloads](https://img.shields.io/npm/dm/yen.svg?style=flat)](https://www.npmjs.com/package/yen) 
[![NPM Version](https://img.shields.io/npm/v/yen.svg?style=flat)](https://www.npmjs.com/package/yen) 

jQuery inspired DOM selection and manipulation library.


## Usage

If your project's setup enables using CMD modules directly, you can just install
Yen via `npm`.

```bash
$ npm install yen --save
```


### Precompiled Version

There's no precompiled version of Yen yet, but we'll see to it shortly.


### Oceanify

And if your project is based on express or koa, you can just use 
[oceanify][oceanify] as the CMD decorator. 

```js
var koa = require('koa')
var http = require('http')
var oceanify = require('oceanify/g')

var app = koa()
app.use(oceanify({ base: 'components' }))

http.createServer(app.callback()).listen(3000)
```

Then Yen will be avaiable in your modules within `components` folder. You can 
simply `require` it like it's in Node.

```js
var $ = require('yen')

$('body').css('background-color', 'red')
```

See [oceanify-example][oceanify-example]


### Oceanifier

If you've got no interests in the backend, you can give [oceanifier][oceanifier] 
a spin. 

```bash
$ npm install ocean-kit -g
$ ocean serve
```

Then Yen will be available at the modules within current working directory's 
`components` folder.

See [oceanify-example][oceanify-example]


## API

Yen mimics jQuery's API mostly. Functionalities like `jQuery.ajax`, 
`jQuery.Deferred`, and `jQuery.fn.animate` are all not included because the goal
of Yen. And there're better options than the ones jQuery provide out there. 

The API documentations of Yen is not completed yet. Stay tuned.


## Gotcha

During the implementation of Yen, we found certain issues in rare or ancient 
browsers that cannot be easily fixed or bypassed. To fix them will require 
a lot of code. And the benefit is quite disproportional. 

So issues like this are all found and documented here. Mostly will begone when
we can finally drop support of browsers like IE[6-8].


### `.hasAttr('id')`

In IE 6 and 7, if the element hasn't got any id attribute, `.getAttribute('id')` 
will return an empty string instead of the expected null. This causes a bug in 
`yen.fn.hasAttr`. #5

@luckydrq found this issue.


### `.css('margin')`

In firefox and safari 5, `.css('margin')` won't return the shorthand value. 
They'll return an empty string instead. 


### `.position()`

The position value returned by [jQuery.fn.position()][jQuery#position] will 
subtract the element's marginTop and marginLeft. On the other hand, 
`Element.offsetLeft` and `Element.offsetTop` will include elements margin.

`yen.fn.position` will stick with the native one:

```js
return {
  top: el.offsetTop,
  left: el.offsetLeft
}
```

In IE 6 and 7, [offsetTop and offsetLeft is problematic][cssom#offsetLeft]. The ancestors that have
their `position` set to `relative` will be ignored.


### `.querySelectorAll()` in IE 8

`.querySelectorAll()` in IE 8 is crippled. It only support [CSS 2.1][css-2.1] 
selectors. [CSS 3][css-3] selectors are supported partially.

We've found:

```js
document.querySelectorAll('#fixture li:last-child')     // invaid argument
document.getElementById('fixture').querySelectorAll('li:last-child')    // okay
```


### About `.each()` and `.map()`

In jQuery, the callback passed to `.each()` 和 `.map()` will get its `this` 
point to the element of current iteration:

```js
$('div').each(function(index, el) {
  expect(this === el).to.be(true)
})

$('div').map(function(index, el) {
  expect(this === el).to.be(true)
})
```

In Yen however, `.each()` and `.map()` shares the behaviour of the one provided 
on `Array.prototype` :

```js
$('div').each(function(el, index) {
  expect(this === window).to.be(true)
})

$('div').map(function(el, index) {
  expect(this === window).to.be(true)
})

// Yen has got .forEach() too. It won't return current instance.
$('div').forEach(function(el, index) {
  expect(this === window).to.be(true)
})
```

To summerize, the differences of `.each()` and `.map()` in Yen and jQuery are:

1. In jQuery the callback function footprint is `function(index, el) {}`. But 
   Yen uses `function(el, index) {}`, the one made popular in es5.
2. In Yen `this` is still. It points to window, but you can pass in a second 
   argument to have `this` dynamically bound to that.

```js
$('div').each(function(el) {
  // calls method on someInstance
  this.someMethod(el)
}, someInstance)
```

I think you will prefer the one Yen uses.


## Development

Yen uses [oceanifer][oceanifer] to run the development server. 

```bash
$ npm install
$ npm start
$ open http://localhost:5000/test/runner.html
```


# Yen 介绍

类似 jQuery 的 DOM 选择与操作库。


## 使用

如果你的 Web 应用后端是基于 Express 或者 Koa 开发的，那么推荐使用 [oceanify][oceanify]
管理前端组件，用过的都说好。也可以使用 browserify、webpack 这种静态编译方案。

以上方式无论哪种，使用 npm 就可以安装、更新 Yen 了：

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

Yen 仅适合在浏览器中选择、操作 DOM。如果你需要在 Node.js 中用 DOM 或者 jQuery API 操作 
HTML 字符串，可以考虑使用模仿 jQuery API 的 [cheerio][cheerio]。


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

在实践过程中，我们遇到一些坑，有些可以填，有些填起来很麻烦，代价比较大。Yen 非常重视文件尺寸，
也尽量不在源代码中做 UA 判断，因此有些性价比不高的填坑方案，都被我们放弃了，随着网速提升、
浏览器更迭，这些坑可能在不久的将来会成为历史，暂且统一列在这里。


### `.hasAttr('id')`

在 IE 6 和 7 里执行 `.getAttribute('id')` 返回的会是一个空字符串，而不是规范的 null，
会导致 `yen.fn.hasAttr` 所采用的兼容方式判断失败，详见 #5。

@luckydrq 是第一个踩到这个坑的人。


### `.css('margin')`

在 Firefox 与 Safari 5 里执行 `.css('margin')` 并不会返回缩写的 margin 值，而是返回空。


### `.position()`

[jQuery.fn.position()][jQuery#position] 返回的 `top` 与 `left` 会去掉节点的
marginTop 和 marginLeft，而 Element#offsetLeft 和 Element#offsetTop 是会把节点的
margin 考虑进去的。不清楚这个区别的前因后果，但我一直以为是等价的，所以 `yen.fn.position`
的返回值采用的后者，即：

```js
return {
  top: el.offsetTop,
  left: el.offsetLeft
}
```

不过，这个返回值[在 IE[67] 里是有问题的][cssom#offsetLeft]，会无视 `position: relative`
的父节点。


### IE8 里的 `.querySelectorAll()`

IE8 里的 `.querySelectorAll()` 功能有所残缺，仅支持 [CSS 2.1][css-2.1] 标准中所列的
选择器，部分支持 [CSS 3][css-3] 标准里的选择器。

目前踩到的有：

```js
document.querySelectorAll('#fixture li:last-child')     // 参数无效
document.getElementById('fixture').querySelectorAll('li:last-child')    // 没问题
```


### 有关 `.each()` 和 `.map()`

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

在 Yen 里，`.each()` 和 `.map()` 的行为和 `Array.prototype` 上的一致（其实就是直接用了
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

1. jQuery 是 `function(index, el) {}`，而 Yen 则是 `function(el, index) {}`
2. 不会动态绑定 `this`，和 `Array.prototype` 上的一样，默认指向全局，但可以传入第二个
   参数指定 `context`。

但是我相信你会用得更加顺手。


## 测试

我们使用 [oceanifier][oceanifier] 运行 HTTP 服务，默认端口 5000。

```bash
$ npm install
$ npm start
$ open http://localhost:5000/test/runner.html
```

我们用的测试框架是 mocha，用的断言写法是 expect.js 风格。

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
[oceanify-example]: https://github.com/erzu/oceanify-example
[jQuery#position]: http://api.jquery.com/position/
[1]: http://cyj.me/f2e/2015/05/25/yen/
[css-2.1]: http://caniuse.com/#feat=css-sel2
[css-3]: http://caniuse.com/#feat=css-sel3
