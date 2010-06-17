#
# Copyright (c) 2010 BitTorrent Inc.
#

import fnmatch
import os
import re
import zipfile

import apps.command.base

class package(apps.command.base.Command):

    help = 'Package the project into a .btapp file.'
    user_options = [
        ('path=', None, 'full path to place the package in.', None) ]
    option_defaults = { 'path': 'dist' }
    pre_commands = [ 'generate' ]

    def run(self):
        path = self.options['path']
        try:
            os.makedirs(path)
        except:
            pass
        btapp = zipfile.ZipFile(open(os.path.join(path, '%s.btapp' % (
                    self.project.metadata['name'],)), 'wb'), 'w')
        for f in self.file_list():
            # Files in the build/ directory are auto-created for users,
            # they mirror the normal path and are only in the build
            # directory to keep it out of the way of users.
            fpath = os.path.split(f)
            arcname = os.path.join(*fpath[1:]) \
                if re.match('\..build', fpath[0]) \
                else os.path.join(*fpath)
            btapp.write(f, arcname)
        btapp.close()
