#!/usr/bin/env bash

BUILD_FOLDER="/tmp/build"
echo "Start Install Script"

rm -rf $BUILD_FOLDER
mkdir $BUILD_FOLDER
cp -r . $BUILD_FOLDER
# ls $BUILD_FOLDER

echo "End Install Script"

