import os
import sys
sys.path.append(os.path.dirname(sys.executable))
import pkg_resources
pkg_resources.require('griffin')

import griffin.vanguard

griffin.vanguard.run()
