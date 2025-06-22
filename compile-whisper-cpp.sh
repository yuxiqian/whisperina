#!/usr/bin/env bash

set -ex

(cd whisper.cpp \
  && cmake -B build \
  && cmake --build build --config Release
)

rm -rf bin/ && mkdir -p bin/
cp whisper.cpp/build/bin/whisper-cli bin/
cp whisper.cpp/build/src/libwhisper.1.dylib bin/

cp whisper.cpp/build/ggml/src/libggml.dylib bin/
cp whisper.cpp/build/ggml/src/libggml-base.dylib bin/
cp whisper.cpp/build/ggml/src/libggml-cpu.dylib bin/
cp whisper.cpp/build/ggml/src/ggml-blas/libggml-blas.dylib bin/
cp whisper.cpp/build/ggml/src/ggml-metal/libggml-metal.dylib bin/

cp whisper.cpp/models/download-ggml-model.sh bin/

