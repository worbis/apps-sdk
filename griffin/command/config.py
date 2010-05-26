#
# Copyright (c) 2010 BitTorrent Inc.
#

import griffin.command.base

class config(griffin.command.base.Command):

    help = 'View and modify configuration of your project and griffin.'
    user_options = [
        ('global', 'g',
         'set the options globally ($HOME/.griffin.cfg)', None),
        ('local', 'l',
         'set the options locally (default) (project/.griffin.cfg)', None),
        ]

    def run(self):
        pass
