var $ = require('@ali/yen')
var heredoc = require('heredoc')
var _ = require('@ali/belt')

// 修改自 Modernizr.js
var div = document.createElement('div')
var canvas = document.createElement('canvas')
var docElement = document.documentElement
var docStyle = docElement.style
var cssomPrefixes = 'Webkit Moz O ms'.split(' ')
var mod = 'modernizr'

var inject = function(rule, callback) {
  var body = document.body
  // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
  // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
  var style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('')

  div.id = mod
  div.innerHTML += style
  body.appendChild(div)

  var ret = callback(div, rule)

  div.parentNode.removeChild(div)

  return !!ret
}

function is(obj, type) {
  return typeof obj === type
}

function detect(props, prefixed) {
  for (var i in props) {
    if (docStyle[props[i]] !== undefined) {
      return prefixed == 'pfx' ? props[i] : true
    }
  }

  return false
}

function has(prop, prefixed) {
  var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1)
  var props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ')

  // did they call .prefixed('boxSizing') or are we just testing a prop?
  if(is(prefixed, 'string') || is(prefixed, 'undefined')) {
    return detect(props, prefixed)
  }
}

function has3d() {
  var ret = !!has('perspective')
  // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
  // It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
  // some conditions. As a result, Webkit typically recognizes the syntax but
  // will sometimes throw a false positive, thus we must do a more thorough check:
  if (ret && 'webkitPerspective' in docElement.style) {
    // Webkit allows this media query to succeed only if the feature is enabled.
    // `@media (transform-3d),(-webkit-transform-3d){ ... }`
    var media = heredoc(function(oneline) {/*
      @media (transform-3d),(-webkit-transform-3d){
        #modernizr{
          left:9px;
          position:absolute;
          height:3px;
        }
      }
    */})

    inject(media, function(node) {
      ret = node.offsetLeft === 9 && node.offsetHeight === 3
    })
  }

  return ret
}

function isHighDensity() {
  var queryDcm = heredoc(function(oneline) {/*
    only screen and (min-resolution: 124dpi),
    only screen and (min-resolution: 1.3dppx),
    only screen and (min-resolution: 48.8dpcm)
  */})

  var queryRatio = heredoc(function(oneline) {/*
    only screen and (-webkit-min-device-pixel-ratio: 1.3),
    only screen and (-o-min-device-pixel-ratio: 2.6/2),
    only screen and (min--moz-device-pixel-ratio: 1.3),
    only screen and (min-device-pixel-ratio: 1.3)
  */})

  return ((window.matchMedia &&
        (window.matchMedia(queryDcm).matches ||
        window.matchMedia(queryRatio).matches)) ||
        (window.devicePixelRatio &&
        window.devicePixelRatio > 1.3))
}

// http://stackoverflow.com/questions/19689715/what-is-the-best-way-to-detect-retina-support-on-a-device-using-javascript
function isRetina() {
  var queryDcm = heredoc(function(oneline) {/*
    only screen and (min-resolution:192dpi),
    only screen and (min-resolution:2dppx),
    only screen and (min-resolution:75.6dpcm)
  */})

  var queryRatio = heredoc(function(oneline) {/*
    only screen and (-webkit-min-device-pixel-ratio:2),
    only screen and (-o-min-device-pixel-ratio:2/1),
    only screen and (min--moz-device-pixel-ratio:2),
    only screen and (min-device-pixel-ratio:2)
  */})

  return ((window.matchMedia &&
        (window.matchMedia(queryDcm).matches ||
        window.matchMedia(queryRatio).matches)) ||
        (window.devicePixelRatio &&
        window.devicePixelRatio > 2)) &&
        /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
}

$.support = function support(feature) {
  switch(feature) {
    case '3d':
      return has3d()
    case '2d':
      return has('transform')
  }
}

_.extend($.support, {
  perspective: has('perspective'),
  transition: has('transition'),
  retina: isRetina(),
  highDensity: isHighDensity(),
  draganddrop: ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div),
  canvas: !!(canvas.getContext && canvas.getContext('2d'))
})
