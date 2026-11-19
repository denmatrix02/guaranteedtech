import cv2
import numpy as np

def analyze_layout(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return
    h, w, _ = img.shape
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Calculate row-wise variance / edge density to find section boundaries
    row_means = np.mean(gray, axis=1)
    
    # Find background transitions (where mean brightness changes, e.g. white #ffffff to light gray #f3f4f6 or dark footer)
    diffs = np.abs(np.diff(row_means))
    top_diff_indices = np.argsort(diffs)[-15:][::-1]
    top_diff_indices = sorted(top_diff_indices)
    
    print(f"=== Layout Analysis for {img_path} ({w}x{h}) ===")
    print("Section boundary candidates (y-offsets):", top_diff_indices)
    
    # Analyze footer (bottom 15%)
    bottom_section = img[int(h*0.85):h, :]
    b_mean = np.mean(bottom_section, axis=(0,1))
    print(f"Bottom section (Footer) average BGR: {b_mean.astype(int)} (Dark footer? {b_mean[0] < 50 and b_mean[1] < 50 and b_mean[2] < 50})")
    
    # Top bar (first 5%)
    top_bar = img[0:int(h*0.03), :]
    t_mean = np.mean(top_bar, axis=(0,1))
    print(f"Top bar average BGR: {t_mean.astype(int)}")

analyze_layout(r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\analysis\Home_preview.jpg")
analyze_layout(r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\analysis\Shop_preview.jpg")
analyze_layout(r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\analysis\Product_preview.jpg")

