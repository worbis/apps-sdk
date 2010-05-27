#
# Copyright (c) 2010 BitTorrent Inc.
#

import json
import logging
import mako.template
import os
import pkg_resources

import griffin.command.base

class generate(griffin.command.base.Command):

    help = 'Generate `index.html` for the project.'

    def run(self):
        self.write_metadata()
        logging.info('\tcreating index.html')
        template = mako.template.Template(
            filename=pkg_resources.resource_filename(
                'griffin.data', 'index.html'))
        index = open(os.path.join(self.project.path, 'index.html'), 'w')
        index.write(template.render(scripts=self._scripts_list(
                    self.project.metadata),
                                    styles=self._styles_list(),
                                    debug=self.vanguard.options.debug))
        index.close()

    def _styles_list(self):
        return [os.path.join('css', x) for x in
                filter(lambda x: os.path.splitext(x)[1] == '.css',
                       os.listdir(os.path.join(self.project.path, 'css')))]

    def _scripts_list(self, metadata):
        handlers = { '.js': self._list_lib,
                     '.pkg': self._list_pkg
                     }
        scripts = []
        for lib in metadata['bt:libs']:
            scripts += filter(lambda x: not x in scripts,
                              handlers[os.path.splitext(lib['url'])[-1]](lib))
        if metadata == self.project.metadata:
            scripts += filter(
                lambda x: not x in scripts,
                [os.path.join('lib', x) for x in
                 os.listdir(os.path.join(self.project.path, 'lib'))])
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
