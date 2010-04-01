----
API
----

Overview
========

- bt namespace is what everything lives under.
- sandbox

Sandbox
=======

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

Available properties:

  - peer_id = "local_client" // This is the peer ID of your own client.

Torrents
========

Access all operations that have to do with torrents at bt.torrent. This will
allow you to add torrents as well as see metadata about those torrents that you
added. The sandbox restricts the torrents that you're available to see down to
only the ones that your application added.

::

  bt.torrent.add() -> add a torrent by url, file path or magnet link
  bt.torrent.all() -> dictionary of hash/torrent object pairs
  bt.torrent.keys() -> list of all the currently available torrent hashes
  bt.torrent.get(hash) -> get a specific torrent object

Object
~~~~~~

The torrent object is returned by bt.torrent.all/get. This object allows you to
look into the metadata associated with this torrent.

::

  hash = 'SHA' // This is meant to be the primary key and is immutable.
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
a look at _General Properties.

The properties specific to a torrent are:

   - trackers // [ "tracker1", "tracker2" ]
   - upload_limit // bytes/second
   - download_limit // bytes/second
   - superseed // not_allowed/disabled/enabled
   - dht // not_allowed/disabled/enabled
   - pex // not_allowed/disabled/enabled
   - seed_override // not_allowed/disabled/enabled
   - seed_ratio: 0.1 // percentage
   - seed_time: 100 // seconds
   - ulslots // maximum upload slots
   - status // paused/started/seeding
   - name: 'My Torrent'
   - size: 100 // bytes
   - progress: 0.50 // percentage
   - downloaded: 50 // bytes
   - uploaded: 100 // bytes
   - ratio: 2.0 // percentage
   - upload_speed: 1000 // bytes/second
   - download_speed: 1000 // bytes/second
   - eta: 10 // seconds
   - label: 'test label'
   - peers_connected: 10 // peers
   - peers_in_swarm: 10 // peers
   - seeds_connected: 10 // seeds
   - seeds_in_swarm: 10 // seeds
   - availability: 0.50 // percentage
   - queue_order: 1
   - remaining: 50 // bytes
   - download_url: 'http://utorrent.com'
   - rss_feed_url: 'rss://rss.utorrent.com'

Peers
*****

From torrent_obj.peer, you can access all the peers that are associated with
the torrent itself via the normal means.

::

  torrent_obj.peer.all() -> dictionary of id/peer object pairs
  torrent_obj.peer.keys() -> list of all the peers connected to this torrent
  torrent_obj.peer.get(id) -> get a specific peer object

A peer object is returned by torrent_obj.peer.all/get. These objects can be
used to get the metadata of a connected peer.

::

  torrent = torrent_obj // The parent torrent
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

Files
*****

RSS Feeds
=========

RSS Filters
===========

Events
======

Stash
=====

General Properties
==================

Note that the API suggests what properties might be returned, but to really
know what actually is being returned, it is suggested that the developer should
introspect bt.settings.all() or bt.settings.keys() to discover what settings
their application can actually see.  
