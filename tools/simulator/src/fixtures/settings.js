/*
 * Testing fixtures for settings
 *
 * This ends up being used by simulator/api.js. For each call to getSettings,
 * the next element of the list will be fetched. If the end of the list has
 * been reached, it will just move back to the front again. 
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 */

_(btapp.fn).extend({
  _settings:  {
    'peer.id': 'simulator',
    "net.bind_ip": "",
    "net.outgoing_ip": "",
    "net.outgoing_port": 0,
    "net.outgoing_max_port": 0,
    "net.low_cpu": false,
    "net.calc_overhead": true,
    "net.max_halfopen": 8,
    "net.limit_excludeslocal": false,
    "net.upnp_tcp_only": false,
    "encryption_mode": 0,
    "encryption_allow_legacy": true,
    "rss.update_interval": 15,
    "rss.smart_repack_filter": true,
    "rss.feed_as_default_label": true
  }
});
