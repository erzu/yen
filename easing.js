'use strict';

var easing = {}


/*
 * Linear
 */
easing.linear = function(pos) {
  return pos
}

/*
 * Just ease
 */
easing.easeInOut = function(pos) {
  if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4)
  return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2)
}

easing.easeIn = function(pos) {
  return Math.pow(pos,4)
}

easing.easeOut = function(pos) {
  return Math.pow(pos,0.25)
}

/*
 * Quad
 */
easing.easeInQuad = function(pos) {
  return Math.pow(pos, 2)
}

easing.easeOutQuad = function(pos) {
  return -(Math.pow((pos-1), 2) -1)
}

easing.easeInOutQuad = function(pos) {
  if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,2)
  return -0.5 * ((pos-=2)*pos - 2)
}

/*
 * Cubic
 */
easing.easeInCubic = function(pos) {
  return Math.pow(pos, 3)
}

easing.easeOutCubic = function(pos) {
  return (Math.pow((pos-1), 3) +1)
}

easing.easeInOutCubic = function(pos) {
  if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3)
  return 0.5 * (Math.pow((pos-2),3) + 2)
}

/*
 * Quart
 */
easing.easeInQuart = function(pos) {
  return Math.pow(pos, 4)
}

easing.easeOutQuart = function(pos) {
  return -(Math.pow((pos-1), 4) -1)
}

easing.easeInOutQuart = function(pos) {
  if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4)
  return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2)
}

/*
 * Quint
 */
easing.easeInQuint = function(pos) {
  return Math.pow(pos, 5)
}

easing.easeOutQuint = function(pos) {
  return (Math.pow((pos-1), 5) +1)
}

easing.easeInOutQuint = function(pos) {
  if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5)
  return 0.5 * (Math.pow((pos-2),5) + 2)
}

/*
 * Sine
 */
easing.easeInSine = function(pos) {
  return -Math.cos(pos * (Math.PI/2)) + 1
}

easing.easeOutSine = function(pos) {
  return Math.sin(pos * (Math.PI/2))
}

easing.easeInOutSine = function(pos) {
  return (-0.5 * (Math.cos(Math.PI*pos) -1))
}

/*
 * Expo
 */
easing.easeInExpo = function(pos) {
  return (pos===0) ? 0 : Math.pow(2, 10 * (pos - 1))
}

easing.easeOutExpo = function(pos) {
  return (pos===1) ? 1 : -Math.pow(2, -10 * pos) + 1
}

easing.easeInOutExpo = function(pos) {
  if(pos===0) return 0
  if(pos===1) return 1
  if((pos/=0.5) < 1) return 0.5 * Math.pow(2,10 * (pos-1))
  return 0.5 * (-Math.pow(2, -10 * --pos) + 2)
}

/*
 * Circ
 */
easing.easeInCirc = function(pos) {
  return -(Math.sqrt(1 - (pos*pos)) - 1)
}

easing.easeOutCirc = function(pos) {
  return Math.sqrt(1 - Math.pow((pos-1), 2))
}

easing.easeInOutCirc = function(pos) {
  if((pos/=0.5) < 1) return -0.5 * (Math.sqrt(1 - pos*pos) - 1)
  return 0.5 * (Math.sqrt(1 - (pos-=2)*pos) + 1)
}

/*
 * Back
 */
easing.easeInBack = function(pos) {
  var s = 1.70158
  return (pos)*pos*((s+1)*pos - s)
}

easing.easeOutBack = function(pos) {
  var s = 1.70158
  return (pos=pos-1)*pos*((s+1)*pos + s) + 1
}

easing.easeInOutBack = function(pos) {
  var s = 1.70158
  if((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos -s))
  return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos +s) +2)
}

/*
 * Bounce
 */
easing.bounceOut = function(p) {
  if (p < 1 / 2.75) {
    return 7.5625 * p * p
  } else if (p < 2 / 2.75) {
    return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75
  } else if (p < 2.5 / 2.75) {
    return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375
  }
  return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375
}
easing.bounceIn = function(p) {
  if ((p = 1 - p) < 1 / 2.75) {
    return 1 - (7.5625 * p * p)
  } else if (p < 2 / 2.75) {
    return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75)
  } else if (p < 2.5 / 2.75) {
    return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375)
  }
  return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375)
}
easing.bounceInOut = function(p) {
  var invert = (p < 0.5)
  if (invert) {
    p = 1 - (p * 2)
  } else {
    p = (p * 2) - 1
  }
  if (p < 1 / 2.75) {
    p = 7.5625 * p * p
  } else if (p < 2 / 2.75) {
    p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75
  } else if (p < 2.5 / 2.75) {
    p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375
  } else {
    p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375
  }
  return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5
}

/*
 * Elastic
 */
easing.elastic = function(pos) {
  return -1 * Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1
}

/*
 * Swing
 */
easing.swingFromTo = function(pos) {
  var s = 1.70158
  return ((pos/=0.5) < 1) ? 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)) :
  0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2)
}

easing.swingFrom = function(pos) {
  var s = 1.70158
  return pos*pos*((s+1)*pos - s)
}

easing.swingTo = function(pos) {
  var s = 1.70158
  return (pos-=1)*pos*((s+1)*pos + s) + 1
}


module.exports = easing
