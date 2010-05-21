#!/usr/bin/env python
#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Setup the griffin directory structure.
"""

import json
import mako.template
import optparse
import os
import pkg_resources
import shutil
import sys
import tempfile
import urllib2
import zipfile

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
                'bt:release_date': '00/00/0000',
                'bt:description': 'This is the default app.',
                'bt:libs': [
                    { 'name': 'griffin',
                      'url': 'http://10.20.30.79/apps/lib/griffin.pkg' }
                    ]
                }

    def update_libs(self, name, url):
        if not name in [x['name'] for x in self.package['bt:libs']]:
            self.package['bt:libs'].append({ "name": name, "url": url})
        self.write_package()

    def create_dirs(self):
        for i in self.dirs:
            os.makedirs(os.path.join(self.name, i))

    def create_btapp(self):
        keys = [ 'name', 'version', 'bt:publisher', 'bt:update_url',
                 'bt:release_date', 'bt:description' ]
        btapp = open(os.path.join(self.name, 'btapp'), 'w')
        for i in keys:
            btapp.write('%s:%s\n' % (i.split(':')[-1],
                                     self.package[i]))
        btapp.close()

    def write_package(self):
        json.dump(self.package,
                  open(os.path.join(self.name, 'package.json'), 'w'),
                  indent=4)

    def create(self):
        if os.path.exists(self.name):
            print 'The project already exists. Remove it if ' \
                         'you\'d like to create it again.'
            sys.exit(1)
        self.create_dirs()
        self.write_package()
        self.create_btapp()
        self.create_icon()
        self.create_main()
        for pkg in self.package['bt:libs']:
            self.add(pkg['url'])
        self.index()

    def create_icon(self):
        shutil.copy(pkg_resources.resource_filename(
                'griffin.data', 'icon.bmp'),
                    os.path.join(self.name, 'icon.bmp'))

    def create_main(self):
        shutil.copy(pkg_resources.resource_filename(
                'griffin.data', 'main.html'),
                    os.path.join(self.name, 'html', 'index.html'))

    def add(self, url, update=True):
        handlers = { '.js': self._add_javascript,
                     '.pkg': self._add_pkg
                     }
        fp, fname = tempfile.mkstemp()
        try:
            open(fname, 'w').write(urllib2.urlopen(url).read())
        except urllib2.HTTPError:
            print 'The file at <%s> is missing.' % (url,)
            sys.exit(1)
        name = handlers[os.path.splitext(url)[-1]](fname,
                                                   os.path.split(url)[-1])
        if update:
            self.update_libs(name, url)

    def _add_javascript(self, source, fname):
        shutil.move(source, os.path.join(self.name, 'packages', fname))
        return os.path.splitext(fname)[0]

    def _add_pkg(self, source, fname):
        pkg = zipfile.ZipFile(source)
        pkg_manifest = json.loads(pkg.read('package.json'))
        pkg_root = os.path.join(self.name, 'packages', pkg_manifest['name'])
        tmpdir = tempfile.mkdtemp(dir=os.path.join(self.name, 'packages'))
        # Move over the package specific files
        for finfo in pkg.infolist():
            if 'lib' == finfo.filename[:3]:
                pkg.extract(finfo.filename, tmpdir)
        # This is because I'm lazy ....
        shutil.copytree(os.path.join(tmpdir, 'lib'), pkg_root)
        shutil.rmtree(tmpdir)
        pkg.extract('package.json', pkg_root)
        # Handle the dependencies specifically
        for pkg in pkg_manifest['bt:libs']:
            self.add(pkg['url'], False)
        return pkg_manifest['name']

    def index(self):
        template = mako.template.Template(
            filename=pkg_resources.resource_filename(
                'griffin.data', 'index.html'))
        index = open(os.path.join(self.name, 'index.html'), 'w')
        index.write(template.render(scripts=self._scripts_list(self.package),
                                    styles=self._styles_list()))
        index.close()

    def _styles_list(self):
        return [os.path.join('css', x) for x in
                filter(lambda x: os.path.splitext(x)[1] == '.css',
                       os.listdir(os.path.join(self.name, 'css')))]

    def _scripts_list(self, package):
        handlers = { '.js': self._list_lib,
                     '.pkg': self._list_pkg
                     }
        scripts = []
        for lib in package['bt:libs']:
            scripts += filter(lambda x: not x in scripts,
                              handlers[os.path.splitext(lib['url'])[-1]](lib))
        if package == self.package:
            scripts += filter(lambda x: not x in scripts,
                              [os.path.join('lib', x) for x in
                               os.listdir(os.path.join(self.name, 'lib'))])
        return scripts

    def _list_lib(self, lib):
        return [os.path.join('packages', os.path.split(lib['url'])[-1])]

    def _list_pkg(self, pkg):
        pkg_scripts = self._scripts_list(
            json.load(open(os.path.join(self.name, 'packages', pkg['name'],
                                   'package.json'))))
        pkg_scripts += [os.path.join('packages', pkg['name'], x) for x in
                        filter(lambda x: x != 'package.json',
                               os.listdir(os.path.join(self.name, 'packages',
                                                       pkg['name'])))]
        return pkg_scripts



if __name__ == '__main__':
    usage = "usage: %prog [options] name"
    parser = optparse.OptionParser(usage=usage)

    (options, args) = parser.parse_args()

    if len(args) < 1:
        print 'Must include a project name.'
        sys.exit(1)

    Project(args[0]).create()
