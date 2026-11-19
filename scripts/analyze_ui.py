import cv2
import numpy as np
import os

images = {
    "Home": r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\01 Home.jpg",
    "Shop": r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\02 Shop.jpg",
    "About": r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\02_About.jpg",
    "Category": r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\03 Category.jpg",
    "Product": r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\04_Product-Page.jpg"
}

out_dir = r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\analysis"
os.makedirs(out_dir, exist_ok=True)

print("Analyzing images...")
for name, path in images.items():
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue
    img = cv2.imread(path)
    if img is None:
        print(f"Failed to read: {path}")
        continue
    h, w, c = img.shape
    print(f"\n[{name}] Size: {w}x{h}, Channels: {c}")
    
    # Analyze color palette: find prominent colors (excluding pure white/black)
    # Downsample for speed
    small = cv2.resize(img, (200, int(200 * h / w)))
    pixels = small.reshape(-1, 3)
    
    # Look for yellow/gold accents: high Red, high Green, low-to-medium Blue
    # In BGR: B < 100, G > 150, R > 180
    yellow_mask = (pixels[:, 0] < 120) & (pixels[:, 1] > 140) & (pixels[:, 2] > 170)
    yellows = pixels[yellow_mask]
    if len(yellows) > 0:
        mean_yellow = np.median(yellows, axis=0).astype(int)
        hex_yellow = f"#{mean_yellow[2]:02x}{mean_yellow[1]:02x}{mean_yellow[0]:02x}"
        print(f"  Detected Yellow/Gold Accent: {hex_yellow} (BGR: {mean_yellow})")
    
    # Save a downsampled web-viewable version
    target_w = 1200
    target_h = int(h * (target_w / w))
    preview = cv2.resize(img, (target_w, target_h), interpolation=cv2.INTER_AREA)
    cv2.imwrite(os.path.join(out_dir, f"{name}_preview.jpg"), preview, [cv2.IMWRITE_JPEG_QUALITY, 85])
    print(f"  Saved preview: {target_w}x{target_h}")

print("\nAnalysis complete.")

