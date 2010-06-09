/*
 * Copyright(c) 2010 BitTorrent Inc.
 *
 * Date: %date%
 * Version: %version%
 *
 */

module('torrent');

test('properties', function() {
  expect(5);

  var prop = new bt._objs.Properties();
  var items = {
    foo: 'bar',
    bar: 'baz',
    baz: 'foo'
  };
  ok(!prop.set('foo', 'bar'), 'Can set values');
  equals(prop.get('foo'), 'bar', 'Values are being returned correctly.');
  _.each(items, function(v, k) {
    prop.set(k, v);
  });
  same(prop.keys(), _.keys(items), 'Keys are valid.');
  same(prop.all(), items, 'all() returns everything.');
  try {
    console.log(prop.get('asdf'));
  } catch(err) { ok(true, "Exception is thrown when there isn't a key.") }
});

test('torrent', function() {
  expect(8);

  var url = 'http://example.com/foobar.torrent'
  var tor = new bt._objs.Torrent(url);
  equals(tor.properties.get('download_url'), url,
         'Download url set correctly.');
  equals(tor.hash.length, 40, 'Random hash is the right length.');
  equals(tor.hash, tor.properties.get('hash'));
  equals(tor.properties.get('name'), 'default');
  same(tor.file.keys(), ['1'], 'Default file is setup.');
  var f = tor.file.all();
  ok(f['1'].open, 'Is a file object.');
  same(tor.file.get('1'), f['1'], 'Get appears to be working');
  tor.file.set('foo', 'bar');
  equals(tor.file.get('foo'), 'bar');
});

test('file', function() {
  expect();

  var f = new bt._objs.File('1');
  equals(f.index, '1', 'Index has been set');
  ok(_.isNumber(f.properties.get('size')), 'Size is a number');
  ok(!f.open(), 'Opened file.');
});
