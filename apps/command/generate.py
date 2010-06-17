#
# Copyright (c) 2010 BitTorrent Inc.
#

import json
import logging
import mako.template
import os
import pkg_resources

import apps.command.base

class generate(apps.command.base.Command):

    help = 'Generate `index.html` for the project.'
    excludes = [ os.path.join('packages', 'firebug.js'),
                 os.path.join('lib', 'index.js') ]

    def run(self):
        self.write_metadata()
        logging.info('\tcreating index.html')
        # Remove the ./ from the beginning of these paths for use in filter
        self.flist = [x[2:] for x in self.file_list()]
        #self.flist = self.file_list()
        template = mako.template.Template(
            filename=pkg_resources.resource_filename(
                'apps.data', 'index.html'), cache_enabled=False)
        index = open(os.path.join(self.project.path, 'build', 'index.html'),
                     'wb')
        index.write(template.render(scripts=self._scripts_list(
                    self.project.metadata),
                                    styles=self._styles_list(),
                                    debug=self.vanguard.options.debug))
        index.close()

    def _styles_list(self):
        path = os.path.join(self.project.path, 'css');
        if os.path.exists(path):
            return [os.path.join('css', x).replace('\\', '/') for x in
                    filter(lambda x: os.path.splitext(x)[1] == '.css',
                           os.listdir(path))]
        return []

    def filter(self, existing, lst):
        return filter(lambda x: not x in existing and not x in self.excludes \
                          and x in self.flist,
                      lst)

    def _scripts_list(self, metadata):
        handlers = { '.js': self._list_lib,
                     '.pkg': self._list_pkg
                     }
        scripts = []
        for lib in metadata.get('bt:libs', []):
            scripts += self.filter(scripts,
                [x.replace('/', os.path.sep) for x in
                 handlers[os.path.splitext(lib['url'])[-1]](lib)])
        if metadata == self.project.metadata:
            scripts += self.filter(scripts,
                [os.path.join('lib', x) for x in
                 filter(lambda x: os.path.splitext(x)[1] == '.js',
                        os.listdir(os.path.join(self.project.path, 'lib')))])
            scripts.append(os.path.join('lib', 'index.js'))
        scripts = [x.replace('\\', '/') for x in scripts]
        return scripts

    def _list_lib(self, lib):
        return [os.path.join('packages', os.path.split(lib['url'])[-1])]

    def _list_pkg(self, pkg):
        pkg_scripts = self._scripts_list(
            json.load(open(os.path.join(self.project.path,
                                        'packages', pkg['name'],
                                        'package.json'))))
        pkg_scripts += [
            os.path.join('packages', pkg['name'], x) for x in
            filter(lambda x: x != 'package.json', os.listdir(os.path.join(
                        self.project.path, 'packages',
                        pkg['name'])))]
        return pkg_scripts
