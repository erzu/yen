'use strict';

var _ = require('@ali/belt')


/*
 * Cannot rename `this` in strict mode. So let's just use window object directly.
 */
var win = window
var doc = win.document


/*
 * IE[6-8] does not have global Node interface, let's just pretend
 * there is one.
 */
/* global -Node */
var Node = win.Node || {
  ELEMENT_NODE: 1,
  DOCUMENT_NODE: 9
}


/*
 * Glue methods for compatiblity
 */

function _hasClass(el, cls) {
  if (el.classList) {
    return el.classList.contains(cls)
  }
  else if (el.className) {
    return el.className.trim().split(/\s+/).indexOf(cls) >= 0
  }
}

function _removeClass(el, cls) {
  if (el.classList) {
    el.classList.remove(cls)
  }
  else {
    var classes = el.className.trim().split(/\s+/)

    for (var i = classes.length - 1; i >= 0; i--) {
      if (classes[i] == cls) {
        classes.splice(i, 1)
      }
    }

    el.className = classes.join(' ')
  }
}

function _addClass(el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  }
  else if (!_hasClass(el, cls)) {
    el.className += ' ' + cls
  }
}

function _querySelectorAll(selector, context) {
  return _findMatchingElements(selector, context)
}

function _findMatchingElements(selector, context, firstMatch) {
  var el

  if (/^#[a-z]+$/i.test(selector)){  // 优化单独的ID选择器
    el = doc.getElementById(selector.slice(1))
    return firstMatch ? el : [el]
  }

  var descendants = context.getElementsByTagName('*')
  var selectedElements = []

  for (var i = 0, length = descendants.length; i < length; i++) {
    el = descendants[i]
    if (_matchesCommaSelectorList(el, selector, context)) {
      if (firstMatch) {
        return el
      }
      selectedElements.push(el)
    }
  }

  return selectedElements
}

function _matchesCommaSelectorList(el, selector, context) {
  var selectorList = selector.split(',')
  return selectorList.some(function(selector){
    if (_matchesDescendantSelectorList(el, selector, context)) {
      return true
    }
  })
}

function _matchesDescendantSelectorList(el, selector, context) {
  var childSelectorMatchesElement
  var selectorList = selector.replace(/>/g,' $& ').trim().split(/\s+/).reverse()
  return selectorList.every(function(selector, index){
    if (index === 0) {
      return _matchesSimpleSelectorList(el, selector) && _isAncestor(context, el)
    }
    else {
      if (selector === '>') {
        childSelectorMatchesElement = el
        return true
      }
      if (childSelectorMatchesElement) {
        var parentNode = childSelectorMatchesElement.parentNode
        childSelectorMatchesElement = false
        el = el.parentNode
        return _matchesSimpleSelectorList(parentNode, selector)
      }
      el = el.parentNode
      while(el && !_matchesSimpleSelectorList(el, selector)){
        el = el.parentNode
      }
      return !!el
    }
  })
}

function _matchesSimpleSelectorList(el, selector) {
  var matchResult
  var simpleSelectorListRegex = /[.#:][\w-]+|\[(.+?)(?:=(["']?)(.*?)\1)?]|^[a-z-]+/g

  // See http://www.jshint.com/docs/options/#boss on why this syntax
  // Maybe I should consider taking eslint a closer look.
  while ((matchResult = simpleSelectorListRegex.exec(selector))) {
    var simpleSelector = matchResult[0]
    if (!_matches(el, simpleSelector)) {
      return false
    }
  }
  return true
}

function _matches(el, selector) {
  if (!el) return false

  if (el.matches) {
    return el.matches(selector)
  }

  var fchar = selector.charAt(0)

  if (fchar == '#') {
    return el.id === selector.slice(1)
  }
  else if (fchar == '.') {
    return _hasClass(el, selector.slice(1))
  }
  else if (fchar == '[') {
    var matchResult = selector.match(/^\[(.+?)(=(["']?)(.*?)\3)?]$/i)
    var attrName = matchResult[1]
    var hasAttrValue = !!matchResult[2]
    var attrValue = hasAttrValue ? matchResult[4] : undefined

    if (!attrName) {
      throw new Error('Invalid attribute selector: ' + selector)
    }

    var value = attrName === 'class' ? el.className : el.getAttribute(attrName)
    return attrValue === undefined ? value !== null : value === attrValue
  }
  else if (fchar == ':') {
    var pseudoClass = selector.slice(1)

    switch(pseudoClass){
      case  'first-child' :
        return el.parentNode.firstElementChild || _getFirstElementChild(el.parentNode) === el
    }
  }
  else {
    return el.tagName === selector.toUpperCase()
  }
}

function is(node, type) {
  return !!node && node.nodeType == type
}

function match(node, tag) {
  return node.tagName.toLowerCase() === tag
}

function _isAncestor(ancestor, descendant) {
  while ((descendant = descendant.parentNode)) {
    if (descendant === ancestor) {
      return true
    }
  }
  return false
}

function _getFirstElementChild(node) {
  var children = node.childNodes
  for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i]
      if (child.nodeType === Node.ELEMENT_NODE) {
          return child
      }
  }
  return null
}

/*
 * Legacy IEs don't have window.getComputedStyle. They have got
 * .currentStyle property on DOM elements instead. But the property
 * value of that object might not be absolute.
 *
 * The return value of window.computedStyle in Firefox & Safari 5
 * does not support access via shorthand property, such as margin, padding, font.
 *
 * References:
 * - http://www.quirksmode.org/dom/getstyles.html
 * - http://ie.microsoft.com/testdrive/HTML5/getComputedStyle/
 */
function _getStyle(el, prop) {
  if (win.getComputedStyle) {
    prop = _.dasherize(prop)
    return getComputedStyle(el).getPropertyValue(prop)
  }
  else if (el.currentStyle) {
    prop = _.camelize(prop)
    return el.currentStyle[prop]
  }
}

function _setStyle(el, prop, value) {
  el.style[prop] = _regulate(value, prop)
}

function _regulate(value, prop) {
  if (!value) return value

  if ('width height top right bottom left'.split(' ').indexOf(prop) >= 0 &&
      !/[^-\.\d]/.test(value)) {
    value = value + 'px'
  }

  return value
}


/*
 * Array-like object constructor
 *
 * References:
 * - https://github.com/jquery/jquery/blob/15a609f7663c4348ab7f1acbc9e566ec20bb717c/src/core/init.js
 */

function YSet(selector, context) {
  context = context || doc
  var nodes = []

  if (!selector) {
    // nothing to do
  }
  else if (selector.nodeType) {
    nodes = [selector]
  }
  else if (typeof selector == 'string') {
    if (doc.querySelectorAll) {
      nodes = context.querySelectorAll(selector)
    }
    else {
      nodes = _querySelectorAll(selector, context)
    }
  }
  else if (selector) {
    nodes = 'length' in selector ? selector : [selector]
  }

  var len = nodes.length

  for (var i = 0; i < len; i++) {
    this[i] = nodes[i]
  }
  this.length = len
}

function yen(selector, context) {
  return new YSet(selector, context)
}

yen.fn = YSet.prototype

yen.fn.find = function(selector) {
  if (this.length > 0)
    return new YSet(selector, this[0])
  else
    return new YSet()
}

yen.fn.next = function(tag) {
  var node = this[0]

  while ((node = node.nextSibling)) {
    if (is(node, 1)) {
      if (!tag || match(node, tag)) {
        break
      }
    }
  }

  return new YSet(node)
}

yen.fn.each = function(fn) {
  for (var i = 0, len = this.length; i < len; i++) {
    // Should we be compatible with jQuery#each, or Array#forEach in ECMAScript 5?
    // - http://api.jquery.com/each/
    // - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    fn(this[i], i)
  }

  return this
}

yen.fn.map = function(fn) {
  var res = []

  for (var i = 0, len = this.length; i < len; i++) {
    res[i] = fn(this[i], i)
  }

  return res
}

yen.fn.hasClass = function(cls) {
  return _hasClass(this[0], cls)
}

yen.fn.addClass = function(cls) {
  return this.each(function(el) {
    _addClass(el, cls)
  })
}

yen.fn.removeClass = function(cls) {
  return this.each(function(el) {
    _removeClass(el, cls)
  })
}

yen.fn.toggleClass = function(cls) {
  return this.each(function(el) {
    if (_hasClass(el, cls)) {
      _removeClass(el, cls)
    }
    else {
      _addClass(el, cls)
    }
  })
}

yen.fn.html = function(markup) {
  if (typeof markup == 'undefined') {
    return this[0].innerHTML
  }
  else {
    return this.each(function(el) {
      el.innerHTML = markup
    })
  }
}

yen.fn.attr = function(p, v) {
  if (typeof v == 'undefined' && this.length > 0) {
    return this[0].getAttribute(p)
  }
  else {
    return this.each(function(el) {
      el.setAttribute(p, v)
    })
  }
}

yen.fn.hasAttr = function(p) {
  if (this.length > 0) {
    var el = this[0]

    // el.getAttribute(p) Does not work well on legacy IE
    // If the passed p is some special property like `id',
    // the return value will be string no matter the id attribute
    // does present in the HTML or not.
    //
    // References:
    // - http://gitlab.alibaba-inc.com/central/yen/issues/5

    return el.hasAttribute ?
      el.hasAttribute(p) :
      el.getAttribute(p) !== null
  }
}

yen.fn.removeAttr = function(p) {
  return this.each(function(el) {
    el.removeAttribute(p)
  })
}

yen.fn.val = function(value) {
  if (typeof value === 'undefined') {
    return this.length > 0 ? this[0].value : null
  }

  return this.each(function(el) {
    el.value = value
  })
}

/*
 * Whether or not to use Element@dataset?
 */
yen.fn.data = function(attr, value) {
  if (typeof value === 'undefined' && this.length > 0) {
    return _.cast(this[0].getAttribute('data-' + attr))
  }
  else {
    return this.each(function(el) {
      el.setAttribute('data-' + attr, value)
    })
  }
}

yen.fn.first = function() {
  return new YSet(this[0])
}

yen.fn.last = function() {
  return new YSet(this[this.length - 1])
}

yen.fn.next = function() {
  var el = this[0]

  do {
    el = el.nextSibling
  }
  while (el && 1 !== el.nodeType)

  return new YSet(el)
}

yen.fn.get = function(index) {
  return new YSet(this[index])
}

yen.fn.children = function() {
  if (this.length > 0) {
    var el = this[0]
    var child = el.firstChild
    var children = []

    while (child) {
      if (1 == child.nodeType) children.push(child)
      child = child.nextSibling
    }

    return new YSet(children)
  }
  else {
    return new YSet()
  }
}

yen.fn.parent = function(selector) {
  var el = this[0]
  var parent = el.parentNode

  if (typeof selector != 'undefined') {
    while (parent) {
      if (_matches(parent, selector)) {
        return new YSet(parent)
      }
      else {
        parent = parent.parentNode
      }
    }
  }
  else {
    return parent && new YSet(parent)
  }
}

yen.fn.show = function() {
  return this.each(function(el) {
    el.style.display = ''
  })
}

yen.fn.hide = function() {
  return this.each(function(el) {
    el.style.display = 'none'
  })
}


/*
 * Should be using api like offsetWidth and .getBoundingClientRect:
 *
 * - https://github.com/dexteryy/DollarJS/blob/master/dollar/origin.js#L707
 * - https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
 * - http://www.w3.org/TR/cssom-view/#dom-element-getboundingclientrect
 *
 * But current approach will return correct value even if the element is hidden,
 * e.g. element.style.display === 'none'.
 */
;['height', 'width'].forEach(function(dimension) {
  var Pair = dimension === 'height' ? ['Top', 'Bottom'] : ['Left', 'Right']
  var Dimension = _.capitalize(dimension)

  function toInteger(str) {
    var res = parseInt(str, 10)
    return isNaN(res) ? 0 : res
  }

  yen.fn[dimension] = function() {
    return Math.max(this[0]['offset' + Dimension], toInteger(this.css(dimension)))
  }

  yen.fn['inner' + Dimension] = function() {
    var self = this
    return this[dimension]() + Pair.reduce(function(result, prop) {
        return result + toInteger(self.css('padding' + prop))
      }, 0)
  }

  yen.fn['outer' + Dimension] = function(includeMargin) {
    var self = this
    var result = this['inner' + Dimension]()

    result += Pair.reduce(function(result, prop) {
      return result + toInteger(self.css('border' + prop + 'Width'))
    }, 0)

    if (includeMargin) {
      result += Pair.reduce(function(result, prop) {
        return result + toInteger(self.css('margin' + prop))
      }, 0)
    }

    return result
  }
})

yen.fn.css = function(p, v) {
  if (typeof v == 'undefined' && typeof p == 'string' && this.length > 0) {
    return _getStyle(this[0], p)
  }

  return this.each(function(el) {
    if (typeof v == 'undefined' && typeof p == 'object') {
      for (var prop in p) {
        _setStyle(el, _.camelize(prop), p[prop])
      }
    }
    else {
      _setStyle(el, _.camelize(p), v)
    }
  })
}

yen.fn.prepend = function(content) {
  if (typeof content === 'string') {
    content = document.createTextNode(content)
  }

  return this.each(function(el) {
    if (content instanceof YSet) {
      content.each(function(content) {
        el.insertBefore(content, el.firstChild)
      })
    }
    else if (content.nodeType === 1) {
      el.insertBefore(content, el.firstChild)
    }
    else {
      el.insertBefore(content, el.firstChild)
    }
  })
}

yen.fn.append = function(content) {
  if (typeof content === 'string') {
    content = document.createTextNode(content)
  }

  return this.each(function(el) {
    if (content instanceof YSet) {
      content.each(function(child) {
        el.appendChild(child)
      })
    }
    else {
      el.appendChild(content)
    }
  })
}

yen.fn.appendTo = function(parent) {
  parent = new YSet(parent)

  return this.each(function(el) {
    parent.append(el)
  })
}

yen.fn.clone = function() {
  return new YSet(this.map(function(el) {
    return el.cloneNode(true)
  }))
}

yen.fn.remove = function() {
  return this.each(function(el) {
    el.parentNode.removeChild(el)
  })
}

yen.fn.position = function() {
  if (this.length > 0) {
    var el = this[0]

    return {
      left: el.offsetLeft,
      top: el.offsetTop
    }
  }
}

yen.fn.offset = function() {
  if (this.length > 0) {
    var el = this[0]
    var box = { top: 0, left: 0 }
    var doc = el && el.ownerDocument
    var docElem

    if (!doc) return
    docElem = doc.documentElement

    if (typeof el.getBoundingClientRect !== undefined)
      box = el.getBoundingClientRect()

    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    }
  }
}

var Events = require('./events')


/*
 * Event System for yen
 */
yen.fn.on = function(type, fn) {
  return this.each(function(elem) {
    Events.on(elem, type, fn)
  })
}

yen.fn.off = function(type, fn) {
  return this.each(function(elem) {
    Events.off(elem, type, fn)
  })
}

yen.fn.trigger = function(e) {
  return this.each(function(elem) {
    Events.trigger(elem, e)
  })
}

yen.Events = Events

module.exports = yen
