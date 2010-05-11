#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Add a package or library to a project.
"""

import optparse
import sys

import griffin.setup

if __name__ == '__main__':
    usage = "usage: %prog [options] url"
    parser = optparse.OptionParser(usage=usage)

    (options, args) = parser.parse_args()

    if len(args) < 1:
        print 'Must include a remote url.'
        sys.exit(1)

    griffin.setup.Project('.').add(args[0])
