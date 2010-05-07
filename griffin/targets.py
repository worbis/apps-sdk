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

import itertools
import json
import logging
import os
import shutil

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

class Dependency(object):

    def __init__(self, package, path):
        self.package = package
        self.path = path

    def __str__(self):
        return '(%s, %s)' % (self.package, self.path)

    def source(self):
        return self.path

    def destination(self):
        return 'lib/%s' % (self.package,) if self.package else '' + \
            os.path.basename(self.path)

class Package(object):

    def __init__(self, name, location, search_path):
        self.name = name
        self.location = location
        self.search_path = search_path
        self.manifest = self.parse_manifest()
        self.files = [Dependency(name, x) for x in self.app_files()]

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
            dependencies.append(('lib', fname))
        return dependencies

    def locate_package(self, name):
        for path in self.search_path:
            location = os.path.join(path, name)
            if os.path.exists(location) and os.path.exists(
                os.path.join(location, 'package.json')):
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
            dependencies += package_obj.file_list()
        return dependencies

    def flatten(self, listOfLists):
        return itertools.chain.from_iterable(listOfLists)

    def app_files(self):
        src_dir = self.manifest['directories'].get('src', 'src')
        return self.flatten(
            [[Dependency('.', os.path.join(x, i)) for i in z]
             for x,y,z in os.walk(src_dir)])

    def file_list(self):
        return self.dependencies() + self.files

class Target(object):

    def __init__(self, app_dir, search_path, debug=False):
        self.debug = debug
        self.app_dir = app_dir
        self.package = Package('', app_dir, search_path)
        self.dependencies = self.package.dependencies()

    def setup_files(self):
        build_dir = self.package.manifest['directories'].get('build', '_build')
        try:
            shutil.rmtree(build_dir)
        except OSError:
            pass
        os.makedirs(os.path.join(build_dir, 'lib'))
        index = open(os.path.join(build_dir, 'index.html'), 'w')
        for dep in self.package.app_files():
            self.move(dep.path, os.path.join(build_dir,
                                             os.path.basename(dep.path)))
        for dep in self.dependencies:
            if not os.path.exists(os.path.join(build_dir, 'lib', dep.package)):
                os.makedirs(os.path.join(build_dir, 'lib', dep.package))
            self.move(dep.path, os.path.join(
                    os.path.join(build_dir, 'lib', dep.package),
                    os.path.basename(dep.path)))
        includes = [x.destination for x in self.package.app_files() +
        includes = [os.path.basename(x) for x in self.package.app_files()] + \
            [os.path.join('lib', os.path.basename(x)) for x in
             self.dependencies]
        index.write(griffin.templates.render_template(
                'index_html', debug=self.debug, dependencies=includes))

    def run(self):
        self.setup_files()

class develop(Target):

    def move(self, source, target):
        os.symlink(source, target)

class build(Target):

    btapp_keys = ['author', 'name', 'update_url', 'publisher', 'version']

    def __init__(self, *args, **kwargs):
        Target.__init__(self, *args, **kwargs)
        self.build_dir = os.path.join(self.app_dir, '../build')

    def move(self, source, target):
        shutil.copy2(source, target)

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
