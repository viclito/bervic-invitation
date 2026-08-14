import os
import glob
import cv2
from PIL import Image

def process_videos():
    input_dir = "public/videotoconvert"
    output_dir = "public/frames/scene3"
    
    # Clean existing directory to prevent old leftover files
    if os.path.exists(output_dir):
        for f in glob.glob(os.path.join(output_dir, "*.webp")):
            try:
                os.remove(f)
            except:
                pass

    os.makedirs(output_dir, exist_ok=True)
    
    video_files = sorted(glob.glob(os.path.join(input_dir, "part*.mp4")))
    if not video_files:
        video_files = sorted(glob.glob(os.path.join(input_dir, "*.mp4")))
        
    print(f"Found {len(video_files)} video files to process:")
    for v in video_files:
        print(f"   - {v}")
        
    global_frame_count = 0
    
    for v_idx, v_path in enumerate(video_files):
        cap = cv2.VideoCapture(v_path)
        if not cap.isOpened():
            print(f"Failed to open {v_path}")
            continue
            
        src_fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        print(f"\nProcessing Part {v_idx + 1}: {os.path.basename(v_path)} ({total_frames} frames @ {src_fps:.1f} FPS, {w}x{h})")
        
        raw_frame_idx = 0
        part_saved_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            raw_frame_idx += 1
            
            # Step by 2 frames (288 frames total across 3 parts) for 12-15 FPS scroll smoothness
            if raw_frame_idx % 2 != 0 and raw_frame_idx != total_frames:
                continue

            global_frame_count += 1
            part_saved_count += 1
            
            # Convert BGR -> RGB -> PIL Image
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb)
            
            # Resize to HD 960x540 for mobile & desktop canvas efficiency
            pil_img = pil_img.resize((960, 540), Image.Resampling.LANCZOS)
            
            # Save WebP with quality=60 for ultra-lean file size under 25MB total
            out_name = f"frame-{global_frame_count:04d}.webp"
            out_path = os.path.join(output_dir, out_name)
            pil_img.save(out_path, "WEBP", quality=60)
            
            if part_saved_count % 20 == 0 or raw_frame_idx == total_frames:
                print(f"   Part {v_idx + 1}: Extracted {part_saved_count} frames -> {out_name}")
                
        cap.release()
        
    print(f"\nSUCCESS! Extracted {global_frame_count} optimized frames into '{output_dir}'.")

if __name__ == "__main__":
    process_videos()
