#
# Copyright (c) 2010 BitTorrent Inc.
#

import apps.command.base

class add(apps.command.base.Command):

    user_options = [ ('file=', 'f', 'file to add', None) ]
    post_commands = [ 'generate' ]
    help = 'Add an external dependency to the project.'

    def run(self):
        self.add(self.options['file'])
