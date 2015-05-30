'use strict';

var $ = require('yen')
var Events = $.Events
var heredoc = require('heredoc').strip


describe('yen/events', function() {
  describe('events for JavaScript ojbect', function() {
    it('can add and remove event listeners to JavaScript objects', function() {
      function Test() {}
      var test = new Test()
      var custom = false
      Events.on(test, 'custom', function() {
        custom = true
        Events.off(test, 'custom')
      })
      Events.trigger(test, 'custom')
      expect(custom).to.be(true)

      custom = false
      Events.trigger(test, 'custom')
      expect(custom).to.be(false)
    })

    it('can remove event listeners by event type', function() {
      function Test() {}
      var test = new Test()
      var count = 0
      Events.on(test, 'custom1', function() {
        count++
      })
      Events.on(test, 'custom2', function() {
        count++
      })
      Events.trigger(test, 'custom1')
      expect(count).to.be(1)

      Events.trigger(test, 'custom2')
      expect(count).to.be(2)

      Events.off(test, 'custom1')

      Events.trigger(test, 'custom1')
      expect(count).to.be(2)

      Events.trigger(test, 'custom2')
      expect(count).to.be(3)
    })

    it('can remove all event listeners at once', function() {
      function Test() {}
      var test = new Test()
      var count = 0
      Events.on(test, 'custom1', function() {
        count++
      })
      Events.on(test, 'custom2', function() {
        count++
      })
      Events.trigger(test, 'custom1')
      expect(count).to.be(1)

      Events.trigger(test, 'custom2')
      expect(count).to.be(2)

      Events.off(test)

      Events.trigger(test, 'custom1')
      expect(count).to.be(2)

      Events.trigger(test, 'custom2')
      expect(count).to.be(2)
    })

    it('can remove a specific event listener', function() {
      function Test() {}
      var test = new Test()
      var count = 0

      function handler1() {
        count++;
      }
      function handler2() {
        count+=2;
      }

      Events.on(test, 'custom', handler1)
      Events.on(test, 'custom', handler2)

      Events.trigger(test, 'custom')
      expect(count).to.be(3)

      Events.off(test, 'custom', handler1)

      Events.trigger(test, 'custom')
      expect(count).to.be(5)

      Events.off(test, 'custom', handler2)

      Events.trigger(test, 'custom')
      expect(count).to.be(5)
    })

    it('can respond to target and currentTarget', function() {
      function Test() {}
      var test = new Test()
      var pass = false

      function handler(e) {
        pass = this === e.target && e.target === e.currentTarget
      }

      Events.on(test, 'custom', handler)
      Events.trigger(test, 'custom')
      expect(pass).to.be(true)
    })
  })

  describe('events for yen wrapped objects', function() {
    before(function() {
      $('#fixture').html(heredoc(function() {/*
        <ul>
          <li class="entry" data-color="white"></li>
          <li class="entry" data-color="green"></li>
          <li class="entry entry-current" data-color="yellow"></li>
          <li class="entry" data-color="blue"></li>
          <li class="entry entry-last" data-color="red"></li>
        </ul>
      */}))
    })
    it('can add event listeners and trigger events', function() {
      var entries = $('.entry')
      var colors = ['white', 'green', 'yellow', 'blue', 'red']
      entries.on('click', function(e) {
        expect($(this).hasClass('entry')).to.be(true)
        e.target.style.color = $(this).attr('data-color')
      })

      entries.trigger('click')
      entries.each(function(entry, i) {
        expect(entry.style.color).to.be(colors[i])
      })
    })

    it('can remove event listeners', function() {
      var entries = $('.entry')
      entries.on('mouseover', function(e) {
        e.target.style.color = 'red'
        $(this).off('mouseover')
      })
      entries.on('mouseout', function(e) {
        e.target.style.color = 'blue'
      })

      entries.trigger('mouseover')
      entries.each(function(entry) {
        expect(entry.style.color).to.be('red')
      })
      entries.trigger('mouseout')
      entries.each(function(entry) {
        expect(entry.style.color).to.be('blue')
      })
      entries.trigger('mouseover')
      entries.each(function(entry) {
        expect(entry.style.color).to.be('blue')
      })
    })

    it('can use custom events', function() {
      var last = $('.entry-last')
      last.on('custom', function(e) {
        e.target.style.color = 'yellow'
      })

      last.trigger('custom')
      expect(last[0].style.color).to.be('yellow')
    })

    it('can respond to currentTarget', function() {
      var current = $('.entry-current')
      var ul = current.parent()
      var i = 0

      current.on('click', function(e) {
        expect($(e.currentTarget).hasClass('entry-current')).to.be(true)
      })
      ul.on('click', function(e) {
        if (i === 0) expect($(e.target).hasClass('entry-current')).to.be(true)
        else if (i === 1) expect(e.target === e.currentTarget).to.be(true)
        expect(e.currentTarget.nodeName.toLowerCase()).to.be('ul')
      })

      current.trigger('click')

      i++
      ul.trigger('click')
    })

    it('can add resizing listener to window', function() {
      var count = 0
      $(window).on('resize', function(e) {
        count++
      })
      $(window).trigger('resize')
      expect(count).to.be(1)
    })
  })
})
