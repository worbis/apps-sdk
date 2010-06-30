---
layout: default
title: Tool Installation Howto
---

# Windows

### Normal

To install on Windows, run the [tools installer](/apps-sdk/client/apps-sdk-installer.msi).

### Contribution

If you'd like to contribute to the project (or just skip running the
installer), there are a couple dependencies:

- [Python 2.6](http://www.python.org/ftp/python/2.6/python-2.6.msi)
- [Setuptools](http://pypi.python.org/packages/2.6/s/setuptools/setuptools-0.6c11.win32-py2.6.exe#md5=1509752c3c2e64b5d0f9589aafe053dc)

After you've installed those two, make sure Python is on your path:

    $ export PATH=/c/Python26:/c/Python26/Scripts:$PATH

Now, download and extract the [project's
zip](http://github.com/bittorrent/apps-sdk/zipball/master). Enter that
directory and run:

    $ python setup.py install

And, you're ready to go!

# Linux & Mac OS X

The prerequisites for the build tools are Python 2.6 and setuptools. Install
those using your operating system's package manager.

Once you have python and setuptools installed, you can just run:

    $ easy_install http://staging.apps.bittorrent.com/pkgs/apps-0.1-py2.6.egg

You should now be ready to go.
