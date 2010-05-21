/*
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 *
 * Date: %date%
 * Version: %version%
 *
 */

bt._objs.Properties = Class.extend({
  init: function() { 
    this._props = { };
  },
  all: function() { return this._props; },
  keys: function() { return _.keys(this._props); },
  get: function(k) { return this._props[k]; },
  set: function(k, v) { this._props[k] = v; }
});

bt._objs.Torrent = Class.extend({
  init: function(url) {
    this.properties = new bt._objs.Properties();
    this.properties.set('download_url', url);
    this.hash = this._sha();
    this.properties.set('hash', this.hash);
  },
  _sha: function() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var len = 40;
    var hash = '';
    for (var i=0; i < len; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }
});
