var yen = require('@ali/yen')

/*
 * _getData and _removeData
 * Store the guid on the element.
 * Use a cache to store all the extra info,
 * including all the event handlers.
 * The 'data1392604038461' expando is to avoid
 * conflicting with user defined properties
 */
var cache = {}
var guidCounter = 1 // used in _getData and _removeData
var nextGuid = 1 // used to track event handlers
var expando = 'data' + (new Date()).getTime()

function Events() {}

function _getData(elem) {
  var guid = elem[expando]
  if (!guid) {
    guid = elem[expando] = guidCounter++
    cache[guid] = {}
  }
  return cache[guid]
}

function _removeData(elem) {
  var guid = elem[expando]
  if (!guid) return
  delete cache[guid]
  try {
    delete elem[expando]
  }
  catch(e) {
    if (elem.removeAttribute) {
      elem.removeAttribute(expando)
    }
  }
}

/*
 * Event support detection
 * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
 */
function _isEventSupported(eventName) {
  var element = document.createElement('div')
  var isSupported

  eventName = 'on' + eventName
  isSupported = (eventName in element)

  if (!isSupported) {
    element.setAttribute(eventName, 'return;')
    isSupported = typeof element[eventName] == 'function'
  }

  element = null

  return isSupported
}

/*
 * Fix the event object in IE6-8
 * or when triggering events by code
 */
function _fixEvent(event) {
  function returnTrue() { return true }
  function returnFalse() { return false }

  if (!event || !event.stopPropagation) {
    var old = event || window.event

    // Clone the old objects so that we can modify the values
    event = {}

    for (var prop in old) {
      event[prop] = old[prop]
    }

    // The event occurred on this element
    if (!event.target) {
      event.target = event.srcElement || document
    }

    // Handle which other element the event is related to
    event.relatedTarget = event.fromElement === event.target ?
      event.toElement : event.fromElement

    // Stop the default browser action
    event.preventDefault = function() {
      event.returnValue = false
      event.isDefaultPrevented = returnTrue
    }
    event.isDefaultPrevented = returnFalse

    // Stop the event from bubbling
    event.stopPropagation = function() {
      event.cancelBubble = true
      event.isPropagationStopped = returnTrue
    }
    event.isPropagationStopped = returnFalse

    // Stop the event from bubbling and executing other handlers
    event.stopImmediatePropagation = function() {
      this.isImmediatePropagationStopped = returnTrue
      this.stopPropagation()
    }
    event.isImmediatePropagationStopped = returnFalse

    // Handle mouse position
    if (event.clientX != null) {
      var doc = document.documentElement,
          body = document.body
      event.pageX = event.clientX +
                    (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                    (doc && doc.clientLeft || body && body.clientLeft || 0)
      event.pageY = event.clientY +
                    (doc && doc.scrollTop || body && body.scrollTop || 0) -
                    (doc && doc.clientTop || body && body.clientTop || 0)
    }

    // Handle key presses
    event.which = event.charCode || event.keyCode

    // Fix button for mouse clicks:
    // 0 == left; 1 == middle; 2 == right
    if (event.button != null) {
      event.button = (event.button & 1 ? 0 :
        (event.button & 4 ? 1 :
          (event.button & 2 ? 2 : 0)))
    }
  }

  return event
}

/*
 * Fix custom event object
 */
function _fixCustomEvent(event) {
  function returnFalse() { return false }

  event.isDefaultPrevented = returnFalse
  event.isPropagationStopped = returnFalse

  return event
}

/*
 * separate this out from Events.off
 * the actual removeEventListener logic
 */
function _tidyUp(elem, type) {
  function isEmpty(object) {
    for (var prop in object) {
      return false
    }
    return true
  }

  var data = _getData(elem)

  if (data.handlers[type].length === 0) {
    delete data.handlers[type]

    if (!elem.addEventListener && !elem.attachEvent) {
      // custom object
    }

    // DOM element
    else if (document.removeEventListener) {
      elem.removeEventListener(
          type === 'focusin' ? 'focus' :
            type === 'focusout' ? 'blur' : type,
          data.dispatcher,
          type === 'focusin' || type === 'focusout')
    }
    else if (document.detachEvent) {
      elem.detachEvent('on' + type, data.dispatcher)
    }
  }

  if (isEmpty(data.handlers)) {
    delete data.handlers
    ;delete data.dispatcher
  }

  if (isEmpty(data)) {
    _removeData(elem)
  }
}

/*
 * A helper function to simulate mouseenter/mouseleave
 */
function _withinElement(elem, event, type, handle) {
  var parent = event.relatedTarget
  while (parent && parent != elem) {
    try {
      parent = parent.parentNode
    }
    catch(e) {
      break
    }
  }
  if (parent != elem) {
    handle.call(elem, type)
  }
}

function _setDataTreeDisabled(elem, status) {
  var data = _getData(elem)
  var parent = elem.parentNode || elem.ownerDocument

  data.disabled = status

  while (parent) {
    data = _getData(parent)
    if (typeof data.disabled !== 'undefined') {
      data.disabled = status
    }
    parent = parent.parentNode || parent.ownerDocument
  }
}

Events.on = function(elem, type, fn) {
  // older versions of modern browsers doesn't support
  // mouseenter/mouseleave, simulate using mouseover/mouseout
  // BUT if not natively supported,
  // how to turn off or trigger mouseenter/mouseleave, any ideas???
  if (/mouseenter|mouseleave/.test(type) &&
      !_isEventSupported('mouseenter')) {
    var eventMap = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    }
    Events.on(elem, eventMap[type], function(e) {
      _withinElement(this, e, eventMap[type], fn)
    })
    return
  }

  var data = _getData(elem)

  if (!data.handlers) data.handlers = {}

  if (!data.handlers[type]) data.handlers[type] = []

  if (!fn.guid) fn.guid = nextGuid++

  data.handlers[type].push(fn)

  if (!data.dispatcher) {
    data.disabled = false
    data.dispatcher = function(event) {
      if (data.disabled) return
      event = (!elem.addEventListener && !elem.attachEvent) ?
              event : _fixEvent(event)
      event.currentTarget = elem

      var handlers = data.handlers[event.type]
      if (handlers) {
        for (var n = 0; n < handlers.length; n++) {
          handlers[n].call(elem, event)
        }
      }
    }
  }

  if (data.handlers[type].length == 1) {
    if (!elem.addEventListener && !elem.attachEvent) {
      // custom object, just return
      return
    }

    // DOM element
    if (document.addEventListener) {
      elem.addEventListener(
        type === 'focusin' ? 'focus' :
          type === 'focusout' ? 'blur' : type,
        data.dispatcher,
        type === 'focusin' || type === 'focusout')
    }
    else if (document.attachEvent) {
      elem.attachEvent('on' + type, data.dispatcher)
    }
  }
}

Events.off = function(elem, type, fn) {
  var data = _getData(elem)

  if (!data.handlers) return

  var removeType = function(t) {
    data.handlers[t] = []
    _tidyUp(elem, t)
  };

  if (!type) {
    for (var t in data.handlers) removeType(t)
    return
  }

  var handlers = data.handlers[type]
  if (!handlers) return

  if (!fn) {
    removeType(type)
    return
  }

  if (fn.guid) {
    for (var n = 0; n < handlers.length; n++) {
      if (handlers[n].guid === fn.guid) {
        handlers.splice(n--, 1)
      }
    }
  }

  _tidyUp(elem, type)
}

Events.trigger = function(elem, event) {
  var elemData = _getData(elem)
  var parent = elem.parentNode || elem.ownerDocument
  if (typeof event === 'string') {
    event = { type: event, target: elem }
  }
  event = (!elem.addEventListener && !elem.attachEvent) ?
          _fixCustomEvent(event) : _fixEvent(event)

  if (elemData.dispatcher) {
    elemData.dispatcher.call(elem, event)
  }

  if (parent && !event.isPropagationStopped()) {
    Events.trigger(parent, event)
  }
  else if (!parent && !event.isDefaultPrevented()) {

    // trigger the default browser action if has one
    if (event.target[event.type]) {

      /*
       * elemData.dispatcher has already been called before,
       * we need to disable all the elemData.dispatcher
       * when triggering the default browser action.
       * If not, the default browser action may cause
       * the event propagation, causing elemData.dispatcher
       * on the same element been called more than one time.
       * For example, consider the following DOM structure
       * <div id="outer"><p id="inner"></p></div>
       * You add click listener for both the <div> and the <p>,
       * and you trigger the click event on <p>.
       * If _setDataTreeDisabled(event.target, true) is not called,
       * when invoking event.target[event.type](),
       * the click event listener on the <div> will be called
       * one more time.
       */
      _setDataTreeDisabled(event.target, true)
      event.target[event.type]()
      _setDataTreeDisabled(event.target, false)
    }
  }
}

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

module.exports = Events
