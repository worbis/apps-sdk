import os
import pkg_resources
eggs = pkg_resources.require("griffin")
from setuptools.archive_util import unpack_archive
for egg in eggs:
   if os.path.isdir(egg.location):
       sys.path.insert(0, egg.location)
       continue
   unpack_archive(egg.location, egg.dir)
eggpacks = set()
eggspth = open("build/eggs.pth", "w")
for egg in eggs:
   print egg
   eggspth.write(os.path.basename(egg.location))
   eggspth.write("\n")
   eggpacks.update(egg.get_metadata_lines("top_level.txt"))
eggspth.close()
eggpacks.remove("pkg_resources")
