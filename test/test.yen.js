'use strict';

var $ = require('yen')
var heredoc = require('heredoc').strip


describe('yen', function() {

  describe('dimension', function() {
    before(function() {
      $('#fixture').css({
        width: '100px',
        height: '50px',
        padding: '10px 20px',
        border: '5px solid #000',
        margin: '10px 5px'
      })
    })

    it('.height', function() {
      expect($('#fixture').height()).to.equal(50)
    })

    it('.innerHeight', function() {
      expect($('#fixture').innerHeight()).to.equal(70)
    })

    it('.innerWidth', function() {
      expect($('#fixture').innerWidth()).to.equal(140)
    })

    it('.outerHeight', function() {
      expect($('#fixture').outerHeight()).to.equal(80)
      expect($('#fixture').outerHeight(true)).to.equal(100)
    })

    it('.outerWidth', function() {
      expect($('#fixture').outerWidth()).to.equal(150)
      expect($('#fixture').outerWidth(true)).to.equal(160)
    })

    it('.width', function() {
      expect($('#fixture').width()).to.equal(100)
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
        <style>.fixture-css { padding: 10px; margin: 10px; }</style>
      */}))
    })

    it('.hasClass', function() {
      expect($('.entry').last().hasClass('entry-last')).to.be(true)
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

    it('can descendant selector', function() {
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

    it('can combine selector', function() {
      expect($('ul a.b[c=d]#e.f[g]').length).to.be(1)
    })

    it('can child selector', function() {
      expect($('ul>li', $('#ul')[0]).length).to.be(5)
      expect($('ul > li > a', $('#ul')[0]).length).to.be(2)
    })

    it('can pseudo-class selector', function() {
      expect($('ul li:first-child', $('#ul')[0]).length).to.be(1)
      expect($('ul :first-child', $('#ul')[0]).length).to.be(3)
    })

    it('can comma-separated selector', function() {
      expect($('ul,li,#e', $('#ul')[0]).length).to.be(6)
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
      expect(el.parent()[0].tagName.toLowerCase()).to.be('ol')
      expect(el.parent('#fixture').length).to.be(1)
      expect(el.parent('#fixture').attr('id')).to.be('fixture')

      // find all parents of elements within matched set.
      expect($('#fixture li').parent().length).to.be(2)
      expect($('#fixture li').parent('ol:first-child').length).to.be(1)

      // return empty set if there's no parentNode.
      expect($(document).parent()).to.be.a($)
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
    })

    it('.prev', function() {
      expect($('#fixture .foo').prev().length).to.be(0)
      expect($('#fixture .bar').prev().hasClass('foo')).to.be(true)
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
    })

    it('can createElement', function() {
      expect($('<div>').length).to.be(1)
      expect($('<table>')[0].tagName.toLowerCase()).to.be('table')
    })
  })

  describe('miscellaneous', function() {
    it('can select <object> in firefox', function() {
      $('#fixture').html(heredoc(function() {/*
        <object></object>
      */}))

      expect($('object').length).to.be(1)
      expect($(document.getElementsByTagName('object')[0]).length).to.be(1)
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
      expect($($(document))[0]).to.equal(document)
    })
  })

  describe('iframe', function() {
    before(function() {
      $('#fixture').html(heredoc(function() {/*
        <div id="division" class="outer">
          <h1 id="title" class="title"></h1>
        </div>
        <iframe id="aFrame"></iframe>
      */}))
      var iDoc = document.getElementById('aFrame').contentDocument || document.getElementById('aFrame').contentWindow.document
      iDoc.write(heredoc(function() {/*
        <html>
          <body>
            <div id="division" class="inner">
              <h2 id="title" class="title"></h2>
            </div>
          </body>
        </html>
      */})
      )
    })

    it('can select iFrame window', function() {
      var win = document.getElementById('aFrame').contentWindow
      expect($(win).length).to.be(1)
    })

    it('can select by context', function() {
      var iDoc = document.getElementById('aFrame').contentDocument || document.getElementById('aFrame').contentWindow.document
      expect($('#title', iDoc)[0].nodeName.toLowerCase()).to.be('h2')
      expect($('.title', iDoc)[0].nodeName.toLowerCase()).to.be('h2')
    })

    it('will check context ownerDocument when select by id', function() {
      var iDoc = document.getElementById('aFrame').contentDocument || document.getElementById('aFrame').contentWindow.document
      var outer = $('.outer')
      var inner = $('.inner', iDoc)

      expect($('#title', outer).length).to.be(1)
      expect($('#title', inner).length).to.be(1)
      expect($('#title', outer)[0].nodeName.toLowerCase()).to.be('h1')
      expect($('#title', inner)[0].nodeName.toLowerCase()).to.be('h2')
    })
  })
})
