/* jshint node: true */
'use strict';

var connect = require('connect')
var http = require('http')
var path = require('path')

var PORT = 3000


var app = connect()

var serveStatic = require('serve-static')
app.use(serveStatic(__dirname))

var helmsmen = require('@ali/helmsmen')
app.use(helmsmen({
  base: path.join(__dirname, '..', 'node_modules'),
  local: { '@ali/yen': path.join(__dirname, '..') }
}))


http.createServer(app).listen(PORT, function() {
  console.log('Server started at', PORT)
})
