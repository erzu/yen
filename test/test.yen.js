'use strict'

var $ = require('yen')
var expect = require('expect.js')
var heredoc = require('heredoc').strip


describe('yen', function() {

  describe('dimension', function() {
    before(function(done) {
      $('#fixture').html(heredoc(function() {/*
        <div class="rect"></div>
        <div class="rect-hidden" style="display:none">
          <div style="width:20px"></div>
        </div>
        <div class="rect-border-box"></div>
        <img src="https://img.alicdn.com/tps/TB1vy9CLVXXXXcvXFXXXXXXXXXX-120-60.png" alt="test image" class="img">
        <img src="https://img.alicdn.com/tps/TB1vy9CLVXXXXcvXFXXXXXXXXXX-120-60.png" alt="test image" class="img-hidden" style="display:none">
      */}))

      $('#fixture .rect-border-box').css('box-sizing', 'border-box')

      $('#fixture > div').css({
        width: '100px',
        height: '50px',
        padding: '10px 20px',
        border: '5px solid #000',
        margin: '10px 5px'
      })

      $('#fixture').show()
      $('#fixture img').on('load', function() {
        done()
      })
    })

    after(function() {
      $('#fixture').hide()
    })

    it('.height', function() {
      expect($('#fixture .rect').height()).to.equal(50)
      expect($('#fixture .rect-hidden').height()).to.equal(50)
      if ($.support.boxSizing) {
        expect($('#fixture .rect-border-box').height()).to.equal(20)
      }
      expect($('#fixture .img').height()).to.equal(60)
      expect($('#fixture .img-hidden').height()).to.equal(60)
      expect($().height()).to.be(null)
    })

    it('.innerHeight', function() {
      expect($('#fixture .rect').innerHeight()).to.equal(70)
      expect($('#fixture .rect-hidden').innerHeight()).to.equal(70)
      if ($.support.boxSizing) {
        expect($('#fixture .rect-border-box').innerHeight()).to.equal(40)
      }
      expect($('#fixture .img').innerHeight()).to.equal(60)
      expect($('#fixture .img-hidden').innerHeight()).to.equal(60)
      expect($().innerHeight()).to.be(null)
    })

    it('.innerWidth', function() {
      expect($('#fixture .rect').innerWidth()).to.equal(140)
      expect($('#fixture .rect-hidden').innerWidth()).to.equal(140)
      if ($.support.boxSizing) {
        expect($('#fixture .rect-border-box').innerWidth()).to.equal(90)
      }
      expect($('#fixture .img').innerWidth()).to.equal(120)
      expect($('#fixture .img-hidden').innerWidth()).to.equal(120)
      expect($().innerWidth()).to.be(null)
    })

    it('.offset', function() {
      expect($().offset()).to.be(undefined)

      var offset = $('#fixture .rect').offset()
      expect(offset.left).to.be.a('number')
      expect(offset.top).to.be.a('number')
    })

    it('.outerHeight', function() {
      expect($('#fixture .rect').outerHeight()).to.equal(80)
      expect($('#fixture .rect').outerHeight(true)).to.equal(100)
      expect($('#fixture .rect-hidden').outerHeight()).to.equal(80)
      expect($('#fixture .rect-hidden').outerHeight(true)).to.equal(100)
      if ($.support.boxSizing) {
        expect($('#fixture .rect-border-box').outerHeight()).to.equal(50)
      }
      expect($('#fixture .img').outerHeight()).to.equal(60)
      expect($('#fixture .img').outerHeight(true)).to.equal(60)
      expect($('#fixture .img-hidden').outerHeight()).to.equal(60)
      expect($('#fixture .img-hidden').outerHeight(true)).to.equal(60)
      expect($().outerHeight()).to.be(null)
    })

    it('.outerWidth', function() {
      expect($('#fixture .rect').outerWidth()).to.equal(150)
      expect($('#fixture .rect').outerWidth(true)).to.equal(160)
      expect($('#fixture .rect-hidden').outerWidth()).to.equal(150)
      expect($('#fixture .rect-hidden').outerWidth(true)).to.equal(160)
      if ($.support.boxSizing) {
        expect($('#fixture .rect-border-box').outerWidth()).to.equal(100)
      }
      expect($('#fixture .img').outerWidth()).to.equal(120)
      expect($('#fixture .img').outerWidth(true)).to.equal(120)
      expect($('#fixture .img-hidden').outerHeight()).to.equal(60)
      expect($('#fixture .img-hidden').outerHeight(true)).to.equal(60)

      expect($().outerWidth()).to.be(null)
    })

    it('.width', function() {
      expect($('#fixture .rect').width()).to.equal(100)
      expect($('#fixture .rect-hidden').width()).to.equal(100)
      expect($('#fixture .rect-hidden div').width()).to.equal(20)
      if ($.support.boxSizing) {
        expect($('#fixture .rect-border-box').width()).to.equal(50)
      }
      expect($('#fixture .img').width()).to.equal(120)
      expect($('#fixture .img-hidden').width()).to.equal(120)
      expect($().width()).to.be(null)
    })
  })

  describe('manipulation', function() {
    before(function() {
      $('#fixture').html(heredoc(function() {/*
        <ul>
          <li class="entry"></li>
          <li class="entry"></li>
          <li class="entry entry-current"></li>
          <li class="entry"></li>
          <li class="entry entry-last"></li>
        </ul>
        <div class="fixture-attr" data-foo="Foo" data-bar></div>
        <div class="fixture-html">Hello yen</div>
        <div class="fixture-css" style="width: 100px; padding-top: 20px; padding-bottom: 20px; margin-left: 20px;"></div>
        <div class="fixture-append"></div>
        <div class="fixture-prepend"></div>
        <div class="fixture-empty">
          <ul>
            <li></li>
          </ul>
          <select id="" name="">
            <options value="1">1</options>
            <options value="2">2</options>
            <options value="3">3</options>
          </select>
        </div>
        <style>.fixture-css { padding: 10px; margin: 10px; }</style>
      */}))
    })

    it('.hasClass', function() {
      expect($('.entry').last().hasClass('entry-last')).to.be(true)
      expect($('.entry').hasClass('entry-last')).to.be(false)
      expect($().hasClass('foo')).to.be(false)
    })

    it('.addClass', function() {
      $('.entry-last').addClass('hidden')
      expect($('.entry-last').hasClass('hidden')).to.be(true)
    })

    it('.removeClass', function() {
      $('.entry-last').removeClass('hidden')
      expect($('.entry-last').hasClass('hidden')).to.be(false)
    })

    it('.toggleClass', function() {
      $('.entry').toggleClass('entry-current')
      expect($('.entry-current').length).to.be(4)
    })

    it('.attr', function() {
      var el = $('.fixture-attr')
      expect(el.attr('data-foo')).to.equal('Foo')
      expect(el.attr('data-foo', 'egg').attr('data-foo')).to.equal('egg')

      el = $('vaporware')
      expect(el.attr('foo')).to.equal(undefined)
    })

    it('.hasAttr', function() {
      var el = $('.fixture-attr')
      expect(el.hasAttr('data-foo')).to.be(true)
      expect(el.hasAttr('data-bar')).to.be(true)
      expect(el.hasAttr('data-missing')).to.be(false)
    })

    it('.html', function() {
      var el = $('.fixture-html')
      expect(el.html()).to.equal('Hello yen')
      expect(el.html('Konijiwa yen').html()).to.equal('Konijiwa yen')

      expect($('vaporware').html()).to.equal(undefined)

      expect(el.html(function(index, oldhtml) {
        return oldhtml.replace('yen', '￥')
      }).html()).to.equal('Konijiwa ￥')
    })

    it('.css', function() {
      var el = $('.fixture-css')

      // The return value of window.computedStyle in Firefox & Safari 5
      // does not support shorthand property.
      //
      // expect(el.css('margin')).to.equal('10px 10px 10px 20px')
      // expect(el.css('padding')).to.equal('20px 10px')
      expect(el.css('padding-top')).to.equal('20px')
      expect(el.css('paddingBottom')).to.equal('20px')
    })

    it('.append [string]', function() {
      var el = $('.fixture-append')

      el.append('Test append-string')
      expect(el.html()).to.equal('Test append-string')
    })

    it('.append [dom]', function() {
      var el = $('.fixture-append')
      var div = document.createElement('div')

      $(div).html('Test append-dom')
      el.append(div)
      expect(el.children().html()).to.equal('Test append-dom')
    })

    it('.prepend [string]', function() {
      var el = $('.fixture-prepend')

      el.prepend('Test prepend-string')
      expect(el.html()).to.equal('Test prepend-string')
    })

    it('.prepend [dom]', function() {
      var el = $('.fixture-prepend')
      var div = document.createElement('div')

      $(div).html('Test prepend-dom')
      el.prepend(div)
      expect($(el.children()[0]).html()).to.equal('Test prepend-dom')
    })

    it('.empty', function(){
      var el = $('.fixture-empty')
      el.empty()
      expect(el.html()).to.equal('')
    })
  })


  describe('selectors', function() {
    before(function() {
      $('#fixture').html(heredoc(function() {/*
        <ul id="ul" class="ul">
          <li class="entry"></li>
          <li class="entry"></li>
          <li class="entry entry-current">
            <a class="a" id="a"></a>
          </li>
          <li class="entry" attr></li>
          <li empty_attr attr=value class="entry entry-last">
            <a id="e" class="b f" c="d" g></a>
          </li>
        </ul>
      */}))
    })

    it('can getElementById', function() {
      expect($('#mocha').length).to.be(1)
    })

    it('can getElementsByTagName', function() {
      expect($('div').length).to.be.above(0)
    })

    it('can getElementsByClassName', function() {
      expect($('.entry').length).to.be(5)
      expect($('.entry-current').length).to.be(1)
    })

    it('can query descendant selector', function() {
      expect($('ul .entry').length).to.be(5)
      expect($('#ul .entry-current').length).to.be(1)
      expect($('#ul .a').length).to.be(1)
      expect($('body #ul .a', $('#ul')[0]).length).to.be(1)
      expect($('body #ul .entry-current #a').length).to.be(1)
      expect($('html #ul [class="entry"]').length).to.be(3)
      expect($('html #ul [empty_attr]').length).to.be(1)
      expect($('html #ul [attr]').length).to.be(2)
      expect($('html #ul [attr=""]').length).to.be(1)
    })

    it('can query combine selector', function() {
      expect($('ul a.b[c=d]#e.f[g]').length).to.be(1)
    })

    it('can query child selector', function() {
      expect($('ul>li', $('#ul')[0]).length).to.be(5)
      expect($('ul > li > a', $('#ul')[0]).length).to.be(2)
    })

    it('can query pseudo-class selector', function() {
      expect($('ul li:first-child', $('#ul')[0]).length).to.be(1)
      expect($('ul :first-child', $('#ul')[0]).length).to.be(3)
    })

    it('can query comma-separated selector', function() {
      expect($('ul,li,#e', $('#ul')[0]).length).to.be(6)
    })

    it('can select <object> in firefox', function() {
      $('#fixture').html(heredoc(function() {/*
        <object></object>
      */}))

      expect($('object').length).to.be(1)
      expect($(document.getElementsByTagName('object')[0]).length).to.be(1)
    })
  })


  describe('traversing', function() {
    before(function() {
      $('#fixture').html(heredoc(function() {/*
        <ol>
          <li class="foo"></li>
          <li class="bar"></li>
          <li class="ham"></li>
        </ol>
        <ol>
          <li></li>
          <li></li>
        </ol>
      */}))
    })

    it('.children', function() {
      expect($('#fixture').find('ol:first-child').children().length).to.be(3)
      expect($('#fixture').find('ol').children().length).to.be(5)
    })

    it('.parent', function() {
      var el = $('#fixture .bar')
      expect(el.parent().is('ol')).to.be(true)
      expect(el.parent('#fixture').length).to.be(0)

      // find all parents of elements within matched set.
      expect($('#fixture li').parent().length).to.be(2)
      expect($('#fixture li').parent('ol:first-child').length).to.be(1)

      // return empty set if there's no parentNode.
      expect($(document).parent()).to.be.a($)
      expect($(document).parent().length).to.be(0)

      expect($('html').parent().is(document)).to.be(true)
    })

    it('.parents', function() {
      var el = $('#fixture .bar')
      expect(el.parents('#fixture').length).to.be(1)
      expect(el.parents().length).to.be.greaterThan(1)

      expect($(document).parents().length).to.be(0)
      expect($('html').parents().length).to.be(0)

      // ol -> #fixture -> body -> html
      // and there are two ol elements. Hence the total is 5.
      expect($('#fixture li').parents().length).to.be(5)
    })

    it('.closest', function() {
      expect($('#fixture .bar').closest('li').length).to.be(1)
      expect($('#fixture .bar, #fixture .foo').closest('li').length).to.be(2)
      expect($('#fixture li').closest('li').length).to.be(5)
      expect($('#fixture li').closest('*').length).to.be(5)

      // http://api.jquery.com/closest/ won't yield an error if selector param
      // is missing. Let's just stick with jQuery.
      expect($(document).closest().length).to.be(0)

      // Should traverse up to document
      expect($('html').closest(document).length).to.be(1)
    })

    it('.filter', function() {
      expect($('#fixture li').filter('.foo, .bar').length).to.be(2)
      expect($('#fixture li').filter('ol').length).to.be(0)

      expect($(document).filter().length).to.be(0)
    })

    it('.first', function() {
      var child = $('#fixture').find('ol').children().first()
      expect(child.hasClass('foo')).to.be(true)
    })

    it('.last', function() {
      var child = $('#fixture').find('ol:first-child').children().last()
      expect(child.hasClass('ham')).to.be(true)
    })

    it('.get', function() {
      var child = $('#fixture').find('ol').children().get(1)
      expect(child.hasClass('bar')).to.be(true)
    })

    it('.find', function() {
      expect($('#fixture ul').find('li').length).to.be(0)
      expect($('#fixture ol').find('li').length).to.be(5)

      // make sure there's no duplication in matched set
      expect($('#fixture').find('.egg,li').length).to.be(5)
    })

    it('.next', function() {
      expect($('#fixture .egg').next().length).to.be(0)
      expect($('#fixture .foo').next().hasClass('bar')).to.be(true)
      expect($('#fixture li:first-child').next().length).to.be(2)
    })

    it('.prev', function() {
      expect($('#fixture .foo').prev().length).to.be(0)
      expect($('#fixture .bar').prev().hasClass('foo')).to.be(true)
      // IE8 does has got `document.querySelectorAll` but will yield error on
      // `document.querySelectorAll('#fixture li:last-child')`.
      expect($('#fixture').find('li:last-child').prev().length).to.be(2)
    })
  })


  describe('utilities', function() {
    it('.each', function() {
      $([0, 1, 2, 3]).each(function(item, i) {
        expect(item).to.equal(i)
      })
    })

    it('.map', function() {
      expect($([0, 1, 2, 3]).map(function(item) { return item + 1 }))
        .to.eql([1, 2, 3, 4])
      expect($('script').map(function(el) { return el.tagName }).join(''))
        .to.match(/^(?:script)+$/i)
    })

    it('.is', function() {
      expect($(document).is(document)).to.be(true)
      expect($('body').is('body,div')).to.be(true)
      expect($('body').is(':last-child')).to.be(true)
      expect($('body').is('div')).to.be(false)
      expect($('script,div').is('div')).to.be(true)

      var body = document.getElementsByTagName('body')[0]
      expect($(document).is(document)).to.be(true)
      expect($(body).is([document, body])).to.be(true)
      expect($('#fixture').is(document.getElementsByTagName('div'))).to.be(true)

      expect($('body,script,head').is(function(el) {
        return el === body
      })).to.be(true)

      expect($('body').is(function(el) {
        return el === document
      })).to.be(false)
    })

    it('can createElement', function() {
      expect($('<div>').length).to.be(1)
      expect($('<table>')[0].tagName.toLowerCase()).to.be('table')
    })
  })

  describe('miscellaneous', function() {
    it('.data', function() {
      var el = $('#fixture').html(heredoc(function() {/*
        <div data-bar="g+" data-baz="true"></div>
      */}))
        .find('div:first-child')

      // shall behave like el.dataset.foo.
      expect(el.data('foo')).to.be(undefined)

      expect(el.data('bar')).to.be('g+')
      expect(el.data('baz')).to.be(true)

      // shall return the selection itself when setting data.
      expect(el.data('foo', true)).to.be(el)
      expect(el.data('foo')).to.be(true)

      expect(el.data('qux', 'true story').data('qux')).to.equal('true story')

      expect(el.data('foo-bar')).to.be(undefined)

      el.data('foo-bar', { foo: { bar: 1 } })
      expect(el.data('foo-bar').foo.bar).to.be(1)

      el.data('foo-bar', { foo: [1, 2, 3] })
      expect(el.data('foo-bar').foo).to.eql([1, 2, 3])

      el.data({ foo: false, bar: 'great' })
      expect(el.data('foo')).to.equal(false)
      expect(el.data('bar')).to.equal('great')

      // shall not return the selection itself when getting data value of an
      // empty selection. #8
      expect($().data('foo')).to.be(undefined)
    })
  })

  describe('constructor', function() {
    it('accept document', function() {
      expect($(document).length).to.be(1)
    })

    it('accept window', function() {
      expect($(window).length).to.be(1)
    })

    it('accept []', function() {
      expect($([]).length).to.be(0)
      expect($([1, 2, 3]).length).to.be(3)
    })

    it('accept yen instance', function() {
      var a = $(document)
      expect($(a)[0]).to.equal(document)
      expect($(a)).to.not.equal(a)    // should return a clone
    })

    it('accept HTMLCollection', function() {
      var collection = document.getElementsByTagName('script')

      expect($(collection).length).to.equal(collection.length)
      if (document.scripts) {
        expect($(document.scripts).length).to.equal(collection.length)
      }
    })

    it('accept NodeList', function() {
      if (document.querySelectorAll) {
        var collection = document.querySelectorAll('script')
        expect($(collection).length).to.equal(collection.length)
      }
    })
  })

  describe('iframe', function() {
    var contentDocument

    before(function() {
      $('#fixture').html(heredoc(function() {/*
        <div id="division" class="outer">
          <h1 id="title" class="title"></h1>
        </div>
        <iframe id="aFrame"></iframe>
      */}))

      contentDocument = document.getElementById('aFrame').contentDocument ||
        document.getElementById('aFrame').contentWindow.document

      contentDocument.write(heredoc(function() {/*
        <html>
          <body>
            <div id="division" class="inner">
              <h2 id="title" class="title"></h2>
            </div>
          </body>
        </html>
      */}))
      contentDocument.close()
    })

    it('can select iFrame window', function() {
      var win = document.getElementById('aFrame').contentWindow
      expect($(win).length).to.be(1)
    })

    it('can select by context', function() {
      expect($('#title', contentDocument)[0].nodeName.toLowerCase()).to.be('h2')
      expect($('.title', contentDocument)[0].nodeName.toLowerCase()).to.be('h2')
    })

    it('will check context ownerDocument when select by id', function() {
      var outer = $('.outer')
      var inner = $('.inner', contentDocument)

      expect($('#title', outer).length).to.be(1)
      expect($('#title', inner).length).to.be(1)
      expect($('#title', outer)[0].nodeName.toLowerCase()).to.be('h1')
      expect($('#title', inner)[0].nodeName.toLowerCase()).to.be('h2')
    })

    it('can construct with elements within iframe', function() {
      var el = $('#title', contentDocument)[0]

      expect($(el).context).to.equal(el)
      expect($(el).closest('div').is('.inner')).to.be(true)

      var els = $(contentDocument.getElementsByTagName('div'))
      expect(els.length).to.equal(1)
      expect(els.context).to.equal(els)
    })
  })
})
