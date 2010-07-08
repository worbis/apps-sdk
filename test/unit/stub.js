/*
 * Copyright(c) 2010 BitTorrent Inc.
 *
 * Date: %date%
 * Version: %version%
 *
 */

module('stub');

test('stub.add.torrent (callback)', function() {
  expect(2);

  var url1 = 'http://example.com/foobar2.torrent';
  stub.add.torrent(url1);
  function tester() {
    equals(stub.torrent.get(stub.torrent.keys()[0]).properties.get(
      'download_url'), url1, 'Added torrent without callback.');

    stub.events.set('torrentStatus', function(resp) {
      equals(stub.torrent.get(stub.torrent.keys()[1]).properties.get(
        'download_url'), url2, 'Added torrent after callback');
      start();
      // Reset the events
      stub.events._registered = {};
    });
    var url2 = 'http://example.com/foobar.torrent';
    stub.add.torrent(url2);
  }
  setTimeout(tester, 1100);
  stop();
});

test('stub.add.rss_feed', function() {
  expect();

  // XXX - Fill out the unit tests
});

test('stub.add.rss_filter', function() {
  expect();

  // XXX - Fill out the unit tests
});

test('stub.events', function() {
  expect(3);

  stub.events.set('foo', 'bar');
  equals(stub.events.get('foo'), 'bar', 'Correctly set and got an event.');
  same(stub.events.keys(), ['foo'], 'Keys works.');
  same(stub.events.all(), { foo: 'bar' }, 'all() works');
});

test('stub.stash', function() {
  // XXX - It should probably be noted that this unit test sucks, since there's
  // no way to tell if jstorage is actually working or not.
  expect(5);

  var objs = { foo: 'bar',
               bar: 'baz',
               baz: 'foo'
             };
  _.each(objs, function(v, k) {
    stub.stash.set(k, v);
    equals(stub.stash.get(k), v, 'Got a value .. ' + v);
  });
  same(stub.stash.keys(), _.keys(objs), 'keys() works');
  same(stub.stash.all(), objs, 'all() works');
});

test('stub.torrent', function() {
  expect(3);

  // The assumption here is that there's at least one torrent added
  // via. stub.add.torrent's test.
  same(stub.torrent.keys(), _.keys(stub.torrent.all()), 'Same thing');
  ok(stub.torrent.keys()[0].length == 40, 'Hashes for keys');
  var k = stub.torrent.keys()[0];
  ok(stub.torrent.get(k), 'Get works');
});

test('stub.resource', function() {
  expect(1);

  var txt = 'test123\n';
  equal(stub.resource('data/foobar'), txt, 'Fetched the right data');
});

test('stub.settings', function() {
  expect();

  // XXX - Fill out the unit tests
});

test('stub.log', function() {
  expect();

  // XXX - Fill out the unit tests
});
