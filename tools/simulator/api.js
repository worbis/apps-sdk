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
      hash: 'SHA', // This is meant to be the primary key and is immutable.
      start: function(force) {},
      stop: function() {},
      pause: function() {},
      unpause: function() {},
      recheck: function() {},
      remove: function() {},
      properties: function(name, value) {
        /*
         * Access a specific torrent's properties. If a property is read only,
         * a ReadOnlyException will be thrown. 
         *
         * properties() -> list of all the current properties
         * properties(name) -> get a specific property
         * properties(name, value) -> set a specific property
         *
         * Note that the API suggests what properties might be returned, but to
         * really know what actually is being returned, it is suggested for the
         * developer to introspect a properties() call.
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
          index: 1, // Immutable index of the file with relation to its torrent
          // Methods of an rss feed:
          properties: function(name, value) {
            /*
             * Access a specific file's properties. If a property is read only,
             * a ReadOnlyException will be thrown. 
             *
             * properties() -> list of all the current properties
             * properties(name) -> get a specific property
             * properties(name, value) -> set a specific property
             *
             * Note that the API suggests what properties might be returned,
             * but to really know what actually is being returned, it is
             * suggested for the developer to introspect a properties() call.
             */
            /*
             * Available properties.
             *
             * name: 'test'
             * size // bytes
             * downloaded // bytes
             * priority // int
             */
          },
          // properties.get / properties.set / properties.all
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
      id: 1,
      properties: function(name, value) {
        /*
         * Access a specific feed's properties. If a property is read only, a
         * ReadOnlyException will be thrown.
         *
         * properties() -> list of all the current properties
         * properties(name) -> get a specific property
         * properties(name, value) -> set a specific property
         *
         * Note that the API suggests what properties might be returned, but to
         * really know what actually is being returned, it is suggested for the
         * developer to introspect a properties() call.
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
      },
      // properties.get / properties.set / properties.all
      items: function() {
        /*
         * Get all the current rss items.
         */
        return {}
      },
      item: function(name) {
        return {
          feed: {}, // The parent rss_Feed object.
          id: 1,
          properties: function(name, value) {
            /*
             * Access a specific feed item's properties. If a property is read
             * only, a ReadOnlyException will be thrown.
             *
             * properties() -> list of all the current properties
             * properties(name) -> get a specific property
             * properties(name, value) -> set a specific property
             *
             * Note that the API suggests what properties might be returned,
             * but to really know what actually is being returned, it is
             * suggested for the developer to introspect a properties() call.
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
          },
          // properties.get / properties.set / properties.all      
        }
      },
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
      id: 1,
      properties: function(name, value) {
        /*
         * Access a specific filter's properties. If a property is read only, a
         * ReadOnlyException will be thrown.
         *
         * properties() -> list of all the current properties
         * properties(name) -> get a specific property
         * properties(name, value) -> set a specific property
         *
         * Note that the API suggests what properties might be returned, but to
         * really know what actually is being returned, it is suggested for the
         * developer to introspect a properties() call.
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
      },
      // properties.get / properties.set / properties.all
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
     * 
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
     *
     */
  },
  // store.get / store.set / store.all
  peers: function() {
  },
  peer: function(id) {
    return {
      id: 'foobar',
      properties: function(name, value) {
        /*
         * Access a specific filter's properties. If a property is read only, a
         * ReadOnlyException will be thrown.
         *
         * properties() -> list of all the current properties
         * properties(name) -> get a specific property
         * properties(name, value) -> set a specific property
         *
         * Note that the API suggests what properties might be returned, but to
         * really know what actually is being returned, it is suggested for the
         * developer to introspect a properties() call.
         */
        /*
         * Available properties.
         *
         * location // country of origin
         */
      },
      // properties.get / properties.set / properties.all
      send: function(payload) {
        /*
         * Send a message to a specific peer.
         *
         * This is an asyncronous operation and there is no inherent guarantee
         * that a specific peer received a message. It is up to the implementers
         * to support this behavior.
         */
      },
      recv: function(callback) {
        /*
         * Receive a message from a specific peer.
         *
         * This is a convenience method that registers with the message event
         * and dispatches incoming messages to specific peers if there is a
         * registered callback.
         */
      }
    }
  }
}

btapp.fn.init.prototype = btapp.fn;
