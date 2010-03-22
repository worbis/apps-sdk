/*
 * btapp API simulation
 *
 * To enable developers to develop apps while in the browser of their choice,
 * this simulator copies the btapp API in it's entirety. All methods return
 * valid return data. This data is picked up from replay files. There are a
 * couple replay files included. Alternatively, take a look at the replay file
 * documentation for how to write your own set of data to replay.
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 */

/* XXX - Dependencies
 * underscore.js
 */

var btapp = new btapp.fn.init();

btapp.fn = btapp.prototype = {
  init: function() {
    return this;
  },
  _response: function(json_obj) {
    return _({ build: 1337 }).extend(json_obj);
  },
  _error_constructor: function(name, descr) {
    var err = new Error(descr);
    err.name = name;
    return err;
  },
  getSettings: function() {
    /*
     * Get the client's current settings.
     *
     * To use this method in the simulator, you must include the _settings
     * object in btapp. There is a sample that can be used in
     * simulator/fixtures/settings.js
     */
    return this._response({ settings: this._settings });
  },
  _settings_value_index: 2,
  setSettings: function(settings) {
    /*
     * Set the client's current settings. This takes an object of { k: v } and
     * sets the k setting to the v value.
     *
     * To use this method in the simulator, you must include the _settings
     * object in btapp. There is a sample that can be used in
     * simulator/fixtures/settings.js
     */
    var self = this;
    _(settings).each(function(v, k) {
      var i = _(self._settings).pluck(0).indexOf(k);
      if (i == -1)
        throw self._error_constructor(
          'Invalid Setting',
          'The requested setting "'+k+'" cannot be set.');
      self._settings[i][self._settings_value_index] = v;
    });
    return self._response({});
  },
  list: function() {
    return this._response({
      label: this._label,
      torrents: this._torrents,
      rssfeeds: this._rssfeeds,
      rssfilters: this._rssfilters
    });
  },
  torrent: {
    start: function(hash, force) {
      return {}
    },
    stop: function(hash) {
      return {}
    },
    pause: function(hash) {
      return {}
    },
    unpause: function(hash) {
      return {}
    },
    recheck: function(hash) {
      return {}
    },
    remove: function(hash, options) {
      return {}
    },
    setPriority: function(hash, file_index, priority) {
      return {}
    },
    files: function(hash) {
      return {}
    },
    properties: function(hash) {
      return {}
    },
    setProperties: function(hash, properties) {
      return {}
    }
  },
  addUrl: function(url, download_dir, sub_path) {
    return {}
  },
  addFile: function(file, download_dir, sub_path) {
    return {}
  },
  listDirs: function() {
    return {}
  },
  proxy: function(hash, file_index) {
    return {}
  },
  rss: {
    remove: function(feed_id) {
      return {}
    },
    update: function(feed_id, options) {
      /*
       * options = { url: str, alias: str, subscribe: bool, smart-filter: bool,
       *             enabled: bool, update: 1, download_dir: int,
       *             feed-id: int }
       */
      return {}
    },
    filter: {
      remove: function(filter_id) {
        return {}
      },
      update: function(filter_id, options) {
        /*
         * options = { filter_id: int, name: str, save-in: str, episode: str,
         *             filter: str, not-filter: str, label: str, quality: str,
         *             episode-filter: bool, origname: str, prio: bool,
         *             smart-ep-filter: bool, add-stopped: bool,
         *             postpone-mode: bool, feed-id: int }
         */
        return {}
      }
    }
  },
  events: {
    list: function() {
    },
    // XXX - Should multiple callbacks be bindable to the same event?
    register: function(event, callback) {
    },
    // XXX - If multiple callbacks can be bound to the same event, should this
    // remove all of them at once?
    unregister: function(event) {
    }
  }
}

btapp.fn.init.prototype = btapp.fn;
