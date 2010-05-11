/*
 * Base of the bt convenience object for creating Griffin applications
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 *
 * Date: %date%
 * Version: %version%
 *
 */

var bt = {
  stash: {
    all: function() {
      var everything = btapp.stash.all();
      _.each(everything, function(v, k) {
        everything[k] = JSON.parse(v);
      });
      return everything;
    },
    keys: function() { return btapp.stash.keys() },
    get: function(k, d) {
      try {
        return JSON.parse(btapp.stash.get(k));
      } catch(err) {
        if (d == null && d !== null)
          throw err;
        return d;
      } },
    set: function(k, v) { btapp.stash.set(k, JSON.stringify(v)); }
  },
  torrent: {
    // Move all properties into the actual object.
    all: function() { return btapp.torrent.all() },
    keys: function() { return btapp.torrent.keys() },
    get: function(key) {
      // Get by hash, name, url
    }
  }
};

(function() {
  // If btapp exists, this is running natively, so don't replace anything.
  if (window.btapp)
    return

  window.btapp = {
    stash: {
      _get_data: function() {
        return _($.jStorage.get('index', [])).chain().map(function(v) {
          return [v, $.jStorage.get(v)];
        }).reduce({}, function(acc, val) {
            acc[val[0]] = val[1]; return acc }).value();
      },
      _set_data: function(key, value) {
        $.jStorage.set('index', $.jStorage.get('index', []).concat([key]));
        $.jStorage.set(key, value);
      },
      all: function() { return btapp.stash._get_data(); },
      keys: function() { return _.keys(btapp.stash.all()) },
      get: function(k) { return btapp.stash.all()[k]; },
      set: function(k, v) { btapp.stash._set_data(k, v); }
    }
  };
})();
