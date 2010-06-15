import os
import zipfile
eggpacks = [ 'apps' ]
oldzipfile = "dist/library.zip"
newzipfile = "dist/small-library.zip"
oldzip = zipfile.ZipFile(oldzipfile, "r")
newzip = zipfile.ZipFile(newzipfile, "w", zipfile.ZIP_STORED)
for entry in oldzip.infolist():
    delim = entry.filename.find("/")
    if delim == -1:
        delim = entry.filename.find(".")
    if delim > -1:
        if entry.filename[0:delim] in eggpacks:
            print "Skipping %s, it's in the egg" % (entry.filename)
            continue
    newzip.writestr(entry, oldzip.read(entry.filename))
newzip.close()
oldzip.close()
os.remove(oldzipfile)
os.rename(newzipfile, oldzipfile)
