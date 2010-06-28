---
title: API Specification
layout: default
---

# Overview

The apps api provides applications a method to interface with the BitTorrent
client that an application has been installed within. The API allows sandboxed
access to the client for tasks such as adding a torrent or an rss feed. This
document outlines the raw interface presented by the client. If you'd like a
somewhat more user friendly version, check out the
[SDK](https://github.com/bittorrent/apps-sdk/blob/master/doc/SDK.md).

For those that prefer to look at code instead of documentation, take a look at
[api.js](https://github.com/bittorrent/apps-sdk/blob/master/doc/api.js).

This document will be using a specific style to introduce the api. Look at each
code block as a javascript interpreter. The lines that have either `>>` or `>`
on the front of them are user input to the interpreter and the lines without
anything are output from the interpreter.

# Sandbox

All applications live inside a sandbox. This means that, by default, your
application will only be able to access torrents and rss feeds that it added
to the client itself. Currently, there are two permissions levels which can be
set to override this restriction.

These permissions levels are accessed by setting the bt:access peroperty in
package.json to the following options:

- list_restricted

The application gains read access to the properties of all of the user's torrents regardless of origin

- restricted

The application gains read and write access to the properties of all torrents
regardless of origin

On app install, users are prompted as to whether they want to allow elevated
access to your application. If they do not want to allow elevated permissions,
the app will not be installed.

Note that it is not possible to access registered events and stash data from
one app to another.

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

    >> btapp.add.torrent('http://example.com/test.torrent') // Add a torrent by url, file path or magnet link
    >> btapp.add.rss_feed() // Add a rss feed by url
    >> btapp.add.rss_filter() // Add an rss filter

Note that add operations are asynchronous. If you'd like to get the results of
add events, you must bind an event. When adding torrents, you probably want
something like:

    >> function result(status) { console.log(status.message); }
    >> btapp.events.set('torrent', result);
    >> btapp.add.torrent('http://example.com/test.torrent');

If the torrent can be added successfully, your registered callback will be
called with an object that looks like:

    { "status": 404, // HTTP error code
      "message": "error",
      "url": "http://example.com/test.torrent",
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

There are also a couple special methods associated with torrent objects:

- properties
- peer
- file

## Properties

The properties methods allow access to a bunch of properties that aren't first
class properties of the torrent object. This allows access to things such as
the torrent's name, status or progress. To access the properties, you can do
something like:

    >> var my_torrent = btapp.torrent.get("1234567890");
    >> my_torrent.properties.all() // All the properties and their values
    { "progress": 1000,
      "download_url": "http://example.com/test.torrent" }
    >> my_torrent.properties.keys() // The names of all the available properties
    [ "progress", "download_url" ]
    >> my_torrent.properties.set("trackers", [ "tracker1", "tracker2" ])
    >> my_torrent.properties.get("progress") // Percentage progress in 0-1000
    1000
    >> my_torrent.properties.get("download_url") // URL the torrent was fetched from
    "http://example.com/test.torrent"

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
     >                 my_file.properties.get("downloaded") / my_file.properties.get("size") * 100 )

# RSS Feeds

All the RSS feeds available to your sandbox can be fetched
via. `btapp.rss_feed` methods. After an RSS feed has been added to the client,
its object can be fetched from `btapp.rss_feed`. Once an RSS feed object has
been fetched, you can do things with it such as remove it or force it to
update.

To access the rss feed objects in your sandbox:

    >> btapp.rss_feed.all() // Object containing the id/object pairs for rss feeds
    { "1": { "id": "1" } }
    >> btapp.rss_feed.keys() // List of all the currently available rss feed ids
    [ "1" ]
    >> btapp.rss_feed.get("1") // Get a specific rss feed object

Remember that feeds you've added from within your application will also show up
in the RSS feeds section of the client and be associated with your
application. This means that when users uninstall your application, the RSS
feed will be removed as well.

Once you've gotten a RSS feed object from `btapp.rss_feed`, there are some
properties and methods that you can access to interact with the feed. This
looks something like:

    >> var my_feed = btapp.rss_feed.get("1")
    >> my_feed.id
    "1"
    >> my_feed.force_update() // Don't wait for the next update, do it now
    >> my_feed.remove() // Remove this feed

There are also a couple special methods associated with rss feed objects:

- properties
- item

## Properties

The properties methods allow access to a bunch of properties that aren't first
class properties of the feed object. This allows access to things such as the
feed's url and update status. To access the properties, you can do something
like:

    >> var my_feed = btapp.rss_feed.get("1")
    >> my_feed.properties.all() // All the properties and their values
    { "enabled": true, "url": "http://rss.example.com" }
    >> my_feed.properties.keys() // The names of all the available properties
    [ "enabled", "url" ]
    >> my_feed.properties.get("enabled") // Get a specific property's value
    true
    >> my_feed.properties.set("enabled", false) //Set the value for a property

There are actually a couple more parameters than the examples above show. It is
suggested that you use `my_feed.properties.keys()` to find all the available
properties. That said, a comprehensive list is:

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

## Item

The item methods allow access to all the items that are associated with a
specific RSS feed. These item objects allow you to look into what exactly the
RSS feed is fetching. To fetch the item objects associated with a specific feed
object, you can:

    >> var my_feed = btapp.rss_feed.get("1")
    >> my_feed.item.all() // Object containing id/object pairs for items
    { "1": { "id": "1", "feed", my_feed } }
    >> my_feed.item.keys() // List of all the items associated with this feed
    [ "1" ]
    >> my_feed.item.get("1") // Get a item object
    { "id": "1", "feed": my_feed }

Once you've gotten an item object from `my_feed.item`, there are a couple
properties that allow you to figure out what's going on with this item:

    >> var my_feed = btapp.rss_feed.get("1")
    >> var my_item = my_feed.item.get("1")
    >> my_item.feed // The parent feed object
    my_feed
    >> my_item.id // The ID of this item
    "1"

Just like with the feed object, there are some more properties that you can
access via. the `my_feed.properties` methods.

    >> var my_feed = btapp.rss_feed.get("1")
    >> var my_item = my_feed.item.get("1")
    >> my_item.properties.all() // Object containing all the property/value pairs
    { "name": "test", "url": "http://example.com/test.torrent" }
    >> my_item.properties.keys() // List of all the available properties
    [ "name", "url" ]
    >> my_item.properties.get("name") // Get a property value
    "test"
    >> my_item.properties.set() // Set a property's value

There are actually a couple more parameters than the examples above show. It is
suggested that you use `my_item.properties.keys()` to find all the available
properties. That said, a comprehensive list is:

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

Sometimes, websites provide RSS feeds instead of JSON compatible sources for
consumption. It is possible to take this RSS data and render your entire
application around it. The entire process would look something like this:

    >> btapp.add.rss_feed("http://example.com/rss.xml")
    >> var my_feed = btapp.rss_feed.get("1")
    >> my_feed.force_update()
    >> var items = my_feed.item.all()
    >> for (var i in items) {
     >    render_item(items[i].properties.get('name'),
     >                items[i].properties.get('url'))
     > }

# RSS Filters

All the RSS filters available to your sandbox can be fetched
via. `btapp.rss_filter` methods. After an RSS filter has been added to the
client, its object can be fetched from `btapp.rss_filter`. Once an RSS filter
object has been fetched, you can do things with it such as removing it or
checking the properties associated with it.

To access the rss filter objects in your sandbox:

    >> btapp.rss_filter.all() // Object containing the id/object pairs for rss filters
    { "1": { "id": "1" } }
    >> btapp.rss_filter.keys() // List of all the currently available rss filter ids
    [ "1" ]
    >> btapp.rss_filter.get("1") // Get a specific rss filter object

Remember that the filters you've added from within your application will also
show up in the RSS filters section of the client and be associated with your
application. This means that when users uninstall your application, the RSS
filter will be removed as well.

Once you've gotten an RSS filter object from `btapp.rss_filter`, there are some
properties and methods that you can access to interact with the filter. This
looks something like:

    >> var my_filter = btapp.rss_filter.get("1")
    >> my_filter.id
    "1"
    >> my_filter.remove()

There is also a set of special methods associated with filter objects:

- properties

## Properties

The properties methods allow access to a bunch of properties that aren't first
class properties of the filter object. This allows access to things such as the
filter's regex or label. To access the properties, you can do something like:

    >> var my_filter = btapp.rss_filter.get("1")
    >> my_filter.properties.all()
    { "filter": "^.*$", "label": "default" }
    >> my_filter.properties.keys()
    [ "filter", "label" ]
    >> my_filter.properties.get("label")
    "default"
    >> my_filter.properties.set("label", "foobar")

There are actually quite a few properties available than the examples shown
above. It is suggested that you use `my_filter.properties.keys()` to find all
the available properties. That said, a comphrensive list is:

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

Almost everything in javascript is setup to be asynchronous. Since many
BitTorrent operations are also asynchronous, this is a great match. The
`btapp.events` methods allow callbacks to be registered for arbitrary
events. You can then have actions correspond to these events. The events
framework allows for your application to be notified whether adding a torrent
was successful or not. To interact with the events in your client:

    >> btapp.events.all()
    { 'torrent': function() {} }
    >> btapp.events.keys()
    [ 'torrent' ]
    >> btapp.events.get('torrent')
    function() { }
    >> btapp.events.set('torrent', function() { alert('torrent event') })

As an example, if you wanted to have notification of when a client actually
added a torrent, you can do something like:

    >> function notify(status) {
     >    if (status.message == 'success') alert('added!');
     >    else alert('failure: ' + status.code);
     > }
    >> btapp.events.set('torrent', notify)
    >> btapp.add.torrent('http://example.com/test.torrent')

# Stash

To provide a more desktop application style experience, there are many times
where it makes sense to save arbitrary data that can be accessed or modified
from within your application. For any applications fetching remote data, this
is especially useful. Instead of waiting the time that it takes to retrieve
your remote resource, you can just display the previous values (fetched from
the stash) and then update once the remote resource returns a response. Like
most other interfaces in this API, you can access the stash like:

    >> btapp.stash.all()
    { "state": "default", "data": "default" }
    >> btapp.stash.keys()
    [ "state", "data" ]
    >> btapp.stash.get("data")
    "default"
    >> btapp.stash.set("data", "foobar")

Note that the stash requires you use a string as values. Javascript objects can
be serialized to JSON first (and the SDK helpers actually do this for you,
check out the
[SDK](https://github.com/bittorrent/apps-sdk/blob/master/doc/SDK.md)).

Among other things, the stash allows you to save your application's state
between application restarts. Any kind of network operation should have its
results saved to the stash so that users can see results as quickly as possible
when starting your application.

# Resources

To access arbitrary resources inside the btapp package itself, you can get a
string representation of them by:

    >> btapp.resource('my_path')
    "Text inside the file my_path"

