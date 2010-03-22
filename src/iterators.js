/*
 * Python like iterators
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 */

// cycle
// next

var iterator = function(iterable) { return new iterator.fn.init(iterable); }

iterator.fn = iterator.prototype = {
  init: function(iterable) {
    this.i = 0;
    this.iterable = iterable;
    if (typeof(StopIteration) != "undefined")
      this.stop_iteration = StopIteration;
    else {
      this.stop_iteration = new Error('StopIteration');
      this.stop_iteration.name = 'StopIteration';
    }
    return this;
  },
  next: function() {
    var self = this;
    if (self.i >= self.iterable.length)
      throw self.stop_iteration;
    return self.iterable[self.i++];
  }
}

iterator.fn.init.prototype = iterator.fn;

// Very simple copy of jquery's extend.
iterator.extend = iterator.fn.extend = function(obj) {
  for (var k in obj)
    this[k] = obj[k];
  return this;
}
