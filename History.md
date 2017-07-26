1.6.1 / 2017-07-26
==================

 * Fix: shortcut `elem` to make it faster on decent browsers and to work properly on IE8 after UglifyJS compression.


1.6.0 / 2017-03-08
==================

 * New: .prependTo()


1.5.0 / 2016-12-29
==================

 * New: support space separated className
 * Upgrade: oceanifier@5


1.4.1 / 2016-08-12
==================

 * Fix: reverse handlers because its size may vary
 * Chore: test case .prop for <video>


1.4.0 / 2016-06-13
==================

 * New: support :checked & .prop() (#39)
 * Fix: Width() regression bug (#38)


1.3.0 / 2016-03-11
==================

 * Fix: make .height(), .innerHeight(), .outerHeight()
 * Fix: toInteger->toNumber
 * Doc: goal
 * Doc: english readme
 * Upgrade: oceanifier@4.x


1.2.4 / 2015-07-09
==================

 * Added defense code for dimension methods


1.2.3 / 2015-07-06
==================

 * Fixed #27; omit document when traversing parents.
 * Refactored `.is(selector)` and related filterable methods


1.2.2 / 2015-07-02
==================

 * Found an edge case in IE8, see readme for more information.
 * Make sure the context passed around is correct.
 * Fixes #25
 * Closes #22, let the incompatibility be.


1.2.1 / 2015-06-25
==================

 * Fixed an old bug in cast() caught by @ziyunfei
 * Fixed es5 and json2 url
 * Fixed #22 `.data({})`
 * Fixed #23 `.is(selection)`


1.2.0 / 2015-06-23
==================

 * Fixed #12; implemented .html(function)
 * Enhanced .filter to support params like function and array
 * Make closest stop at first match
 * Fixed #18; implemented .closest(), .parents(), and fixed .parent() behavior
 * No need to maintain bower package; fix #16
 * support .empty()
 * Added test about #11 .attr() and fixed it
 * Removed unnecessary global define
 * Switched to eslint and adjusted code accordingly


1.1.5 / 2015-06-08
==================

 * Found and fixed an edge case in IE6
 * Fixed issue with `$([]).data('foo')`


1.1.4 / 2015-06-01
==================

 * Fix selection instance check


1.1.3 / 2015-05-30
==================

 * Return the right element when selector is window #4
 * Add npm badges
 * Add editorconfig #5


1.1.2 / 2015-05-28
==================

 * Fix dom selection when context that is not the root document.
   e.g. `$('#el-within-iframe', iframe.contentDocument)`


1.1.1 / 2015-05-27
==================

 * Fix errors in readme and add some links for further reading
 * Licensed under MIT


1.1.0 / 2015-05-26
==================

 * Switch to oceanify
 * Remove dependencies


1.0.0 / 2015-05-05
==================

 * Add `.is()` and `.prev()`.
 * Fix `.next()` error when instance is empty.
 * Change `.find()` to be compliant with `jQuery.fn.find()`
 * Change `.parent()` to be compliant with `jQuery.fn.parent()`
 * Change `.children()` to be compliant with `jQuery.fn.children()`

When current instance has got multiple elements, in jQuery methods like
`.find(selector)` will try to query selector on all of them, then return a
result with all matched candidates included.

See test cases about `.find()`, `.parent()`, and `.children()` for detail.


0.3.2 / 2015-01-27
==================

 * Fix `.currentTarget` setting error in Firefox


0.3.1 / 2014-12-04
==================

 * If getElementById returned null, do not construct [null]


0.3.0 / 2014-12-04
==================

 * Integrate yen/event into yen


0.2.0 / 2014-09-02
==================

 * Add e.currentTarget
 * Use @ali/helmsmen-kit as the test server
 * Support $(window), $({})


0.1.3 / 2014-08-14
==================

 * Fix $(document) bug


0.1.2 / 2014-08-14
==================

 * Fix require('@ali/yen') in support.js


0.1.1 / 2014-08-12
==================

 * Fix $(<object>) bug in firefox


0.1.0 / 2014-08-11
==================

 * Init module
 * Added basic DOM selection and manipulation
 * Added a simple event system
 * Added some easing functions but the tweening module isn't ready yet.
