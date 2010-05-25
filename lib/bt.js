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
  _objs: {},
  add: {
    torrent: function(url, cb) {
      if (cb)
        bt._handlers._torrents[url] = cb;
      return btapp.add.torrent(url);
    }
  },
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
  events: {
    all: function() { return btapp.events.all(); },
    keys: function() { return btapp.events.keys(); },
    get: function(k) { return btapp.events.get(k); },
    set: function(k, v) { return btapp.events.set(k, v); }
  },
  torrent: {
    // Move all properties into the actual object.
    all: function() { return btapp.torrent.all() },
    keys: function() { return btapp.torrent.keys() },
    get: function(key) {
      // Get by download url or hash
      if (key.match(/http(|s)/)) {
        var matches = _(bt.torrent.all()).chain().values().filter(function(v) {
          return v.properties.get('download_url') == key;
        }).value();
        if (matches.length > 0)
          return matches[0];
      }
      return btapp.torrent.get(key);
    }
  },
  _handlers: {
    _torrents: { },
    torrent: function(resp) {
      if (resp.url in bt._handlers._torrents)
        bt._handlers._torrents[resp.url](resp);
    }
  }
};

(function() {
  // If btapp exists, this is running natively, so don't replace anything.
  if (!window.btapp) {
    window.btapp = {
      _torrents: { },
      add: {
        _delay: 1000,
        torrent: function(url) {
          var tor = new bt._objs.Torrent(url);
          var added = function() {
            window.btapp._torrents[tor.hash] = tor;
            btapp.events._registered.torrent(
              { url: url,
                status: 200,
                message: 'success' });
          }
          if ('torrent' in btapp.events._registered)
            setTimeout(added, btapp.add._delay);
        }
      },
      events: {
        _registered: { },
        all: function() { return btapp.events._registered },
        keys: function() { return _.keys(btapp.events._registered); },
        get: function(k) { return btapp.events._registered[k]; },
        set: function(k, v) { btapp.events._registered[k] = v; }
      },
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
      },
      torrent: {
        // Move all properties into the actual object.
        all: function() { return btapp._torrents; },
        keys: function() { return _.keys(btapp._torrents) },
        get: function(k) { return btapp._torrents[k]; }
      }
    };
  }
  // Setup the event handler for torrents that allows passing callbacks in to
  // monitor state.
  bt.events.set('torrent', bt._handlers.torrent);

  $(document).ready(function() {
    // Take html/index.html and set the entire content to the body.
    $.ajax({
      url: '/html/index.html',
      success: function(v) { $("body").html(v); },
      async: false
    });
  });
})();

