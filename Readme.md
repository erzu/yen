# yen

类似 jQuery 的 DOM 选择与操作库。

## Usage - 使用

### 浏览器

我们推荐使用 [helmsmen](http://gitlab.alibaba-inc.com/central/helmsmen) 管理前端组件。

### Node.js

yen 仅适合在浏览器中选择、操作 DOM。

如果你需要在 Node.js 中用 DOM 或者 jQuery API 操作 HTML 字符串，可以考虑使用这两个模块：

1. 模仿 jQuery API 的 [cheerio](https://github.com/cheeriojs/cheerio)
2. 模仿 DOM 原生 API，提供 querySelector 等方法的 [@ali/markup](http://gitlab.alibaba-inc.com/central/markup)

## API

### Selection

TODO

### Manipulation

TODO

### Events

TODO

### Tweening

TODO

## Tests - 测试

我们使用 connect 配合 serve-static、morgan、helmsmen 等中间件运行 HTTP 服务，默认端口 3000

```bash
$ node test/server.js
$ open http://localhost:3000/runner.html
```

### mocha & expect.js

我们用的测试框架是 mocha，用的断言写法是 expect.js 风格。

### totoro

我们使用 totoro 运行多个浏览器的集成测试：

```bash
$ node test/server.js
$ totoro --runner http://<ip>:3000/runner.html
```
