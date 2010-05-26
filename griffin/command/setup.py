#
# Copyright (c) 2010 BitTorrent Inc.
#

import logging
import os
import pkg_resources
import shutil
import sys

import griffin.command.base

class setup(griffin.command.base.Command):

    dirs = [ 'css', 'html', 'lib', 'packages' ]
    user_options = [ ('name=', None, 'Name of the project to create.', None) ]

    def create_dirs(self):
        for i in self.dirs:
            os.makedirs(os.path.join(self.project.path, i))

    def move_defaults(self):
        shutil.copy(pkg_resources.resource_filename('griffin.data', '.ignore'),
                    os.path.join(self.project.path, '.ignore'))
        shutil.copy(pkg_resources.resource_filename(
                'griffin.data', 'icon.bmp'),
                    os.path.join(self.project.path, 'icon.bmp'))
        shutil.copy(pkg_resources.resource_filename(
                'griffin.data', 'main.html'),
                    os.path.join(self.project.path, 'html', 'index.html'))

    def run(self):
        if not self.options.get('name', None):
            logging.error('Must use the `--name` option to name the project.')
            sys.exit(1)
        if os.path.exists(self.project.path):
            logging.error('The project already exists. Remove it if ' \
                              'you\'d like to create it again.')
            sys.exit(1)
        self.create_dirs()
        self.write_metadata()
        self.move_defaults()
        self.update_deps()
        os.chdir(self.project.path)
        self.vanguard.run_command('generate')