#!/usr/bin/env python
#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Setup the griffin directory structure.
"""

import optparse
import os
import pkg_resources
import shutil
import sys

import griffin.data

class Project(object):

    dirs = [ 'css', 'html', 'lib', 'src' ]

    def __init__(self, name, update_url='http://localhost'):
        self.name = name
        self.update = update

    def create_dirs(self):
        for i in self.dirs:
            os.makedirs(os.path.join(self.name, i))

    def create_btapp(self):
        btapp = open(os.path.join(self.name, 'btapp'), 'w')
        for i in ['name', 'update_url']:
            btapp.write('%s:%s\n' % (i, getattr(self, i)))
        btapp.close()

    def sample(self):
        self.create_dirs()
        self.create_btapp()
        self.create_icon()
        self.create_main()
        self.create_javascript()

    def create_icon(self):
        shutil.copy(pkg_resources.resource_filename(
                griffin.data, 'icon.bmp'), 'icon.bmp')

    def create_main(self):
        shutil.copy(pkg_resources.resource_filename(
                griffin.data, 'main.html'), 'main.html')

    def create_javascript(self):


if __name__ == '__main__':
    usage = "usage: %prog [options] name"
    parser = optparse.OptionParser(usage=usage)

    (options, args) = parser.parse_args()

    if not args[0]:
        print 'Must include a project name.'
        sys.exit(1)
