full_path="file://$(realpath -s "$1")"
md5name=$(printf %s "${full_path// /%20}" | md5sum)
# find ~/.thumbnails/ ~/.cache/thumbnails/ -name "${md5name%% *}.png"
find ~/.cache/thumbnails/ -name "${md5name%% *}.png"
