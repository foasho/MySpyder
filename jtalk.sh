#!/bin/bash
tempfile=$(mktemp)
option="-m /usr/share/hts-voice/mei/mei_normal.htsvoice \
-x /var/lib/mecab/dic/open-jtalk/naist-jdic \
-ow $tempfile"

echo "$1" | open_jtalk $option
aplay -q $tempfile
rm $tempfile
