# ok so this works but we can no longer use it exactly as is, because it will
# convert files it's already done and that seems bad?

# for i in *.m4a;
#    do name=`basename "$i" .m4a`;
#    echo $name;
#    /home/nthitz/bin/ffmpeg -y -i "$i" -c:a libfdk_aac -vbr 2 tmp.m4a;
#    rm "$i";
#    mv tmp.m4a "$name".m4a;
# done
