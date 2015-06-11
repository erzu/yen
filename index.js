'use strict'

var Events = require('./events')


/*
 * Turns margin-left into marginLeft.
 *
 * References:
 * - http://api.rubyonrails.org/classes/ActiveSupport/Inflector.html#method-i-camelize
 */
function camelize(str) {
  return str.replace(/-([a-z])/g, function(m, chr) {
    return chr.toUpperCase()
  })
}

/*
 * Turns marginLeft into margin-left
 */
function dasherize(str) {
  return str.replace(/([A-Z])/g, function(m, chr) {
    return '-' + chr.toLowerCase()
  })
}

function capitalize(str) {
  return str.replace(/^([a-z])/, function(m, chr) {
    return chr.toUpperCase()
  })
}

function cast(str) {
  if (/^true|false$/.test(str)) {
    return str === 'true'
  }
  else if (/^\d+$/.test(str)) {
    return parseInt(str, 10)
  }
  else if (/^\d+\.\d+$/.test(str)) {
    return parseFloat(str)
  }
  else {
    return str
  }
}

var isArray = typeof Array.isArray === 'function' ? Array.isArray : function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

/*
 * Cannot rename `this` in strict mode. So let's just use window object directly.
 */
var win = window
var doc = win.document


/*
 * IE[6-8] does not have global Node interface, let's just pretend there is one.
 */
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
      if (classes[i] === cls) {
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
  var selectedElements = []

  if (/^#[a-z]+$/i.test(selector)){  // 优化单独的ID选择器
    el = (context.ownerDocument || context).getElementById(selector.slice(1))

    if (!el) {
      return selectedElements
    }
    return firstMatch ? el : [el]
  }

  var descendants = context.getElementsByTagName('*')

  for (var i = 0, length = descendants.length; i < length; i++) {
    el = descendants[i]
    if (_matchesCommaSelectorList(el, selector, context)) {
      if (firstMatch) {
        return el
      }
      else if (selectedElements.indexOf(el) < 0) {
        selectedElements.push(el)
      }
    }
  }

  return selectedElements
}

function _matchesCommaSelectorList(el, selectorWithComma, context) {
  if (el.matches) return el.matches(selectorWithComma)

  return selectorWithComma.split(',').some(function(selector){
    if (_matchesDescendantSelectorList(el, selector, context)) {
      return true
    }
  })
}

function _matchesDescendantSelectorList(el, selectorWithSpace, context) {
  var childSelectorMatchesElement
  var selectorList = selectorWithSpace.replace(/>/g, ' $& ').trim().split(/\s+/).reverse()

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

  var fchar = selector.charAt(0)

  if (fchar === '#') {
    return el.id === selector.slice(1)
  }
  else if (fchar === '.') {
    return _hasClass(el, selector.slice(1))
  }
  else if (fchar === '[') {
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
  else if (fchar === ':') {
    var pseudoClass = selector.slice(1)

    switch(pseudoClass){
      case 'first-child' :
        return (el.parentNode.firstElementChild || _getFirstElementChild(el.parentNode)) === el
      case 'last-child':
        return (el.parentNode.lastElementChild || _getLastElementChild(el.parentNode)) === el
    }
  }
  else {
    return el.tagName === selector.toUpperCase()
  }
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
  var el = node.firstChild

  while (el) {
    if (el.nodeType === Node.ELEMENT_NODE) {
      return el
    }
    el = el.nextSibling
  }

  return null
}

function _getLastElementChild(node) {
  var el = node.lastChild

  while (el) {
    if (el.nodeType === Node.ELEMENT_NODE) {
      return el
    }
    el = el.previousSibling
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
    prop = dasherize(prop)
    return getComputedStyle(el).getPropertyValue(prop)
  }
  else if (el.currentStyle) {
    prop = camelize(prop)
    return el.currentStyle[prop]
  }
}

function _regulate(value, prop) {
  if (!value) return value

  if ('width height top right bottom left'.split(' ').indexOf(prop) >= 0 &&
      !/[^-\.\d]/.test(value)) {
    value = value + 'px'
  }

  return value
}

function _setStyle(el, prop, value) {
  el.style[prop] = _regulate(value, prop)
}

function _uniq(arr) {
  var result = []

  for (var i = 0, len = arr.length; i < len; i++) {
    var el = arr[i]
    if (result.indexOf(el) < 0) result.push(el)
  }

  return result
}


/*
 * Array-like object constructor
 *
 * References:
 * - https://github.com/jquery/jquery/blob/15a609f7663c4348ab7f1acbc9e566ec20bb717c/src/core/init.js
 */

var RE_HTML = /^<(\w+)\s*\/?>(?:<\/\1>|)$/

function YSet(selector, context) {
  if (!(this instanceof YSet)) {
    return new YSet(selector, context)
  }

  context = context || doc
  var nodes = []

  if (!selector) {
    // nothing to do
  }
  else if (selector.nodeType) {
    nodes = [selector]
  }
  else if (typeof selector === 'string') {
    var m = selector.match(RE_HTML)

    if (m) {
      nodes = [document.createElement(m[1])]
    }
    else if (context instanceof YSet) {
      return context.find(selector)
    }
    else if (context.querySelectorAll) {
      nodes = context.querySelectorAll(selector)
    }
    else {
      nodes = _querySelectorAll(selector, context)
    }
  }
  else if (selector instanceof YSet) {
    nodes = selector
  }
  else if (selector) {
    nodes = isArray(selector) ? _uniq(selector) : [selector]
  }

  var len = nodes.length

  for (var i = 0; i < len; i++) {
    this[i] = nodes[i]
  }

  this.context = context
  this.length = len
}

var yen = YSet
yen.fn = YSet.prototype
var yenFn = yen.fn

yenFn.find = function(selector) {
  var candidates = []

  for (var i = 0, len = this.length; i < len; i++) {
    candidates = candidates.concat(_querySelectorAll(selector, this[i]))
  }

  return new YSet(candidates)
}

yenFn.next = function(selector) {
  var node = this[0]
  var candidate

  while (node && (node = node.nextSibling)) {
    if (node.nodeType === Node.ELEMENT_NODE &&
        (!selector || _matchesCommaSelectorList(node, selector, this.context))) {
      candidate = node
      break
    }
  }

  return new YSet(candidate)
}

yenFn.prev = function(selector) {
  var node = this[0]
  var candidate

  while (node && (node = node.previousSibling)) {
    if (node.nodeType === Node.ELEMENT_NODE &&
        (!selector || _matchesCommaSelectorList(node, selector, this.context))) {
      candidate = node
      break
    }
  }

  return new YSet(candidate)
}

yenFn.is = function(selector) {
  for (var i = 0, len = this.length; i < len; i++) {
    if (typeof selector === 'string') {
      if (_matchesCommaSelectorList(this[i], selector, this.context)) return true
    } else {
      if (this[i] === selector) return true
    }
  }

  return false
}

/*
 * Incompatible with jQuery.fn.each on purpose.
 *
 * References:
 * - http://api.jquery.com/each/
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */
yenFn.each = function(fn) {
  this.forEach(fn)
  return this
}
yenFn.forEach = Array.prototype.forEach
yenFn.map = Array.prototype.map


yenFn.hasClass = function(cls) {
  return _hasClass(this[0], cls)
}

yenFn.addClass = function(cls) {
  return this.each(function(el) {
    _addClass(el, cls)
  })
}

yenFn.removeClass = function(cls) {
  return this.each(function(el) {
    _removeClass(el, cls)
  })
}

yenFn.toggleClass = function(cls) {
  return this.each(function(el) {
    if (_hasClass(el, cls)) {
      _removeClass(el, cls)
    }
    else {
      _addClass(el, cls)
    }
  })
}

yenFn.html = function(markup) {
  if (typeof markup === 'undefined') {
    return this[0].innerHTML
  }
  else {
    return this.each(function(el) {
      el.innerHTML = markup
    })
  }
}

yenFn.attr = function(p, v) {
  if (typeof v === 'undefined' && this.length > 0) {
    return this[0].getAttribute(p)
  }
  else {
    return this.each(function(el) {
      el.setAttribute(p, v)
    })
  }
}

yenFn.hasAttr = function(p) {
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

yenFn.removeAttr = function(p) {
  return this.each(function(el) {
    el.removeAttribute(p)
  })
}

yenFn.val = function(value) {
  if (typeof value === 'undefined') {
    return this.length > 0 ? this[0].value : null
  }

  return this.each(function(el) {
    el.value = value
  })
}

/*
 * Whether or not to use Element@dataset?
 *
 * 2015-06-08 @dotnil
 * In IE6, if we set data attribute with non-string value and retrieve it later
 * via getAttribute('data-foo'), it will return the original non-string value.
 * This will cause the cast process fail.
 */
yenFn.data = function(attr, value) {
  if (typeof value === 'undefined') {
    if (this.length > 0) {
      var val = this[0].getAttribute('data-' + attr)
      return val === null ? undefined : (typeof val === 'string' ? cast(val) : val)
    }
  }
  else {
    return this.each(function(el) {
      el.setAttribute('data-' + attr, value)
    })
  }
}

yenFn.first = function() {
  return new YSet(this[0])
}

yenFn.last = function() {
  return new YSet(this[this.length - 1])
}

yenFn.get = function(index) {
  return new YSet(this[index])
}

yenFn.children = function(selector) {
  var candidates = []

  for (var i = 0, len = this.length; i < len; i++) {
    var el = this[i].firstChild

    while (el) {
      if (Node.ELEMENT_NODE === el.nodeType &&
          (!selector || _matchesCommaSelectorList(el, selector, this.context))) {
        candidates.push(el)
      }
      el = el.nextSibling
    }
  }

  return new YSet(candidates)
}

yenFn.parent = function(selector) {
  var candidates = []

  for (var i = 0, len = this.length; i < len; i++) {
    var el = this[i]

    while ((el = el.parentNode)) {
      if (!selector || _matchesCommaSelectorList(el, selector, this.context)) {
        candidates.push(el)
        break
      }
    }
  }

  return new YSet(candidates)
}

yenFn.show = function() {
  return this.each(function(el) {
    el.style.display = ''
  })
}

yenFn.hide = function() {
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
; ['height', 'width'].forEach(function(dimension) {
  var Pair = dimension === 'height' ? ['Top', 'Bottom'] : ['Left', 'Right']
  var Dimension = capitalize(dimension)

  function toInteger(str) {
    var res = parseInt(str, 10)
    return isNaN(res) ? 0 : res
  }

  yenFn[dimension] = function() {
    return Math.max(this[0]['offset' + Dimension], toInteger(this.css(dimension)))
  }

  yenFn['inner' + Dimension] = function() {
    var self = this
    return this[dimension]() + Pair.reduce(function(total, prop) {
        return total + toInteger(self.css('padding' + prop))
      }, 0)
  }

  yenFn['outer' + Dimension] = function(includeMargin) {
    var self = this
    var result = this['inner' + Dimension]()

    result += Pair.reduce(function(total, prop) {
      return total + toInteger(self.css('border' + prop + 'Width'))
    }, 0)

    if (includeMargin) {
      result += Pair.reduce(function(total, prop) {
        return total + toInteger(self.css('margin' + prop))
      }, 0)
    }

    return result
  }
})

yenFn.css = function(p, v) {
  if (typeof v === 'undefined' && typeof p === 'string' && this.length > 0) {
    return _getStyle(this[0], p)
  }

  return this.each(function(el) {
    if (typeof v === 'undefined' && typeof p === 'object') {
      for (var prop in p) {
        _setStyle(el, camelize(prop), p[prop])
      }
    }
    else {
      _setStyle(el, camelize(p), v)
    }
  })
}

yenFn.prepend = function(child) {
  if (typeof child === 'string') {
    child = document.createTextNode(child)
  }

  return this.each(function(el) {
    new YSet(child).each(function(childEl) {
      el.insertBefore(childEl, el.firstChild)
    })
  })
}

yenFn.append = function(child) {
  if (typeof child === 'string') {
    child = document.createTextNode(child)
  }

  return this.each(function(el) {
    new YSet(child).each(function(childEl) {
      el.appendChild(childEl)
    })
  })
}

yenFn.appendTo = function(parent) {
  parent = new YSet(parent)

  return this.each(function(el) {
    parent.append(el)
  })
}

yenFn.clone = function() {
  return new YSet(this.map(function(el) {
    return el.cloneNode(true)
  }))
}

yenFn.remove = function() {
  return this.each(function(el) {
    el.parentNode.removeChild(el)
  })
}

yenFn.position = function() {
  if (this.length > 0) {
    var el = this[0]

    return {
      left: el.offsetLeft,
      top: el.offsetTop
    }
  }
}

yenFn.offset = function() {
  if (this.length > 0) {
    var el = this[0]
    var documentEl = el && el.ownerDocument && el.ownerDocument.documentElement

    if (!documentEl) return

    var box = typeof el.getBoundingClientRect === 'function'
      ? el.getBoundingClientRect()
      : { top: 0, left: 0 }

    return {
      top: box.top + win.pageYOffset - documentEl.clientTop,
      left: box.left + win.pageXOffset - documentEl.clientLeft
    }
  }
}

yenFn.empty = function(){
  return this.each(function(el){
    if (el.nodeType === 1) {
      //prevent memory leaks
      new YSet(el).find('*').each(function(child){
        if (child.nodeType === 1) {
          Events.off(child)
        }
      })
    }

    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }
  })
}


/*
 * The customized object will behave like array in console if the object has got
 * `.length` and `.splice`. We can borrow `.splice` from Array.prototype
 * directly.
 *
 * References:
 * - http://www.elijahmanor.com/jquery-object-quacks-like-an-array-duck/
 * - http://stackoverflow.com/questions/6599071/array-like-objects-in-javascript
 */
yenFn.splice = Array.prototype.splice
yenFn.length = 0


/*
 * Event System for yen
 */
yenFn.on = function(type, fn) {
  return this.each(function(elem) {
    Events.on(elem, type, fn)
  })
}

yenFn.off = function(type, fn) {
  return this.each(function(elem) {
    Events.off(elem, type, fn)
  })
}

yenFn.trigger = function(e) {
  return this.each(function(elem) {
    Events.trigger(elem, e)
  })
}

yen.Events = Events


module.exports = yen
