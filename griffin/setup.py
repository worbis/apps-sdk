#!/usr/bin/env python
#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Setup the griffin directory structure.
"""

import json
import optparse
import os
import pkg_resources
import shutil
import sys
import tempfile
import urllib2

import griffin.data

class Project(object):

    dirs = [ 'css', 'html', 'lib', 'src', 'packages' ]

    def __init__(self, name, update_url='http://localhost/default'):
        self.name = name
        self.update_url = update_url
        self.read_package()

    def read_package(self):
        try:
            self.package = json.load(open(os.path.join(self.name,
                                                       'package.json'), 'r'))
        except:
            self.package = {
                'name': self.name,
                'version': '0.1',
                'description': 'The default project.',
                'site': 'http://griffin.bittorrent.com',
                'author': 'Default Author <default@default.com>',
                'keywords': [ 'default' ],
                'bt:publisher': 'Default Publisher',
                'bt:update_url': self.update_url,
                'bt:libs': [
                    'http://10.20.30.79/apps/lib/griffin.pkg'
                    ]
                }

    def update_libs(self, url):
        if not url in self.package['bt:libs']:
            self.package['bt:libs'].append(url)
        self.write_package()

    def create_dirs(self):
        for i in self.dirs:
            os.makedirs(os.path.join(self.name, i))

    def create_btapp(self):
        keys = [ 'name', 'version', 'bt:publisher', 'bt:update_url' ]
        btapp = open(os.path.join(self.name, 'btapp'), 'w')
        for i in keys:
            btapp.write('%s:%s\n' % (i.split(':')[-1],
                                     self.package[i]))
        btapp.close()

    def write_package(self):
        print self.package
        json.dump(self.package,
                  open(os.path.join(self.name, 'package.json'), 'w'),
                  indent=4)

    def create(self):
        self.create_dirs()
        self.write_package()
        self.create_btapp()
        self.create_icon()
        self.create_main()
        for url in self.package['bt:libs']:
            self.add(url)

    def create_icon(self):
        shutil.copy(pkg_resources.resource_filename(
                'griffin.data', 'icon.bmp'),
                    os.path.join(self.name, 'icon.bmp'))

    def create_main(self):
        shutil.copy(pkg_resources.resource_filename(
                'griffin.data', 'main.html'),
                    os.path.join(self.name, 'html', 'index.html'))

    def add(self, url):
        handlers = { '.js': self._add_javascript,
                     '.pkg': self._add_pkg
                     }
        fp, fname = tempfile.mkstemp()
        open(fname, 'w').write(urllib2.urlopen(url).read())
        handlers[os.path.splitext(url)[-1]](fname,
                                            os.path.split(url)[-1])
        self.update_libs(url)

    def _add_javascript(self, source, fname):
        shutil.move(source, os.path.join(self.name, 'packages', fname))

    def _add_pkg(self, source, fname):
        pass

if __name__ == '__main__':
    usage = "usage: %prog [options] name"
    parser = optparse.OptionParser(usage=usage)

    (options, args) = parser.parse_args()

    if len(args) < 1:
        print 'Must include a project name.'
        sys.exit(1)

    Project(args[0]).create()
