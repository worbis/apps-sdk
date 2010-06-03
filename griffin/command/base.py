#
# Copyright (c) 2010 BitTorrent Inc.
#

import json
import logging
import os
import re
import shutil
import tempfile
import urllib2
import zipfile
import sys

import griffin.project

class Command(object):

    help = 'Uninteresting command.'
    user_options = []
    option_defaults = {}
    pre_commands = []
    post_commands = []

    def __init__(self, vanguard):
        self.vanguard = vanguard
        self.options = self.vanguard.command_options.get(
            self.__class__.__name__, {})
        for k,v in self.option_defaults.iteritems():
            if not self.options.get(k, None):
                self.options[k] = v
        self.project = griffin.project.Project(self.options.get('name', '.'))

    def run(self):
        logging.error('This command has not been implemented yet.')

    def update_libs(self, name, url):
        if not name in [x['name'] for x in
                        self.project.metadata.get('bt:libs', [])]:
            self.project.metadata['bt:libs'].append({ "name": name, "url": url})
        self.write_metadata()

    def write_metadata(self):
        logging.info('\tupdating project metadata')
        json.dump(self.project.metadata,
                  open(os.path.join(self.project.path, 'package.json'), 'wb'),
                  indent=4)
        keys = [ 'name', 'version', 'bt:publisher', 'bt:update_url',
                 'bt:release_date', 'bt:description' ]
        btapp = open(os.path.join(self.project.path, 'btapp'), 'wb')
        for i in keys:
            btapp.write('%s:%s\n' % (i.split(':')[-1],
                                     self.project.metadata[i]))
        btapp.close()

    def update_deps(self):
        logging.info('\tupdating project dependencies')
        pkg_dir = os.path.join(self.project.path, 'packages')
        try:
            shutil.rmtree(pkg_dir)
        except OSError:
            pass
        os.makedirs(pkg_dir)
        for pkg in self.project.metadata.get('bt:libs', []):
            self.add(pkg['url'])

    def add(self, url, update=True):
        handlers = { '.js': self._add_javascript,
                     '.pkg': self._add_pkg
                     }
        fobj = tempfile.NamedTemporaryFile('wb', delete=False)
        fname = fobj.name
        try:
            logging.info('\tfetching %s ...' % (url,))
            fobj.write(urllib2.urlopen(url).read())
            fobj.close()
        except urllib2.HTTPError:
            print 'The file at <%s> is missing.' % (url,)
            sys.exit(1)
        name = handlers[os.path.splitext(url)[-1]](fname,
                                                   os.path.split(url)[-1])
        os.remove(fname)
        if update:
            self.update_libs(name, url)

    def _add_javascript(self, source, fname):
        shutil.copy(source, os.path.join(self.project.path, 'packages', fname))
        return os.path.splitext(fname)[0]

    def _add_pkg(self, source, fname):
        pkg = zipfile.ZipFile(source)
        pkg_manifest = json.loads(pkg.read('package.json'))
        pkg_root = os.path.join(self.project.path, 'packages',
                                pkg_manifest['name'])
        tmpdir = tempfile.mkdtemp(dir=os.path.join(self.project.path,
                                                   'packages'))
        # Move over the package specific files
        for finfo in pkg.infolist():
            if re.match('lib/.+', finfo.filename):
                pkg.extract(finfo.filename, tmpdir)
        # This is because I'm lazy ....
        shutil.rmtree(pkg_root, True)
        shutil.copytree(os.path.join(tmpdir, 'lib'), pkg_root)
        shutil.rmtree(tmpdir)
        pkg.extract('package.json', pkg_root)
        # Handle the dependencies specifically
        logging.info('\tfetching %s dependencies ...' % (pkg_manifest['name'],))
        for pkg in pkg_manifest.get('bt:libs', []):
            self.add(pkg['url'], False)
        return pkg_manifest['name']
