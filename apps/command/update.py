#
# Copyright (c) 2010 BitTorrent Inc.
#

import apps.command.base

class update(apps.command.base.Command):

    help = 'Check the remote dependencies and update them.'
    post_commands = [ 'generate' ]

    def run(self):
        self.update_deps()
