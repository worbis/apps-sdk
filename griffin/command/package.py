#
# Copyright (c) 2010 BitTorrent Inc.
#

import fnmatch
import os
import zipfile

import griffin.command.base

class package(griffin.command.base.Command):

    help = 'Package the project into a .btapp file.'
    pre_commands = [ 'generate' ]

    def run(self):
        path = self.options.get('path', self.project.path)
        ignore = [os.path.join(path, x) for x in
                  open(os.path.join(self.project.path,
                                    '.ignore')).read().split('\n')]
        def _filter(fname):
            for pat in ignore:
                if fnmatch.fnmatch(fname, pat):
                    return False
            return True
        btapp = zipfile.ZipFile(open(os.path.join(path, '%s.btapp' % (
                    self.project.metadata['name'],)), 'w'), 'w')
        for p, dirs, files in os.walk(self.project.path):
            for f in filter(_filter, [os.path.join(p, x) for x in files]):
                btapp.write(f)
        btapp.close()
