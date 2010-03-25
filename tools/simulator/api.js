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
  init: function() { },
  settings: {
    /*
     * Access the client's settings.  If a property is read only, a
     * ReadOnlyException will be thrown.
     *
     * all() -> dictionary of key/value pairs
     * get(name) -> get a specific setting
     * set(name, value) -> set a specific setting
     * add
     *
     * Note that the API suggests what properties might be returned, but to
     * really know what actually is being returned, it is suggested for the
     * developer to introspect an all() call.
     */
    /*
     * Available properties.
     *
     * peer_id
     */
    /*
     * To implement your own settings simulator, extend btapp.fn with _settings
     * (key/value pairs of settings). For an example, see fixtures/settings.js
     *
     * Note that this implementation assumes all settings are writable.
     */
    all: function() {
      return this._settings;
    },
    get: function(name) { 
      return this._settings[name];
    },
    set: function(name, value) { 
      this._settings[name] = value;
    }
  },
  torrent: {
    /*
     * Get a torrent.
     *
     * all() -> dictionary of hash/object pairs
     * get(hash) -> get a specific torrent
     */
    // XXX - Is there any reason why we'd need to be able to add a file?
    add: function(url) {
      /*
       * Add a torrent by url (or magnet link).
       *
       */
      return { } // torrent_object
    },
    all: function() { },
    get: function(hash) { 
      return {
        hash: 'SHA', // This is meant to be the primary key and is immutable.
        start: function(force) {},
        stop: function() {},
        pause: function() {},
        unpause: function() {},
        recheck: function() {},
        // XXX - Does there need to be a method to say whether
        // data/torrent/torrentdata is removed?
        remove: function() {
          /*
           * Remove a torrent.
           *
           */
        },
        properties: {
          /*
           * Access a specific torrent's properties. If a property is read
           * only, a ReadOnlyException will be thrown.
           *
           * all() -> list of all the current properties
           * get(name) -> get a specific property
           * set(name, value) -> set a specific property
           *
           * Note that the API suggests what properties might be returned, but
           * to really know what actually is being returned, it is suggested
           * for the developer to introspect an all() call.
           */
          /*
           * Available properties.
           *
           * trackers // [ "tracker1", "tracker2" ]
           * upload_limit // bytes/second
           * download_limit // bytes/second
           * superseed // seeding.not_allowed/seeding.disabled/seeding.enabled
           * dht
           * pex
           * seed_override
           * seed_ratio
           * seed_time
           * ulslots
           * status: torrent_states.seeding, // enum
           * name: 'My Torrent',
           * size: 100, // bytes
           * progress: 0.50, // percentage,
           * downloaded: 50, // bytes
           * uploaded: 100, // bytes
           * ratio: 2.0, // percentage
           * upload_speed: 1000, // bytes/second
           * download_speed: 1000, // bytes/second
           * eta: 10, // seconds
           * label: 'test label',
           * peers_connected: 10, // peers
           * peers_in_swarm: 10, // peers
           * seeds_connected: 10, // seeds
           * seeds_in_swarm: 10, // seeds
           * availability: 0.50, // percentage
           * queue_order: 1,
           * remaining: 50, // bytes
           * download_url: 'http://utorrent.com',
           * rss_feed_url: 'rss://rss.utorrent.com',
           */
          all: function() {},
          get: function(name) {},
          set: function(name) {}
        },
        peer: {
          /*
           * Get a peer associated with this torrent.
           *
           * all() -> dictionary of peer_id/object pairs
           * get(id) -> get a specific peer
           */
          all: function() { },
          get: function(id) { 
            return {
              torrent: { },
              id: 'foobar',
              properties: {
                /*
                 * Access a specific peer's properties. If a property is read
                 * only, a ReadOnlyException will be thrown.
                 *
                 * all() -> list of all the current properties
                 * get(name) -> get a specific property
                 * set(name, value) -> set a specific property
                 *
                 * Note that the API suggests what properties might be
                 * returned, but to really know what actually is being
                 * returned, it is suggested for the developer to introspect an
                 * all() call.
                 */
                /*
                 * Available properties.
                 *
                 * location // country code
                 */
                all: function() { },
                get: function(name) { },
                set: function(name, value) { }
              },
              send: function(payload) {
                /*
                 * Send a message to a specific peer.
                 *
                 * This is an asyncronous operation and there is no inherent
                 * guarantee that a specific peer received a message. It is up
                 * to the implementers to support this behavior.
                 */
              },
              recv: function(callback) {
                /*
                 * Receive a message from a specific peer.
                 *
                 * This is a convenience method that registers with the message
                 * event and dispatches incoming messages to specific peers if
                 * there is a registered callback.
                 */
              }
            }
          }
        },
        file: {
          /*
           * Get a file associated with this torrent.
           *
           * all() -> dictionary of file_id/object pairs
           * get(index) -> get a specific file
           */
          all: function() { },
          get: function(index) { 
            return {
              torrent: {}, // The parent torrent object.
              index: 1, // Immutable index of the file
              properties: {
                /*
                 * Access a specific file's properties. If a property is read
                 * only, a ReadOnlyException will be thrown.
                 *
                 * all() -> list of all the current properties
                 * get(name) -> get a specific property
                 * set(name, value) -> set a specific property
                 *
                 * Note that the API suggests what properties might be
                 * returned, but to really know what actually is being
                 * returned, it is suggested for the developer to introspect an
                 * all() call.
                 */
                /*
                 * Available properties.
                 *
                 * name: 'test'
                 * size // bytes
                 * downloaded // bytes
                 * priority // int
                 */
                all: function() { },
                get: function(name) { },
                set: function(name, value) { }
              },
              get_data: function() {
                /*
                 * Get a file's complete binary data.
                 *
                 * Note that this is meant for small files and thusly there is a
                 * size limit on how much data can be read from a file.
                 */
              }
            }
          }
        }
      }
    }
  },
  rss_feed: {
    /*
     * Get an rss feed.
     *
     * all() -> dicitonary of feed_id/object pairs
     * get(id) -> get a specific rss_feed
     */
    all: function() { },
    get: function(id) {
      return {
        id: 1,
        properties: function(name, value) {
          /*
           * Access a specific feed's properties. If a property is read only, a
           * ReadOnlyException will be thrown.
           *
           * all() -> list of all the current properties
           * get(name) -> get a specific property
           * set(name, value) -> set a specific property
           *
           * Note that the API suggests what properties might be returned, but
           * to really know what actually is being returned, it is suggested
           * for the developer to introspect an all() call.
           */
          /*
           * Available properties.
           *
           * enabled // boolean
           * use_feed_title: true
           * user_selected: true
           * programmed: true
           * download_state: 1
           * url: 'rss://rss.utorrent.com'
           * next_update: 10 // unix timestamp
           * alias: 'test feed'
           * subscribe: true
           * smart_filter: true
           */
          all: function() { },
          get: function(name) { },
          set: function(name, value) { }
        },
        item: {
          /*
           * Get an item associated with this rss feed.
           *
           * all() -> dictionary of name/object pairs
           * get(name) -> specific item object
           */ 
          all: function() { },
          get: function(name) { 
            return {
              feed: {}, // The parent rss_Feed object.
              id: 1,
              properties: function(name, value) {
                /*
                 * Access a specific feed item's properties. If a property is
                 * read only, a ReadOnlyException will be thrown.
                 *
                 * all() -> list of all the current properties
                 * get(name) -> get a specific property
                 * set(name, value) -> set a specific property
                 *
                 * Note that the API suggests what properties might be
                 * returned, but to really know what actually is being
                 * returned, it is suggested for the developer to introspect an
                 * all() call.
                 */
                /*
                 * Available properties.
                 * name: 'test',
                 * name_full: 'test foo bar',
                 * url: 'http://utorrent.com',
                 * quality: 1,
                 * codec: 1,
                 * timestamp: 1, // unix timestamp
                 * season: 1,
                 * episode: 1,
                 * episode_to: 1,
                 * repack: false,
                 * in_history: false
                 */
                all: function() { },
                get: function(name) { },
                set: function(name, value) { }
              }
            }
          }
        },
        remove: function() {},
        force_update: function() {}
      } 
    },
    add: function(url) {
      /*
       * Add a feed by url..
       *
       */
      return // feed_object
    }
  },
  rss_filter: {
    /*
     * Get an rss filter.
     *
     * all() -> dicitonary of filter_id/object pairs
     * get(id) -> get a specific rss_filter
     */
    all: function() { },
    get: function(id) {
      return {
        id: 1,
        properties: {
          /*
           * Access a specific filter's properties. If a property is read only,
           * a ReadOnlyException will be thrown.
           *
           * all() -> list of all the current properties
           * get(name) -> get a specific property
           * set(name, value) -> set a specific property
           *
           * Note that the API suggests what properties might be returned, but
           * to really know what actually is being returned, it is suggested
           * for the developer to introspect an all() call.
           */
          /*
           * Available properties.
           *
           * flags: 1,
           * directory: 'test',
           * last_match: 10,
           * repack_ep_filter: 2,
           * resolving_candidate: false
           * name: 'test',
           * episode: 'expr',
           * episode_filter_str: 'test foo',
           * filter: '^.*$',
           * not_filter: '^.*$',
           * label: 'test filter',
           * quality: 10, // bytes
           * episode_filter: true,
           * original_name: 'test2',
           * priority: 1,
           * smart_ep_filter: 1,
           * add_stopped: true,
           * postpone_mode: false,
           * feed: 1,
           */      
          all: function() { },
          get: function(name) { },
          set: function(name, value) { }    
        },
        remove: function() {}
      }
    },
    add: function() {
      /*
       * Add an rss filter.
       */
      return { } // filter_object
    }
  },
  events: {
    /*
     * Access the available events for this client.
     *
     * all() -> full dictionary of all possible events with values for the
     *             bound ones.
     * get(name) -> get a specific event.
     * set(name, callback) -> register a callback for a specific event.
     */
    all: function() { },
    get: function(name) { },
    set: function(name, callback) { }
  },
  store: {
    /*
     * Access the application's data store.
     *
     * all() -> object containing all the name/value pairs in the store.
     * get(name) -> get a specific stored value.
     * set(name, value) -> set a specific store value.
     */
    all: function() { },
    get: function(name) { },
    set: function(name, callback) { }
  }
}

btapp.fn.init.prototype = btapp.fn;
