#
# Makefile for btapps.
#
# Compiler: closure compiler
# Lint: jslint
#
# Copyright(c) 2010 BitTorrent Inc.

SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

BTAPP_VER = 'cat version.txt'
VER = sed s/@VERSION/${btapp_ver}/

RHINO = java -jar ${BUILD_DIR}/js.jar
MINJAR = java -jar ${BUILD_DIR}/compiler.jar

all: btapp lint test min
	@@echo "btapp build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

init:
	@@echo "Grabbing external dependencies..."
	@@if test ! -d test/qunit/.git; then git clone git://github.com/jquery/qunit.git test/qunit; fi
	@@if test ! -d src/jsload/.git; then git clone git://github.com/pyronicide/jsload.git src/jsload; fi
	- @@cd test/qunit && git pull origin master > /dev/null 2>&1
	- @@cd src/jsload && git pull origin master > /dev/null 2>&1
