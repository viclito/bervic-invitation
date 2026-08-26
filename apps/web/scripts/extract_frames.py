import os
import sys
import argparse

def extract_frames(video_path, output_dir, target_fps=20, quality=75, max_width=720):
    try:
        import cv2
        from PIL import Image
    except ImportError:
        print("Required libraries missing. Run: python -m pip install opencv-python pillow")
        return

    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
        return

    os.makedirs(output_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_path}")
        return

    src_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / src_fps if src_fps > 0 else 0

    print(f"📹 Processing video: {video_path}")
    print(f"   Original FPS: {src_fps:.2f} | Total Frames: {total_frames} | Duration: {duration:.2f}s")
    print(f"   Target FPS: {target_fps} | Output Quality: {quality}% | Max Width: {max_width}px")

    sample_interval = max(1, int(round(src_fps / target_fps))) if src_fps > 0 else 1

    frame_count = 0
    saved_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % sample_interval == 0:
            saved_count += 1
            # Convert BGR (OpenCV) to RGB (PIL)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_frame)

            # Resize if width exceeds max_width
            w, h = pil_img.size
            if w > max_width:
                new_h = int(h * (max_width / w))
                pil_img = pil_img.resize((max_width, new_h), Image.Resampling.LANCZOS)

            output_filename = f"frame-{saved_count:04d}.webp"
            output_filepath = os.path.join(output_dir, output_filename)
            
            pil_img.save(output_filepath, "WEBP", quality=quality)
            
            if saved_count % 20 == 0:
                print(f"   Saved {saved_count} frames... ({output_filename})")

        frame_count += 1

    cap.release()
    print(f"✅ Finished! Extracted {saved_count} frames into '{output_dir}'.\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract video frames to WebP sequence for scroll animation.")
    parser.add_argument("video_path", help="Path to input video file")
    parser.add_argument("--out", default="public/frames/scene3", help="Output directory for frames")
    parser.add_argument("--fps", type=int, default=20, help="Target FPS (default: 20)")
    parser.add_argument("--quality", type=int, default=75, help="WebP Quality (default: 75)")
    parser.add_argument("--max_width", type=int, default=720, help="Max image width (default: 720)")

    args = parser.parse_args()
    extract_frames(args.video_path, args.out, args.fps, args.quality, args.max_width)
