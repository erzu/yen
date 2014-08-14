
var $ = require('@ali/yen')

require('@ali/yen/support')


describe('yen/support', function() {
  it('detects support of perspective', function() {
    expect($.support.perspective).not.to.be(null)
  })
})
