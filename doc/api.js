/*
 * btapp API simulation
 *
 * Copyright(c) 2010 BitTorrent Inc.
 *
 * Date: %date%
 * Version: %version%
 *
 * To enable developers to develop apps while in the browser of their choice,
 * this simulator copies the btapp API in it's entirety. All methods return
 * valid return data. This data is picked up from replay files. There are a
 * couple replay files included. Alternatively, take a look at the replay file
 * documentation for how to write your own set of data to replay.
 */

var bt = new btapp.fn.init();

bt.fn = bt.prototype = {
  init: function() { },
  peer_id: 'foobar',
  settings: {
    /*
     * Access the client's settings.  If a property is read only, a
     * ReadOnlyException will be thrown.
     *
     * all() -> dictionary of key/value pairs
     * keys() -> list of all the settings names available.
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
     */
    all: function() {
      return this._settings;
    },
    keys: function() { },
    get: function(name) {
      return this._settings[name];
    },
    set: function(name, value) {
      this._settings[name] = value;
    }
  },
  add: {
    /*
     * Add an element
     * torrent() -> add a torrent by url or file path
     * rss_feed() -> Add a rss feed by url
     * rss_Filter() -> Add a rss filter
     */
    torrent: function(url) {
      /*
       * Add a torrent by url (or magnet link).
       *
       */
      return { } // torrent object
    },
    rss_feed: function(url) {
      /*
       * Add a feed by url..
       *
       */
      return { }// feed_object
    },
    rss_filter: function(filter) {
      /*
       * Add an rss filter.
       */
      return { } // filter_object
    },
  },
  torrent: {
    /*
     * Get a torrent.
     *
     * all() -> dictionary of hash/object pairs
     * keys() -> list of all the currently available torrent hashes
     * get(hash) -> get a specific torrent
     */
    all: function() { },
    keys: function() { },
    get: function(name) {
      return {
        name: 'My Torrent', // This is meant to be the primary key and is
                            // immutable.
        start: function(force) {},
        stop: function() {},
        pause: function() {},
        unpause: function() {},
        recheck: function() {},
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
           * all() -> object containing the key/value pairs of all
           *          properties.
           * keys() -> list of all the property names.
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
          keys: function() { },
          get: function(name) {},
          set: function(name) {}
        },
        peer: {
          /*
           * Get a peer associated with this torrent.
           *
           * all() -> dictionary of peer_id/object pairs
           * keys() -> list of all the peer ids associated with this torrent.
           * get(id) -> get a specific peer
           */
          all: function() { },
          keys: function() { },
          get: function(id) {
            return {
              torrent: { },
              id: 'foobar',
              properties: {
                /*
                 * Access a specific peer's properties. If a property is read
                 * only, a ReadOnlyException will be thrown.
                 *
                 * all() -> object containing the key/value pairs of all
                 *          properties.
                 * keys() -> list of all the property names.
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
                keys: function() { },
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
           * keys() -> list of all the file indexes in this torrent
           * get(index) -> get a specific file
           */
          all: function() { },
          keys: function() { },
          get: function(index) {
            return {
              torrent: {}, // The parent torrent object.
              index: 1, // Immutable index of the file
              properties: {
                /*
                 * Access a specific file's properties. If a property is read
                 * only, a ReadOnlyException will be thrown.
                 *
                 * all() -> object containing the key/value pairs of all
                 *          properties.
                 * keys() -> list of all the property names.
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
                keys: function() { },
                get: function(name) { },
                set: function(name, value) { }
              },
              open: function() {
                /*
                 * Open the file. This can be used to start playing video and
                 * music from within your application.
                 */
              }
              get_data: function() {
                /*
                 * Get the file's complete binary data.
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
     * keys() -> list of all the feed ids
     * get(id) -> get a specific rss_feed
     */
    all: function() { },
    keys: function() { },
    get: function(id) {
      return {
        id: 1,
        properties: function(name, value) {
          /*
           * Access a specific feed's properties. If a property is read only, a
           * ReadOnlyException will be thrown.
           *
           * all() -> object containing the key/value pairs of all
           *          properties.
           * keys() -> list of all the property names.
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
          keys: function() { },
          get: function(name) { },
          set: function(name, value) { }
        },
        item: {
          /*
           * Get an item associated with this rss feed.
           *
           * all() -> dictionary of name/object pairs
           * keys() -> list of all rss feed item names.
           * get(name) -> specific item object
           */
          all: function() { },
          keys: function() { },
          get: function(name) {
            return {
              feed: {}, // The parent rss_Feed object.
              id: 1,
              properties: function(name, value) {
                /*
                 * Access a specific feed item's properties. If a property is
                 * read only, a ReadOnlyException will be thrown.
                 *
                 * all() -> object containing the key/value pairs of all
                 *          properties.
                 * keys() -> list of all the property names.
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
                keys: function() { },
                get: function(name) { },
                set: function(name, value) { }
              }
            }
          }
        },
        remove: function() {},
        force_update: function() {}
      }
    }
  },
  rss_filter: {
    /*
     * Get an rss filter.
     *
     * all() -> dicitonary of filter_id/object pairs
     * keys() -> list of all filter ids
     * get(id) -> get a specific rss_filter
     */

    all: function() { },
    keys: function() { },
    get: function(id) {
      return {
        id: 1,
        properties: {
          /*
           * Access a specific filter's properties. If a property is read only,
           * a ReadOnlyException will be thrown.
           *
           * all() -> object containing the key/value pairs of all properties.
           * keys() -> list of all the property names.
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
          keys: function() { },
          get: function(name) { },
          set: function(name, value) { }
        },
        remove: function() {}
      }
    }
  },
  events: {
    /*
     * Access the available events for this client.
     *
     * all() -> full dictionary of all possible events with values for the
     *             bound ones.
     * keys() -> the names of all events that can be bound.
     * get(name) -> get a specific event.
     * set(name, callback) -> register a callback for a specific event.
     */
    all: function() { },
    keys: function() { },
    get: function(name) { },
    set: function(name, callback) { }
  },
  stash: {
    /*
     * Access the application's data store.
     *
     * all() -> object containing all the name/value pairs in the stash.
     * keys() -> the names of all items in the stash.
     * get(name) -> get a specific stored value.
     * set(name, value) -> set a specific store value.
     */
    all: function() { },
    keys: function() { },
    get: function(name) { },
    set: function(name, callback) { }
  },
  resource: function(path) {
    /*
     * Fetch the binary representation of a resource inside the btapp package.
     */
  }
}

btapp.fn.init.prototype = btapp.fn;
