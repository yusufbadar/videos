#!/usr/bin/env bash
# Final encode for a reel: 1080x1920, 30 fps, H.264 high, BT.709, AAC, audio
# normalised to -14 LUFS with peaks under -1 dBTP. Also writes a cover frame
# and a contact sheet to look at before anything is scheduled.
#
#   studio/finish.sh in.mp4 reels/name [cover-time-seconds]
set -euo pipefail
in="$1"; out="$2"; cover="${3:-1.0}"
mkdir -p "$(dirname "$out")"
if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$in" | grep -q .; then
  a=(-af "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000" -c:a aac -b:a 192k -ac 2)
else
  a=(-f lavfi -i anullsrc=r=48000:cl=stereo -shortest -c:a aac -b:a 128k)
fi
ffmpeg -y -loglevel error -i "$in" "${a[@]}" \
  -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=decrease:flags=lanczos,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x020203,setsar=1,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 17 -maxrate 14M -bufsize 28M \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart "$out.mp4"
ffmpeg -y -loglevel error -ss "$cover" -i "$out.mp4" -frames:v 1 -q:v 2 "$out-cover.jpg"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out.mp4")
ffmpeg -y -loglevel error -i "$out.mp4" -vf "fps=12/$d,scale=180:-1,tile=12x1" -frames:v 1 -q:v 3 "${out}.sheet.tmp.jpg"
echo "$out.mp4  ${d}s  $(du -h "$out.mp4" | cut -f1)"
