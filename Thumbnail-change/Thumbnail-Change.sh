	echo first file-path then img_path
	read file_path 
	read img
    full_path="file://$(realpath -s "$file_path")";
    md5name=$(printf %s "${full_path// /%20}" | md5sum);
    file1=$(find ~/.cache/thumbnails/ -name "${md5name%% *}.png")
    rm "$file1"
    cp "$img" "$file1"
    # echo "$file1"