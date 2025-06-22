#!/usr/bin/env bash

set -ex
rm -rf iina-ai-subgen.iinaplgz
npm run build
iina-plugin pack .
