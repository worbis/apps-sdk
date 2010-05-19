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

    >> btapp.add.torrent('http://default.com/test.torrent') // Add a torrent by url, file path or magnet link
    >> btapp.add.rss_feed() // Add a rss feed by url
    >> btapp.add.rss_filter() // Add an rss filter

Note that add operations are asynchronous. If you'd like to get the results of
add events, you must bind an event. When adding torrents, you probably want
something like:

    >> function result(status) { console.log(status.message); }
    >> btapp.events.set('torrent', result);
    >> btapp.add.torrent('http://default.com/test.torrent');

If the torrent can be added successfully, your registered callback will be
called with an object that looks like:

    { "status": 404, // HTTP error code
      "message": "error",
      "url": "http://default.com/test.torrent",
      "hash": "" }

RSS Feeds that are added from within your application will show up within the
'Feeds' menu on the client. This item will then be associated with your
application and removed when your application is uninstalled.

# Torrents

All the torrents inside your sandbox can be fetched via. `btapp.torrent`
methods. After a torrent has been added to the client, it can be fetched from
`btapp.torrent`. Once a torrent object has been fetched, you can do things such
as stop it, play it or fetch the current progress.

To access the torrent objects in your sandbox:

    >> btapp.torrent.all() // Dictionary of hash/torrent object pairs
    { "1234567890": { "name": "my_torrent" } }
    >> btapp.torrent.keys() // A list of all the currently available torrent hashes
    [ "1234567890" ]
    >> btapp.torrent.get("1234567890") // Get a specific torrent object
    { "name": "my_torrent" }

Once you've gotten a torrent object from `btapp.torrent`, there are a lot of
properties that you can access and methods that interact with that torrent. The
metadata that is associated with your torrent object looks something like:

    >> var my_torrent = btapp.torrent.get("1234567890");
    >> my_torrent.hash; // This is the hash of the torrent, and is immutable.
    "1234567890"
    >> my_torrent.start(true) // Start the torrent, if the parameter is true,
                              // force start the torrent.
    >> my_torrent.stop() // Stop the torrent
    >> my_torrent.pause() // Pause the torrent
    >> my_torrent.unpause() // Unpause the torrent
    >> my_torrent.recheck() // Recheck the torrent
    >> my_torrent.remove() // Remove the torrent

Note that torrents will typically be started (or queued) automatically for you
as part of the add operation.

There is also a couple special methods associated with torrent objects:

- properties
- peer
- file

## Properties

The properties methods allows access to a bunch of properties that aren't first
class properties of the torrent object. This allows access to things such as
the torrent's name, status or progress. To access the properties, you can do
something like:

    >> var my_torrent = btapp.torrent.get("1234567890");
    >> my_torrent.properties.all() // All the properties and their values
    { "progress": 1000,
      "download_url": "http://default.com/test.torrent" }
    >> my_torrent.properties.keys() // The names of all the available properties
    [ "progress", "download_url" ]
    >> my_torrent.properties.set("trackers", [ "tracker1", "tracker2" ])
    >> my_torrent.properties.get("progress") // Percentage progress in 0-1000
    1000
    >> my_torrent.properties.get("download_url") // URL the torrent was fetched from
    "http://default.com/test.torrent"

There are actually a lot more parameters than the examples above show. It is
suggested that developers use `my_torrent.properties.keys()` to find all the
available properties. That said, a comprehensive list is:

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

As an example, if you wanted to update a progress bar for all the currently
downloading torrents associated with your application, you could do something
like:

    >> var torrents = btapp.torrents.all();
    >> for (var i in torrents) {
     >   update_progress(torrents[i].name,
     >       torrents[i].properties.get('progress'));
     > });

For those that don't know what the name of a downloaded torrent will be (but do
know the URL the torrent was fetched from), you can just look at
`my_torrent.properties.get('download_url')` and get that metadata for
comparison. An example of this is:

    var my_torrent = bt.torrent.get("1234567890");
    console.log(torrent.properties.get('download_url'));

## Peers

The peers method allows access to all of the peers connected to a torrent
currently. This allows access to the ID of a specific peer. To fetch the peer
objects associated with a specific torrent object, you can:

    >> var my_torrent = btapp.torrent.get("1234567890");
    >> my_torrent.peer.all() // Dictionary of id/peer object pairs
    { "ABCDEFG": { "id": "ABCDEFG", "torrent": my_torrent } }
    >> my_torrent.peer.keys() // List of all the peers connected to this torrent
    [ "ABCDEFG" ]
    >> my_torrent.peer.get("ABCDEFG") // Get a specific peer object
    { "id": "ABCDEFG", "torrent": my_torrent }

Once you've gotten a peer object from `my_torrent.peer`, there are some
properties and methods that allow you to interact with this peer in a sane
fashion.

    >> var my_torrent = btapp.torrent.get("1234567890");
    >> var my_peer = my_torrent.peer.get("ABCDEFG");
    >> my_peer.id // ID of this specific peer
    "ABCDEFG"
    >> my_peer.torrent // The parent torrent
    { "name": "my_torrent" }

Just like with the torrent object, there are some more properties that you can
access via. the `my_peer.properties` methods.

    >> var my_torrent = btapp.torrent.get("1234567890")
    >> var my_peer = my_torrent.peer.get("ABCDEFG")
    >> my_peer.properties.all() // Dictionary of property/value pairs
    { }
    >> my_peer.properties.keys() // Names of all the available properties
    [ ]
    >> my_peer.properties.get() // Get a peer's property
    >> my_peer.properties.set() // Set a specific property for this peer.

## File

The file methods allow access to all the files that are being downloaded as
part of a specific torrent. This allows you to do things such as open or play
files from within your application. To fetch the file objects associated with a
specific torrent, you can:

    >> var my_torrent = btapp.torrent.get("1234567890")
    >> my_torrent.file.all() // Object containing index/object pairs
    { "1": { "name": "test", "torrent": my_torrent } }
    >> my_torrent.file.keys() // List of all the file indexes in this torrent
    [ "1" ]
    >> my_torrent.file.get("1") // Get a specific file object
    { "name": "test", "torrent": my_torrent }

Once you've gotten a file object from `my_torrent.file`, there are some
properties and methods that allow you to interact with this specific file in a
sane fashion.

    >> var my_torrent = btapp.torrent.get("1234567890")
    >> var my_file = my_torrent.file.get("1")
    >> my_file.index
    "1"
    >> my_file.torrent
    my_torrent
    >> my_file.open() // Open (or play) this file for the user
    >> my_file.get_data() // Get the complete binary data of a file

A common use of file objects is to present users with a 'Play' button that
allows them to watch the content they just downloaded. A way to do this is:

    >> var my_torrent = btapp.torrent.get("1234567890")
    >> var files = my_torrent.file.all()
    >> for (var i in files) {
     >     files[i].open()
     > }

Just like with the torrent object, there are some more properties that you can
access via. the `my_file.properties` methods.

    >> var my_torrent = btapp.torrent.get("1234567890")
    >> var my_file = my_torrent.file.get("1")
    >> my_file.properties.all() // Object containing all the property/value pairs
    { "name": "test", "size": 1000 }
    >> my_file.properties.keys() // List of all the property names
    [ "name", "size" ]
    >> my_file.properties.get("name") // Get the value of a specific property
    "test"
    >> my_file.properties.set("name", "foo") // Set the specific property

There are a couple more parameters than the examples above show. It is
suggested that you use `my_file.properties.keys()` to find all the available
properties. That said, a comprehensive list is:

    name: 'test'
    size: 1000 // bytes
    downloaded: 100 // bytes
    priority: 1 // int

As a little example, suppose that you'd like to present a user with a progress
bar for a specific file, you could:

    >> var my_torrent = btapp.torrent.get("1234567890")
    >> var my_file = my_torrent.file.get("1")
    >> update_progress(my_file.properties.get("name"),
     >                 my_file.properties.get("downloaded") / my_file.properties.get("size")

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
