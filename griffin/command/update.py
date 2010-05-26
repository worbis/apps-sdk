#
# Copyright (c) 2010 BitTorrent Inc.
#

import griffin.command.base

class update(griffin.command.base.Command):

    help = 'Check the remote dependencies and update them.'
    post_commands = [ 'generate' ]

    def run(self):
        self.update_deps()
