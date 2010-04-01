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

::

  peer_id = "local_client" // This is the peer ID of your own client.

Note that the API suggests what properties might be returned, but to really
know what actually is being returned, it is suggested that the developer should
introspect bt.settings.all() or bt.settings.keys() to discover what settings
their application can actually see.  

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

Peers
*****

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
