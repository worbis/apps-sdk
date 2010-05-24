#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Update all of a project's dependencies
"""

import optparse
import sys

import griffin.setup

if __name__ == '__main__':
    usage = "usage: %prog [options]"
    parser = optparse.OptionParser(usage=usage)

    (options, args) = parser.parse_args()

    griffin.setup.Project('.').update_deps()
