# Overview

The Griffin API provides applications a method to interface with the BitTorrent
client that an application has been installed within. The API allows sandboxed
access to the client for tasks such as adding a torrent or an rss feed. This
document outlines the raw interface presented by the client. If you'd like a
somewhat more user friendly version, check out the
[SDK](https://github.com/bittorrent/griffin/blob/master/doc/SDK.md).

For those that prefer to look at code instead of documentation, take a look at
[api.js](https://github.com/bittorrent/griffin/blob/master/doc/api.js).

# Sandbox

All applications live inside a sandbox. This means that your application will
only be able to access torrents and rss feeds that it added to the client
itself. The application's events and stash are also specific to the
application and cannot be accessed from another application.

# btapp object

The entire raw API sits under the `btapp` javascript object. This object has a
bunch of methods and a couple properties that it exports to allow you to access
and modify the BitTorrent client your application has been installed into.

The available properties are:

    >> btapp.peer_id // This is the peer ID of your own client.
    "local_client"

For a discussion of the methods that you're able to use, please read on.

# Settings

All the settings for a client can be accessed at `btapp.settings`. This allows
you read/write access to the settings inside your sandbox. For properties that
are read only, an exception will be thrown when you try to set that property.

    >> btapp.settings.all() // Dictionary of key/value pairs
    { "rss.update_interval": 15,
      "cid": "1234567",
      "net.calc_overhead": false }
    >> btapp.settings.keys() // List of all the settings available.
    [ "cid", "rss.update_interval", "net.calc_overhead" ]
    >> btapp.settings.get("cid") // get the value of a specific setting
    "1234567"
    >> btapp.settings.set("net.calc_overhead", true) // set the value of a specific setting
    true

# Add

Add a variety of elements to the client.

    bt.add.torrent() -> add a torrent by url, file path or magnet link
    bt.add.rss_feed() -> Add a rss feed by url
    bt.add.rss_filter() -> Add an rss filter

To add a torrent to your client, you'd simply run the following command.

    bt.add.torrent('http://vodo.net/media/torrents/VODO.Mixtape.1.2010.Xvid-VODO.torrent');

Note that this operation will return instantly. The client will then go and
download the torrent, adding it to the torrent list. If you want notification
of this event, use the 'torrent_added' event.

RSS Feeds that are added from within your application will show up within the
'Feeds' menu on the client. This item will be associated with your application.

# Torrents

Access all operations that have to do with torrents at bt.torrent. This will
allow you to see metadata about the torrents that your application has
added. The sandbox restricts the torrents that you're available to see down to
only the ones that your application added.

    bt.torrent.all() -> dictionary of hash/torrent object pairs
    bt.torrent.keys() -> list of all the currently available torrent hashes
    bt.torrent.get(name) -> get a specific torrent object

It is generally a good idea to provide progress bars inside your application
for torrents that it has added. An easy way to do this is by iterating through
bt.torrent.all() and updating the local DOM elements.

    _.each(bt.torrent.all(), function(torrent, name) {
      update_progress(name, torrent.properties.get('progress'));
    });

## Object

The torrent object is returned by bt.torrent.all/get. This object allows you to
look into the metadata associated with this torrent.

    name: 'Test Torrent' // This is meant to be the primary key and is immutable.
    start: function(force)
      /*
       * force -> Instead of waiting to start, forces a start immediately.
       */
    stop: function()
    pause: function()
    unpause: function()
    recheck: function()
    remove: function()

Note that torrents will typically be started (or queued) automatically for you
as part of the add operation.

In addition to these parameters and methods, there are three objects
associated with torrent objects:

- properties - The properties associated with this torrent.
- peer - The peers associated with this torrent.
- file - The files associated with this torrent.

## Properties

For a discussion of the methods that the torrent's properties implements, take
a look at General Properties.

The properties specific to a torrent are:

    trackers: ['tracker1', 'tracker2'] // list
    upload_limit: 1000 // bytes/second
    download_limit: 1000 // bytes/second
    superseed: enabled // not_allowed/disabled/enabled
    dht // not_allowed/disabled/enabled
    pex // not_allowed/disabled/enabled
    seed_override // not_allowed/disabled/enabled
    seed_ratio: 0.1 // percentage
    seed_time: 100 // seconds
    ulslots // maximum upload slots
    status // paused/started/seeding
    name: 'My Torrent'
    size: 100 // bytes
    progress: 0.50 // percentage
    downloaded: 50 // bytes
    uploaded: 100 // bytes
    ratio: 2.0 // percentage
    upload_speed: 1000 // bytes/second
    download_speed: 1000 // bytes/second
    eta: 10 // seconds
    label: 'test label'
    peers_connected: 10 // peers
    peers_in_swarm: 10 // peers
    seeds_connected: 10 // seeds
    seeds_in_swarm: 10 // seeds
    availability: 0.50 // percentage
    queue_order: 1
    remaining: 50 // bytes
    download_url: 'http://utorrent.com'
    rss_feed_url: 'rss://rss.utorrent.com'

It's easy to get any of these properties. To get the url that a torrent was
downloaded from, you can:

    var torrent = bt.torrent.get('My Torrent');
    console.log(torrent.properties.get('download_url'));

## Peers

From torrent_obj.peer, you can access all the peers that are associated with a
specific torrent itself via the normal means. This is especially useful for
broadcasting data to, and receiving data from, specific peers in a torrent's
swarm.

    torrent_obj.peer.all() -> dictionary of id/peer object pairs
    torrent_obj.peer.keys() -> list of all the peers connected to this torrent
    torrent_obj.peer.get(id) -> get a specific peer object

A peer object is returned by torrent_obj.peer.all/get. These objects can be
used to get the metadata of a connected peer.

    torrent: torrent_obj // The parent torrent
    id: 'foobar' // ID of this specific peer
    send: function(msg) // Send an arbitrary data to this peer
      /*
       * msg - This can be any kind of string or JSON object. It will be
         serialized and sent to this peer.
       */
    recv: function(callback) // Receive a message from this peer. Note that this
         is simply a convenience function that uses bt.event.
      /*
       * callback - Callback that gets called with the JSON.parse result from
       *            this peer.
       */

In addition to these parameters and methods, there is another object
associated with the peer object.

- properties

For a discussion of the methods that the peer's properties implements, take
a look at General Properties.

The properties specific to a peer are:

    location: 'US' // country code

## Files

XXX - This is unclear and needs to be reworked.

After getting a torrent object from bt.torrent.get() or bt.torrent.all(), you
can access all the files that are associated with a specific torrent via. the
"file" attribute. This attribute returns file objects in the normal
fashion. The file object is especially useful for opening or playing specific
files in a torrent from directly in your application. This allows users an easy
way to consume your content.

    torrent_obj.file.all() -> dictionary of index/file object pairs
    torrent_obj.file.keys() -> list of all the file indexes in this torrent
    torrent_obj.file.get(index) -> get a specific file object

A file object is returned by torrent_obj.file.all/get. These objects can be
used to get the metadata of a specific file.

    torrent = torrent_obj // The parent torrent
    index: 1 // Index of this file in the torrent
    open: function() // Open this file (or play if this is a video/audio file)
                     // for the user.
    get_data: function() // Get the complete binary data of a file
      /*
       * Note that this is meant for small files and thusly there is a size limit
       * on how large a file can be.
       */

A common use for files is to present users with a 'Play' button that allows
them to watch the content they just downloaded. A way to do this is:

    var files = bt.torrent.get('My Torrent').file.all();
    // It's likely that we can play the largest file by default since that is
    // most likely to be the video.
    _(files).chain().values().sort(function(file_a, file_b) {
      return file_a.properties.get('size') > file_b.properties.get('size');
    }).value()[0].open();

In addition to these parameters and methods, there is another object
associated with the file object.

- properties

For a discussion of the methods that the file's properties implements, take a
look at General Properties.

The properties specific to a file are:

    name: 'test'
    size: 1000 // bytes
    downloaded: 100 // bytes
    priority: 1 // int

To present a user with progress for a specific file, you could:

    var file = bt.torrent.get('My Torrent').file.get('my_awsome_file.mov');
    var progress = file.properties.get('downloaded') /
      file.properties.get('size');

# RSS Feeds

Access all operations that have to do with rss feeds at bt.rss_feed. This will
allow you to access metadata about the rss feeds that you have added. The
sandbox restricts the rss feeds that you're available to see down to only the
ones that your application added.

Remember that feeds you've added from within your application will also show up
in the RSS feeds section of the client and be associated with your application.

    bt.rss_feed.all() -> dictionary of id/rss feed object pairs
    bt.rss_feed.keys() -> list of all the currently available rss feed ids
    bt.rss_feed.get(id) -> get a specific rss feed object

## Object

The rss feed object is returned by bt.rss_feed.all/get. This object allows you
to look into the metadata associated with the rss feed.

    id: 1 // This is meant to be a primary key and is immutable.
    remove: function() // Remove this feed.
    force_update: function() // Don't wait until the next update time, do it now

In addition to these parameters and methods, there are two other objects
associated with rss feed objects:

- properties - The properties associated with this rss feed.
- item - An item associated with this rss feed.

## Properties

For a discussion of the methods that the rss feed's properties implements, take
a look at General Properties.

The properties specific to an rss feed are:

    enabled: true
    use_feed_title: true
    user_selected: true
    programmed: true
    download_state: 1
    url: 'rss://rss.utorrent.com'
    next_update: 10 // unix timestamp
    alias: 'test feed'
    subscribe: true
    smart_filter: true

## Items

From rss_feed_obj.item, you can access all the items that are associated with a
specific rss_feed itself via the normal means.

    rss_feed_obj.all() -> dictionary of id/item object pairs
    rss_feed_obj.keys() -> list of all the peers connected to this torrent
    rss_feed_obj.get(id) -> get a specific item from this feed

An item object is returned by rss_feed_obj.all/get. These objects can be used
to get the metadata of an rss feed's item.

    feed: rss_feed_obj // The parent rss feed
    id: 1 // ID of this specific feed

To keep from using any kind of JSONP to update the torrents that are available
from an application, it is possible to use RSS Feeds. The entire process would
look something like this:

    bt.add.rss_feed('http://utorrent.com/rss.xml');
    var feed = bt.rss_feed.get('1);
    feed.force_update();
    _.each(feed.item.all(), function(item) {
      render_item(item.properties.get('name'), item.properties.get('url'));
    });

In addition to these parameters and methods, there are two other objects
associated with rss feed item objects:

- properties - The properties associated with this rss feed item.

For a discussion of the methods that the item's properties implements, take a
look at General Properties.

The properties specific to an item are:

    name: 'test', // string
    name_full: 'test foo bar', // string
    url: 'http://utorrent.com',
    quality: 1, // int
    codec: 1, // int
    timestamp: 1, // unix timestamp
    season: 1, // int
    episode: 1, // int
    episode_to: 1, // int
    repack: false, // boolean
    in_history: false // boolean

# RSS Filters

Access all operations that have to do with rss filters at bt.rss_filter. This
will allow you to access metadata about the rss filters that you have
added. The sandbox restricts the rss filters that you're available to see down
to only the ones that your application added.

    bt.rss_filter.all() -> dictionary of id/rss filter object pairs
    bt.rss_filter.keys() -> list of all the currently available rss filter ids
    bt.rss_filter.get(id) -> get a specific rss filter object

## Object

The rss filter object is returned by bt.rss_filter.all/get. This object allows
you to look into the metadata associated wit the rss filter.

    id: 1 // This is meant to be a primary key and is immutable.
    remove: function() // Remove this filter.

In addition to these parameters and methods, there is one other object
associated with rss filter objects:

- properties - The properties associated with this rss filter.

For a discussion of the methods that the rss filter's properties implements,
take a look at General Properties.

The properties specific to an rss filter are:

    flags: 1, // int
    directory: 'test', // Directory to save matches to.
    last_match: 10, // Unix timestamp of last match
    repack_ep_filter: 2, // int
    resolving_candidate: false, // boolean
    name: 'test', // Filter name
    episode: 'expr', // Episode expression
    episode_filter_str: 'test foo', // Episode filter string
    filter: '^.*$', // Regex for matching
    not_filter: '^.*$', // Exclusionary regex for not matching
    label: 'test filter', // Label to use after adding a torrent
    quality: 10, // bytes
    episode_filter: true, // boolean
    original_name: 'test2',
    priority: 1, // int
    smart_ep_filter: 1, // int
    add_stopped: true, // Add but don't start the torrents
    postpone_mode: false, // boolean
    feed: 1 // The feed this filter is associated with

# Events

Access all operations that have to do with client generated events at
bt.events. Events are special operations that allow the client to notify an
application of a specific action that has occurred. Some events are torrent
completion and message received. The methods that you can use to interact with
events are:

    bt.events.all() -> All available events in name/callback pairs
    bt.events.keys() -> Name of all the events available to this application
    bt.events.get(name) -> Get a callback that has been bound to a specific event
    bt.events.set(name, callback) -> Bind a callback to a specific event

# Stash

The stash allows applications to save state between uses. Any data in the JSON
format can be saved to the stash. On startup, any data that has been saved to
the stash previously can be recovered. To manipulate the stash, you can use
these methods:

    bt.stash.all() -> All the data stored in the stash in key/value pairs
    bt.stash.keys() -> The keys of all data stored in the stash
    bt.stash.get(key) -> The JSON decoded data of a specific key
    bt.stash.set(key, value) -> A key and JSON serializable value to save to the
                                stash.

Operations on the stash end up being very important to the user experience of
your application. It allows you to save your application's state between
application restarts. Any kind of network operation should have its results
saved to the stash so that users can see results as quickly as possible when
using your application.

    $.ajax({
      url: 'http://vodo.net/jsonp/releases/all',
      dataType: 'jsonp',
      success: function(items) {
        bt.stash.set('items', items);
        render_response(items);
      }
    });

Another thing to note is that all input/output from the stash is passed through
a JSON parser. This allows you to pass any native javascript objects into
stash.set and get native json objects out from stash.get.

# General Properties

There are four methods that all properties objects have:

    all: function() // Get all the properties associated with this object.
    keys: function() // Get only the names of the properties associated with
                     // this object.
    get: function(name) // Get a specific property's value from this object.
    set: function(name, value) // Set a specific property's value for this object.

Note that the API suggests what properties might be returned, but to really
know what actually is being returned, it is suggested that the developer should
introspect bt.settings.all() or bt.settings.keys() to discover what settings
their application can actually see.
