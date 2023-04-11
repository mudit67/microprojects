# args="$@"
# first="$1"
# sec="$2"

first_path="$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"
sec_path="$(cd "$(dirname "$2")"; pwd)/$(basename "$2")/$(basename "$1")"


# echo "dd if=$first_path of=$sec_path status=progress"

dd if=$first_path of=$sec_path status=progress