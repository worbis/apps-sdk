from distutils.core import setup
import py2exe

setup(console = ['apps.py'],
      options = { 'py2exe': { "unbuffered": True,
                              "optimize": 2,
                              "includes": [ 'email' ],
                              "packages": ["mako.cache", "email"],
                              }
                }
      )
