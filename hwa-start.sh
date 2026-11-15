#!/bin/sh
export PATH=/home/moki27/.hwa-hackathon/tools/npm/bin:"$PATH"
cd "$(dirname "$0")" && export PWD="$(pwd)" && exec /home/moki27/.opencode/bin/opencode
