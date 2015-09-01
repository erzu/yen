'use strict'

mocha.setup('bdd')

require('./test.events')
require('./test.yen')

mocha.run()
