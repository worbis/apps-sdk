import os
import sys
sys.path.append(os.path.dirname(sys.executable))
import pkg_resources
pkg_resources.require('griffin')

# Stupid py2exe
import email
import email.mime.text
import email.mime.multipart
import email.iterators
import email.generator
import email.utils

import griffin.vanguard

griffin.vanguard.run()
