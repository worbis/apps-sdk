---
title: Apps for BitTorrent SDK
layout: default
foo: bar
---

# Getting Started

The easiest way to get up and running is by running the [SDK
installer](https://github.com/bittorrent/apps-sdk/raw/master/client/apps-sdk-installer.msi).
To see the other ways that you can install the SDK tools, check out the
[howto](doc/install-howto.html).

### Your First App

    $ apps setup --name=hello-world
    $ cd hello-world
    $ apps serve

Open http://localhost:8080/ in your browser. If you'd like to see this in your
client:

    $ apps package

And, double click `dist/hello-world.btapp`. The app should now show up in your
&micro;Torrent client.

## Next Steps

- [Tutorials](doc/tutorials)
- [API](doc/api.html)

# Help

- [FAQ](doc/FAQ.html)
- [Documentation](doc/)
- [Wiki](https://github.com/bittorrent/apps-sdk/wikis)
- [Forums](http://forum.utorrent.com/viewforum.php?id=33)
- [IRC](irc://irc.freenode.net#apps-sdk): <span style="float:right">irc://irc.freenode.net#apps-sdk</span>
- [Feedback](mailto:apps-sdk@bittorrent.com): <span style="float:right">apps-sdk@bittorrent.com</span>
- [Issue Tracker](https://github.com/bittorrent/apps-sdk/issues)

# Download

You can download the source, tools, documentation and examples in either
[zip](http://github.com/bittorrent/apps-sdk/zipball/master) or
[tar](http://github.com/bittorrent/apps-sdk/tarball/master) formats.

You can also clone the project with [Git](http://git-scm.com/) by running:

    $ git clone git://github.com/bittorrent/apps-sdk
