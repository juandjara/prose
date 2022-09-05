#!/bin/bash
set -e

mkdir -p site
cp -a dist site
cp -a img fonts index.html style-rtl.css locale.js translations site
