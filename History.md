1.1.0 / 2015-05-26
==================

 * Switch to caka
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
