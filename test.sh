#!/usr/bin/env bash

set -ex

mkdir -p models && cd models
../bin/download-ggml-model.sh base
cd ../bin
DYLD_LIBRARY_PATH=$(pwd) ./whisper-cli -m ../models/ggml-base.bin -f ../samples/jfk.wav -osrt
