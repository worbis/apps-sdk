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
    "net.bind_ip": "",
    "net.outgoing_ip": "",
    ,["net.outgoing_port",0,"0"]
    ,["net.outgoing_max_port",0,"0"]
    ,["net.low_cpu",1,"false"]
    ,["net.calc_overhead",1,"true"]
    ,["net.max_halfopen",0,"8"]
    ,["net.limit_excludeslocal",1,"false"]
    ,["net.upnp_tcp_only",1,"false"]
    ,["encryption_mode",0,"0"]
    ,["encryption_allow_legacy",1,"true"]
    ,["rss.update_interval",0,"15"]
    ,["rss.smart_repack_filter",1,"true"]
    ,["rss.feed_as_default_label",1,"true"]
  }
});
