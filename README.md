# Overview

The [Apps for BitTorrent SDK](/apps-sdk) is a collection of tools, libraries and
documentation to make the process of creating, authoring and testing apps as
easy as possible.

# Installation

The easiest way to get up and running on Windows, is by running the [SDK
installer](client/apps-sdk-installer.msi).
To see the other ways that you can install the SDK tools, check out the
[howto](doc/install-howto.html).

### Your First App

    $ apps setup --name=hello-world
    $ cd hello-world
    $ apps serve

Open http://localhost:8080/ in your browser. If you'd like to see this in the
&micro;Torrent client, run:

    $ apps package

and, double click `dist/hello-world.btapp`. The app should now show up in your
client under "Apps" in the left bar.

## Next Steps

- [Tutorials](doc/tutorials)
- [Examples](examples/)
- [API](doc/api.html)

# Help

- [Documentation](doc/)
- [Forums](http://forum.utorrent.com/viewforum.php?id=34)
- [IRC](irc://irc.freenode.net#btapps-sdk): <span style="float:right">irc://irc.freenode.net#btapps-sdk</span>
- [Feedback](mailto:btapps-sdk@bittorrent.com): <span style="float:right">btapps-sdk@bittorrent.com</span>
- [Issue Tracker](https://github.com/bittorrent/apps-sdk/issues)

# Download

You can download the source, tools, documentation and examples in either
[zip](http://github.com/bittorrent/apps-sdk/zipball/master) or
[tar](http://github.com/bittorrent/apps-sdk/tarball/master) formats.

You can also clone the project with [Git](http://git-scm.com/) by running:

    $ git clone git://github.com/bittorrent/apps-sdk
