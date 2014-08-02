
var $ = require('@ali/yen')
var Events = require('@ali/yen/events')
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
  })
})
