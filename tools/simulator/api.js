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

var btapp = new btapp.fn.init();

btapp.fn = btapp.prototype = {
  init: function() {
    return this;
  },
  getSettings: function() {
    return {}
  },
  setSettings: function(settings) {
  },
  list: function() {
    return {}
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
  }
}

btapp.fn.init.prototype = btapp.fn;
