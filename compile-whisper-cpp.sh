#!/usr/bin/env bash

set -ex

(cd whisper.cpp \
  && cmake -D GGML_STATIC=ON -D GGML_METAL=OFF -D GGML_BLAS=OFF -B build \
  && cmake --build build --config Release
)

rm -rf bin/ && mkdir -p bin/
cp whisper.cpp/build/bin/* bin/
cp whisper.cpp/models/download-ggml-model.sh bin/
