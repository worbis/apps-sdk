/*
 * Record all interactions with the btapp object while inside a client for
 * playback from within a browser.
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 *
 * Date: %date%
 * Version: %version%
 *
 */

bt._objs.Recorder = Class.extend({
  // Functions in btapp to wrap
  entry: [ 'add.torrent',
           'stash.all',
           'stash.keys',
           'stash.get',
           'stash.set',
           'events.all',
           'events.keys',
           'events.get',
           'events.set',
           'torrent.all',
           'torrent.keys',
           'torrent.get',
           'rss_feed.all',
           'rss_feed.keys',
           'rss_feed.get'
         ],
  init: function() {
    _.each(this.entry, function(fn_str) {
      var fn =
    });
  },
  save: function(call, time, resp) { },
  dump: function() { }
});
