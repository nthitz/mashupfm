youtube-dl --extract-audio --audio-format m4a --audio-quality 0 --prefer-ffmpeg --print-json -o "../media/DEBUG%(title)s-%(id)s.%(ext)s" $1 --postprocessor-args '-acodec libfdk_aac -vbr 2'
