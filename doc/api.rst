----
API
----

Overview
========

The Griffin API provides applications a method to interface with the BitTorrent
client the application has been installed within. The API allows sandboxed
access to the client for tasks such as adding a torrent or an rss feed.

Sandbox
=======

All applications live inside a sandbox. This means that your application will
only be able to access torrents and rss feeds that it added to the client
itself. The application's events and stash are also specific to the
application and cannot be accessed from another application.

Properties
==========

Available properties:

  - peer_id = "local_client" // This is the peer ID of your own client.

Settings
========

Access the client's settings at bt.settings. This will allow you to access all
the client settings allowed in your current sandbox. If a property is read
only, a ReadOnlyException will be thrown.

::

  bt.settings.all() -> dictionary of key/value pairs
  bt.settings.keys() -> list of all the settings names available.
  bt.settings.get(name) -> get a specific setting
  bt.settings.set(name, value) -> set a specific setting

Add
===

Add a variety of elements to the client.

::

  bt.add.torrent() -> add a torrent by url, file path or magnet link
  bt.add.rss_feed() -> Add a rss feed by url
  bt.add.rss_filter() -> Add an rss filter

Torrents
========

Access all operations that have to do with torrents at bt.torrent. This will
allow you to see metadata about the torrents that your application has
added. The sandbox restricts the torrents that you're available to see down to
only the ones that your application added.

::


  bt.torrent.all() -> dictionary of hash/torrent object pairs
  bt.torrent.keys() -> list of all the currently available torrent hashes
  bt.torrent.get(hash) -> get a specific torrent object

Object
~~~~~~

The torrent object is returned by bt.torrent.all/get. This object allows you to
look into the metadata associated with this torrent.

::

  hash: 'SHA' // This is meant to be the primary key and is immutable.
  start: function(force)
    /*
     * force -> Instead of waiting to start, forces a start immediately.
     */
  stop: function()
  pause: function() 
  unpause: function() 
  recheck: function() 
  remove: function() 

In addition to these parameters and functions, there are three objects
associated with torrent objects:

  - properties - The properties associated with this torrent.
  - peer - The peers associated with this torrent.
  - file - The files associated with this torrent.

Properties
**********

For a discussion of the methods that the torrent's properties implements, take
a look at _`General Properties`.

The properties specific to a torrent are:

::

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

Peers
*****

From torrent_obj.peer, you can access all the peers that are associated with
a specific torrent itself via the normal means.

::

  torrent_obj.peer.all() -> dictionary of id/peer object pairs
  torrent_obj.peer.keys() -> list of all the peers connected to this torrent
  torrent_obj.peer.get(id) -> get a specific peer object

A peer object is returned by torrent_obj.peer.all/get. These objects can be
used to get the metadata of a connected peer.

::

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

In addition to these parameters and functions, there is another object
associated with the peer object.

  - properties

For a discussion of the methods that the peer's properties implements, take
a look at _`General Properties`.

The properties specific to a peer are:

::

  location: 'US' // country code

Files
*****

From torrent_obj.file, you can access all the files that are associated with a
specific torrent via. the normal means.

::

  torrent_obj.file.all() -> dictionary of index/file object pairs
  torrent_obj.file.keys() -> list of all the file indexes in this torrent
  torrent_obj.file.get(index) -> get a specific file object

A file object is returned by torrent_obj.file.all/get. These objects can be
used to get the metadata of a specific file.

::

  torrent = torrent_obj // The parent torrent
  index: 1 // Index of this file in the torrent
  get_data: function() // Get the complete binary data of a file
    /*
     * Note that this is meant for small files and thusly there is a size limit
     * on how large a file can be.
     */

In addition to these parameters and functions, there is another object
associated with the file object.

  - properties

For a discussion of the methods that the file's properties implements, take a
look at _`General Properties`.

The properties specific to a file are:

::
  
  name: 'test'
  size: 1000 // bytes
  downloaded: 100 // bytes
  priority: 1 // int

RSS Feeds
=========

Access all operations that have to do with rss feeds at bt.rss_feed. This will
allow you to access metadata about the rss feeds that you have added. The
sandbox restricts the rss feeds that you're available to see down to only the
ones that your application added.

::

  bt.rss_feed.all() -> dictionary of id/rss feed object pairs
  bt.rss_feed.keys() -> list of all the currently available rss feed ids
  bt.rss_feed.get(id) -> get a specific rss feed object

Object
~~~~~~

The rss feed object is returned by bt.rss_feed.all/get. This object allows you
to look into the metadata associated with the rss feed.

::

  id: 1 // This is meant to be a primary key and is immutable.
  remove: function() // Remove this feed.
  force_update: function() // Don't wait until the next update time, do it now

In addition to these parameters and functions, there are two other objects
associated with rss feed objects:

  - properties - The properties associated with this rss feed.
  - item - An item associated with this rss feed.

Properties
**********

For a discussion of the methods that the rss feed's properties implements, take
a look at _`General Properties`.

The properties specific to an rss feed are:

::

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

Items
*****

From rss_feed_obj.item, you can access all the items that are associated with a
specific rss_feed itself via the normal means.

::

  rss_feed_obj.all() -> dictionary of id/item object pairs
  rss_feed_obj.keys() -> list of all the peers connected to this torrent
  rss_feed_obj.get(id) -> get a specific item from this feed

An item object is returned by rss_feed_obj.all/get. These objects can be used
to get the metadata of an rss feed's item.

::

  feed: rss_feed_obj // The parent rss feed
  id: 1 // ID of this specific feed

In addition to these parameters and functions, there are two other objects
associated with rss feed item objects:

  - properties - The properties associated with this rss feed item.

For a discussion of the methods that the item's properties implements, take a
look at _`General Properties`.

The properties specific to an item are:

::

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

RSS Filters
===========

Access all operations that have to do with rss filters at bt.rss_filter. This
will allow you to access metadata about the rss filters that you have
added. The sandbox restricts the rss filters that you're available to see down
to only the ones that your application added.

::

  bt.rss_filter.all() -> dictionary of id/rss filter object pairs
  bt.rss_filter.keys() -> list of all the currently available rss filter ids
  bt.rss_filter.get(id) -> get a specific rss filter object

Object
~~~~~~

The rss filter object is returned by bt.rss_filter.all/get. This object allows
you to look into the metadata associated wit the rss filter.

::

  id: 1 // This is meant to be a primary key and is immutable.
  remove: function() // Remove this filter.

In addition to these parameters and functions, there is one other object
associated with rss filter objects:

  - properties - The properties associated with this rss filter.

For a discussion of the methods that the rss filter's properties implements,
take a look at _`General Properties`.

The properties specific to an rss filter are:

::

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

Events
======

Access all operations that have to do with client generated events at
bt.events. Events are special operations that allow the client to notify an
application of a specific action that has occurred. Some events are torrent
completion and message received. The methods that you can use to interact with
events are:

::

  bt.events.all() -> All available events in name/callback pairs
  bt.events.keys() -> Name of all the events available to this application
  bt.events.get(name) -> Get a callback that has been bound to a specific event
  bt.events.set(name, callback) -> Bind a callback to a specific event

Stash
=====

The stash allows applications to save state between uses. Any data in the JSON
format can be saved to the stash. On startup, any data that has been saved to
the stash previously can be recovered. To manipulate the stash, you can use
these methods:

::

  bt.stash.all() -> All the data stored in the stash in key/value pairs
  bt.stash.keys() -> The keys of all data stored in the stash
  bt.stash.get(key) -> The JSON decoded data of a specific key
  bt.stash.set(key, value) -> A key and JSON serializable value to save to the 
                              stash.

General Properties
==================

There are four methods that all properties objects have:

::

  all: function() // Get all the properties associated with this object.
  keys: function() // Get only the names of the properties associated with 
                   // this object.
  get: function(name) // Get a specific property's value from this object.
  set: function(name, value) // Set a specific property's value for this object.

Note that the API suggests what properties might be returned, but to really
know what actually is being returned, it is suggested that the developer should
introspect bt.settings.all() or bt.settings.keys() to discover what settings
their application can actually see.  
