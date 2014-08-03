/* jshint node: true */
'use strict';

var connect = require('connect')
var http = require('http')
var path = require('path')


var app = connect()

var morgan = require('morgan')
app.use(morgan('combined'))

var serveStatic = require('serve-static')
app.use(serveStatic(__dirname))

var helmsmen = require('@ali/helmsmen')
app.use(helmsmen({
  base: path.join(__dirname, '..', 'node_modules'),
  local: { '@ali/yen': path.join(__dirname, '..') }
}))


http.createServer(app).listen(3000)
