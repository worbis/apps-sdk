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
  },
  settings: function(name, value) {
    /*
     * Access the client's settings.
     *
     * settings() -> dictionary of key/value pairs
     * settings(name) -> get a specific setting
     * settings(name, value) -> set a specific setting
     */
     // peer-id
    return {}           
  },
  /*
   * settings.get / settings.all / settings.set
   */
  torrents: function() {
    /*
     * Get all the current torrents.
     */
    return {}
  },
  torrent: function(hash) {
    return {
      // Parameters of the torrent object:
      hash: 'SHA',
      status: 0,
      name: 'My Torrent',
      size: 100, // bytes
      progress: 0.50, // percentage,
      downloaded: 50, // bytes
      uploaded: 100, // bytes
      ratio: 2.0, // percentage
      upload_speed: 1000, // bytes/second
      download_speed: 1000, // bytes/second
      eta: 10, // seconds
      label: 'test label',
      peers_connected: 10, // peers
      peers_in_swarm: 10, // peers
      seeds_connected: 10, // seeds
      seeds_in_swarm: 10, // seeds
      availability: 0.50, // percentage
      queue_order: 1,
      remaining: 50, // bytes
      download_url: 'http://utorrent.com',
      rss_feed_url: 'rss://rss.utorrent.com',
      // Methods of the torrent object:
      start: function(force) {},
      stop: function() {},
      pause: function() {},
      unpause: function() {},
      recheck: function() {},
      remove: function() {},
      properties: function(name, value) {
        /*
         * Access a specific torrent's properties
         *
         * properties() -> list of all the current properties
         * properties(name) -> get a specific property
         * properties(name, value) -> set a specific property
         */
      },
      // properties.get / properties.set / properties.all
      files: function() {
        /*
         * Get all the torrent's files.
         */
      },
      file: function(index) {
        return {
          torrent: {}, // The parent torrent object.                   
          // Parameters of the torrent object:
          name: 'test',
          size: 100, // bytes
          downloaded: 100, // bytes          
          /*
           * Options of an RSS feed can be set by simply changing the
           * parameter's value.
           */
          priority: 1,
          // Methods of an rss feed:
          get: function() {
            /*
             * Get a file's complete binary data.
             */
          }
        }
      }
    }
  },
  rss_feeds: function() {
    /*
     * Get all the current RSS feeds.
     */
  },
  rss_feed: function(id) {
    return {
      // Parameters of an rss feed:
      ident: 1,
      enabled: true,
      use_feed_title: true,
      user_selected: true,
      programmed: true,
      download_state: 1,
      url: 'rss://rss.utorrent.com',
      next_update: 10, // unix timestamp
      items: function() {
        /*
         * Get all the current rss items.
         */
        return {}
      },
      item: function(name) {
        return {
          rss_feed: {}, // The parent rss_Feed object.
          name: 'test',
          name_full: 'test foo bar',
          url: 'http://utorrent.com',
          quality: 1,
          codec: 1,
          timestamp: 1, // unix timestamp
          season: 1,
          episode: 1,
          episode_to: 1,
          repack: false,
          in_history: false
        }
      },
      /*
       * Options of an RSS feed can be set by simply changing the parameter's
       * value.
       */
      alias: 'test feed',
      subscribe: true,
      smart_filter: true,
      enabled: true,
      // Methods of an rss feed:
      remove: function() {},
      force_update: function() {}
    }
  },
  rss_filters: function() {
    /*
     * Get all the current RSS filters.
     */
  },
  rss_filter: function(id) {
    return {
      // Parameters of an rss filter:
      ident: 1,
      flags: 1,
      directory: 'test',
      last_match: 10,
      repack_ep_filter: 2,
      resolving_candidate: false
      /*
       * Options of an RSS filter can be set by simply changing the parameter's
       * value.
       */
      name: 'test',
      episode: 'expr',
      episode_filter_str: 'test foo',
      filter: '^.*$',
      not_filter: '^.*$',
      label: 'test filter',
      quality: 10, // bytes
      episode_filter: true,
      original_name: 'test2',
      priority: 1,
      smart_ep_filter: 1,
      add_stopped: true,
      postpone_mode: false,
      feed: 1,      
      // Methods of an rss filter:
      remove: function() {}
    }
  },
  events: function(name, callback) {
    /*
     * Access the available events for this client.
     *
     * events() -> full dictionary of all possible events with values for the 
     *             bound ones.
     * events(name) -> get a specific event.
     * events(name, callback) -> register a callback for a specific event.
     */
  },
  // events.get / events.set / events.all 
  store: function(name, value) {
    /*
     * Access the application's data store.
     *
     * store() -> object containing all the name/value pairs in the store.
     * store(name) -> get a specific stored value.
     * store(name, value) -> set a specific store value.
     */
  }
  // store.get / store.set / store.all
  peers: function() {
  },
  peer: function(id) {
    return {
      id: 'foobar',
      send: function(payload) {
      },
      recv: function(callback) {
      }
    }
  }
}

btapp.fn.init.prototype = btapp.fn;


// btapp.fn = btapp.prototype = {
//   init: function() {
//     return this;
//   },
//   _response: function(json_obj) {
//     return _({ build: 1337 }).extend(json_obj);
//   },
//   _error_constructor: function(name, descr) {
//     var err = new Error(descr);
//     err.name = name;
//     return err;
//   },
//   getSettings: function() {
//     /*
//      * Get the client's current settings.
//      *
//      * To use this method in the simulator, you must include the _settings
//      * object in btapp. There is a sample that can be used in
//      * simulator/fixtures/settings.js
//      */
//     return this._response({ settings: this._settings });
//   },
//   _settings_value_index: 2,
//   setSettings: function(settings) {
//     /*
//      * Set the client's current settings. This takes an object of { k: v } and
//      * sets the k setting to the v value.
//      *
//      * To use this method in the simulator, you must include the _settings
//      * object in btapp. There is a sample that can be used in
//      * simulator/fixtures/settings.js
//      */
//     var self = this;
//     _(settings).each(function(v, k) {
//       var i = _(self._settings).pluck(0).indexOf(k);
//       if (i == -1)
//         throw self._error_constructor(
//           'Invalid Setting',
//           'The requested setting "'+k+'" cannot be set.');
//       self._settings[i][self._settings_value_index] = v;
//     });
//     return self._response({});
//   },
//   list: function() {
//     return this._response({
//       label: this._label,
//       torrents: this._torrents,
//       rssfeeds: this._rssfeeds,
//       rssfilters: this._rssfilters
//     });
//   },
//   torrent: {
//     // This is idiotic but I have no better idea of what to do.
//     _struct: {
//       'hash': 0,
//       'status': 1,
//       'name': 2,
//       'size': 3,
//       'percent_progress': 4,
//       'downloaded': 5,
//       'uploaded': 6,
//       'ratio': 7,
//       'upload_speed': 8,
//       'download_speed': 9,
//       'eta': 10,
//       'label': 11,
//       'peers_connected': 12,
//       'peers_in_swarm': 13,
//       'seeds_connected': 14,
//       'seeds_in_swarm': 15,
//       'availability': 16,
//       'torrent_queue_order': 17,
//       'remaining': 18,
//       'download_url': 19,
//       'rss_feed_url': 20
//     }
//     _status: {
//       started: 1,
//       checking: 2,
//       start_after_check: 4,
//       checked: 8,
//       error: 16,
//       paused: 32,
//       queued: 64,
//       loaded: 128
//     },
//     _torrent_index: function(hash) {
//       var self = this;
//       var i = _(self._torrents).pluck(0).indexOf(hash);
//       if (i == -1)
//         throw self._error_constructor(
//           'Invalid Torrent',
//           'There is no torrent with the hash "'+hash+'"');
//       return i;
//     },
//     _or: function(i, j) { return i | j },
//     _xor: function(i, j) { return i ^ j },
//     _set_status: function(hash, mods, fn) {
//       var self = this;
//       var i = self._torrent_index(hash);
//       self._torrents[i][this._struct['status']] =
//         fn(self._torrents[i][this._struct['status']], mods);
//     },
//     start: function(hash, force) {
//       this._set_status(hash, this._status.started + this._status.queued,
//                        this._or);
//       return this._response({});
//     },
//     stop: function(hash) {
//       this._set_status(hash, this._status.started + this._status.queued,
//                        this._xor);
//       return this._response({});
//     },
//     pause: function(hash) {
//       this._set_status(hash, this._status.paused, this._or);
//       return this._response({});
//     },
//     unpause: function(hash) {
//       this._set_status(hash, this._status.paused, this._xor);
//       return this._response({});
//     },
//     recheck: function(hash) {
//       this._set_status(hash, this._status.checking, this._or);
//       this._set_status(hash, this._status.checked, this._xor);
//       return this._response({});
//     },
//     remove: function(hash, options) {
//       /*
//        *
//        *
//        * options - { XXX }
//        */
//       var i = this._torrent_index(hash);
//       this._torrents.splice(i, 1);
//       return this._response({});
//     },
//     setPriority: function(hash, file_index, priority) {
//       return {}
//     },
//     files: function(hash) {
//       return {}
//     },
//     properties: function(hash) {
//       return {}
//     },
//     setProperties: function(hash, properties) {
//       return {}
//     }
//   },
//   addUrl: function(url, download_dir, sub_path) {
//     return {}
//   },
//   addFile: function(file, download_dir, sub_path) {
//     return {}
//   },
//   listDirs: function() {
//     return {}
//   },
//   proxy: function(hash, file_index) {
//     return {}
//   },
//   rss: {
//     remove: function(feed_id) {
//       return {}
//     },
//     update: function(feed_id, options) {
//       /*
//        * options = { url: str, alias: str, subscribe: bool, smart-filter: bool,
//        *             enabled: bool, update: 1, download_dir: int,
//        *             feed-id: int }
//        */
//       return {}
//     },
//     filter: {
//       remove: function(filter_id) {
//         return {}
//       },
//       update: function(filter_id, options) {
//         /*
//          * options = { filter_id: int, name: str, save-in: str, episode: str,
//          *             filter: str, not-filter: str, label: str, quality: str,
//          *             episode-filter: bool, origname: str, prio: bool,
//          *             smart-ep-filter: bool, add-stopped: bool,
//          *             postpone-mode: bool, feed-id: int }
//          */
//         return {}
//       }
//     }
//   },
//   events: {
//     list: function() {
//     },
//     // XXX - Should multiple callbacks be bindable to the same event?
//     register: function(event, callback) {
//     },
//     // XXX - If multiple callbacks can be bound to the same event, should this
//     // remove all of them at once?
//     unregister: function(event) {
//     }
//   }
// }
