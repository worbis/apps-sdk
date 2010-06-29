/*
 * Copyright(c) 2010 BitTorrent Inc.
 *
 * Date: %date%
 * Version: %version%
 *
 */

module('bt');

test('bt.add.torrent', function() {
  expect(10);

  var url = 'http://vodo.net/media/torrents/Pioneer.One.S01E01.720p.x264-VODO.torrent';
  var url_nocb = 'http://vodo.net/media/torrents/Everything.Unspoken.2004.Xvid-VODO.torrent';
  var url_def = 'http://vodo.net/media/torrents/Smalltown.Boy.2007.Xvid-VODO.torrent';
  var url_cbdef = 'http://vodo.net/media/torrents/Warring.Factions.2010.Xvid-VODO.torrent';
  var defs = { label: 'foobar',
               name: 'foobar' };
  // Just in case.
  bt.events.set('torrentStatus', bt._handlers.torrent);
  stop();
  bt.add.torrent(url_nocb);
  bt.add.torrent(url_def, defs);
  bt.add.torrent(url, function(resp) {
    equals(resp.url, url, 'Url\'s set right');
    equals(resp.status, 200, 'Status is okay');
    equals(resp.state, 1, 'State is okay');
    equals(resp.message, '', 'Message is okay');
    var download_urls = _.map(bt.torrent.all(), function(v) {
      return v.properties.get('download_url');
    });
    ok(_.indexOf(download_urls, url) >= 0,
       'Torrent added successfully');

    ok(_.indexOf(download_urls, url_nocb) >= 0,
       'No cb or defaults added okay');
    var tor = bt.torrent.get(url_def);
    if (tor)
      _.each(defs, function(v, k) {
        equals(tor.properties.get(k), v, 'Defaults are set');
      });
    bt.add.torrent(url_cbdef, defs, function(resp) {
      var tor = bt.torrent.get(url_cbdef);
      if (tor)
        _.each(defs, function(v, k) {
          equals(tor.properties.get(k), v, 'Callback + defaults works');
        });
      _.each(bt.torrent.all(), function(v) {
        v.remove();
      });
      start();
    });
  });
});

test('bt.add.rss_feed', function() {
  expect();

  // XXX - Fill out the unit tests
});

test('bt.add.rss_filter', function() {
  expect();

  // XXX - Fill out the unit tests
});

test('bt.stash', function() {
  expect(14);

  if (btapp.stash._clear)
    btapp.stash._clear();
  var objs = { foo: 'bar',
               bar: [1, 2, '3'],
               baz: { a: 1 },
               btinstall_lastmodified: "",
               lastmodified: "",
               productcode: ""
            };
  _.each(objs, function(v, k) {
    bt.stash.set(k, v);
    same(bt.stash.get(k), v, 'Parsing works');
    equals(stub.stash.get(k), JSON.stringify(v), 'Serialization works');
  });
  same(bt.stash.keys().sort(), _.keys(objs).sort(), 'keys() works');
  same(bt.stash.all(), objs, 'all() works');
});

test('bt.events', function() {
  expect(3);

  var fn = function() { };
  bt.events.set('torrent', fn);
  same(bt.events.get('torrent'), fn, 'Callback set correctly');
  ok(_.indexOf(bt.events.keys(), 'torrent') >= 0,
     'Torrent shows up in the keys');
  same(bt.events.all()['torrent'], fn, 'All is returning the right data');
});

test('bt.torrent', function() {
  expect(5);

  bt.events.set('torrent', bt._handlers.torrent);
  var url = 'http://example.com/add.torrent';
  var magnet = 'magnet:?xt=urn:sha1:6de6a83d402817ef5116d28072f9dd6b0600c6d6&dn=OOo_2.1.0_LinuxIntel_install_en-US.tar.gz&xs=http://mirror.switch.ch/ftp/mirror/OpenOffice/stable/2.1.0/OOo_2.1.0_LinuxIntel_install_en-US.tar.gz';
  var tor = bt.torrent.get(url);
  equals(tor.properties.get('download_url'), url, 'Got the right torrent');
  equals(bt.torrent.get(tor.hash).properties.get('hash'), tor.hash,
         'Can get by hash too');
  ok(_.indexOf(bt.torrent.keys(), tor.hash) >= 0, 'Keys has the right hashes');
  same(bt.torrent.all()[tor.hash], tor, 'all() has at least one right key');
  stop();
  bt.add.torrent(magnet, function(resp) {
    var tor = bt.torrent.get(magnet);
    equals(tor.properties.get('download_url'), magnet, 'Got the right torrent');
    start();
  });
});

test('bt.resource', function() {
  expect(1);

  var txt = 'test123\n';
  equal(bt.resource('data/foobar'), txt, 'Fetched the right data');
});

test('bt.settings', function() {
  expect();

  // XXX - Fill out the unit tests
});

test('bt.log', function() {
  expect();

  // XXX - Fill out the unit tests
});
