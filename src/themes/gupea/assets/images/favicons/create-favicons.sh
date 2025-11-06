#!/bin/bash

magick logo.png -strip clean-logo.png

magick clean-logo.png -resize 128x128 logo-128.png
magick clean-logo.png -resize 64x64 logo-64.png
magick clean-logo.png -resize 32x32 logo-32.png
magick clean-logo.png -resize 16x16 logo-16.png

magick logo-16.png logo-32.png logo-64.png logo-128.png favicon.ico

rm logo-16.png logo-32.png logo-64.png logo-128.png

magick clean-logo.png -resize 512x512 android-chrome-512x512.png
magick clean-logo.png -resize 192x192 android-chrome-192x192.png
magick clean-logo.png -resize 180x180 apple-touch-icon.png

rm clean-logo.png
