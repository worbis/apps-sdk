/*
 * Copyright(c) 2010 BitTorrent Inc.
 *
 * Date: %date%
 * Version: %version%
 *
 */

module('bt');

test('bt.add.torrent', function() {
  expect(4);

  var url = 'http://example.com/add.torrent';
  // Just in case.
  bt.events.set('torrent', bt._handlers.torrent);
  stop();
  bt.add.torrent(url, function(resp) {
    equals(resp.url, url, 'Url\'s set right');
    equals(resp.status, 200, 'Status is okay');
    equals(resp.message, 'success', 'Message is okay');
    var download_urls = _.map(bt.torrent.all(), function(v) {
      return v.properties.get('download_url');
    });
    ok(download_urls.indexOf(url) >= 0, 'Torrent added successfully');
    start();
  });
});

test('bt.stash', function() {
  expect();

  var objs = { foo: 'bar',
              bar: [1, 2, '3'],
              baz: { a: 1 }
            };
  _.each(objs, function(v, k) {
    bt.stash.set(k, v);
    same(bt.stash.get(k), v, 'Parsing works');
    equals(stub.stash.get(k), JSON.stringify(v), 'Serialization works');
  });
  same(bt.stash.keys(), _.keys(objs), 'keys() works');
  same(bt.stash.all(), objs, 'all() works');
});

test('bt.events', function() {
  expect();


});

test('bt.torrent', function() {
  expect();


});

test('bt.resource', function() {
  expect();


});
