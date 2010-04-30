#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
The build targets to support development, building and packaging of griffin apps
"""

__author__ = 'Thomas Rampelberg'
__date__ = "%date%"
__version__ = "%version%"

available_targets = ['develop', 'build', 'package', 'test', 'serve']

import json
import os

import griffin.templates

class PackageSyntax(Exception):

    def __init__(self, name, package, err):
        self.name = name
        self.package = package
        self.err = err

    def __str__(self):
        return 'The package <%s> at <%s> has invalid syntax.\n%s' % (
            self.name, self.package, self.err)

class PackageKeyMissing(Exception):

    def __init__(self, key):
        self.key = key

    def __str__(self):
        return 'The package file does not contain a required key: %s' % (
            self.key,)

class PackageDNE(Exception):

    def __init__(self, name, search_path):
        self.name = name
        self.search_path = search_path

    def __str__(self):
        return 'The package <%s> cannot be found on: %s' % (
            self.name, ','.join(self.search_path))

class PackageWrongVersion(Exception):

    def __init__(self, name, path, actual, required):
        self.name = name
        self.path = path
        self.actual = actual
        self.required = required

    def __str__(self):
        return 'The package <%s> at <%s> is not the right version: %s != %s' % (
            self.name, self.path, self.actual, self.required)

class MissingDependency(Exception):

    def __init__(self, path, lib, version):
        self.path = path
        self.lib = lib
        self.version = version

    def __str__(self):
        return 'The %s dependency (version=%s) could not be found at %s' % (
            self.lib, self.version, self.path)

class Package(object):

    def __init__(self, name, location, search_path):
        self.name = name
        self.location = location
        self.search_path = search_path
        self.manifest = self.parse_manifest()

    def parse_manifest(self):
        try:
            return json.load(open(os.path.join(self.location, 'package.json')))
        except ValueError as err:
            raise PackageSyntax(self.name,
                                os.path.join(self.location, 'package.json'),
                                err)

    def dependencies(self):
        if not 'bt:dependencies' in self.manifest:
            return []
        lib_path = ''
        if not 'directories' in self.manifest:
            lib_path = os.path.join(self.location, 'lib/')
        elif 'lib' in self.manifest['directories']:
            lib_path = os.path.join(self.location,
                                    self.manifest['directories']['lib'])
        return self._package_dependencies() + self._lib_dependencies(lib_path)

    def _lib_dependencies(self, path):
        if not 'lib' in self.manifest['bt:dependencies']:
            return []
        dependencies = []
        for lib in self.manifest['bt:dependencies']['lib']:
            version = '-' + lib['version'] if 'version' in lib else ''
            fname = os.path.join(path, '%s%s.js' % (lib['name'], version))
            if not os.path.exists(fname):
                raise MissingDependency(path, lib['name'], version)
            dependencies.append(fname)
        return dependencies

    def locate_package(self, name):
        for path in self.search_path:
            location = os.path.join(path, name)
            if os.path.exists(location):
                return location
        raise PackageDNE(name, self.search_path)

    def _package_dependencies(self):
        if not 'package' in self.manifest['bt:dependencies']:
            return []
        dependencies = []
        for package in self.manifest['bt:dependencies']['package']:
            package_obj = Package(package['name'], self.locate_package(
                    package['name']), self.search_path)
            if 'version' in package and package_obj.manifest[
                'version'] != package['version']:
                raise PackageWrongVersion(name, package_obj.location,
                                          package_obj.manifest['version'],
                                          package['version'])
            dependencies += package_obj.dependencies()
        return dependencies

class Target(object):

    def __init__(self, app_dir, search_path, debug=False):
        self.debug = debug
        self.app_dir = app_dir
        self.package = Package('', app_dir, search_path)
        self.dependencies = self.package.dependencies()



class develop(Target):
    pass

class build(Target):

    btapp_keys = ['author', 'name', 'update_url', 'publisher', 'version']

    def __init__(self, *args, **kwargs):
        Target.__init__(self, *args, **kwargs)
        self.build_dir = os.path.join(self.app_dir, '../build')

    def btapp(self):
        fobj = open(os.path.join(self.build_dir, 'btapp'), 'w')
        for key in self.btapp_keys:
            if key in self.manifest:
                fobj.write('%s:%s\n' % (key, self.manifest[key]))
                continue
            if 'bt:'+key in self.manifest:
                fobj.write('%s:%s\n' % (key, self.manifest['bt:'+key]))
                continue
            raise PackageKeyMissing(key)
        fobj.write('debug:%s\n' % (self.debug,))
        fobj.close()

class package(Target):
    pass

class test(Target):
    pass

class serve(Target):
    pass
