from distutils.core import setup
import py2exe
import modulefinder

modulefinder.AddPackagePath("email.mime", "base")
modulefinder.AddPackagePath("email.mime", "multipart")
modulefinder.AddPackagePath("email.mime", "nonmultipart")
modulefinder.AddPackagePath("email.mime", "audio")
modulefinder.AddPackagePath("email.mime", "image")
modulefinder.AddPackagePath("email.mime", "message")
modulefinder.AddPackagePath("email.mime", "application")


setup(console = ['loader.py'],
      data_files = [('.', ['../dist/griffin-0.1-py2.6.egg'])],
      options = { 'py2exe': { "unbuffered": True,
                              "optimize": 2,
                              "includes": [ 'email' ],
                              "packages": ["mako.cache"],
                              }
                }
      )
