import cv2
import os

img = cv2.imread(r"ui\analysis\Home_preview.jpg")
h, w, _ = img.shape
out_dir = r"public\images\ui"
os.makedirs(out_dir, exist_ok=True)

# 1. Hero keyboard image (with glowing blue 'Buy Now!' key)
# Coordinates in Home_preview (1200x3941)
hero_img = img[75:520, 480:1200]
cv2.imwrite(os.path.join(out_dir, "hero_keyboard.jpg"), hero_img, [cv2.IMWRITE_JPEG_QUALITY, 95])

# 2. Promo 30% discount banner laptop
# Around y: 1450 to 1850, x: 100 to 520
promo_laptop = img[1520:1880, 120:500]
cv2.imwrite(os.path.join(out_dir, "promo_laptop.jpg"), promo_laptop, [cv2.IMWRITE_JPEG_QUALITY, 95])

# 3. Best selling products (row of 5 laptops / components)
# Around y: 1100 to 1280
# 5 items across x: 100 to 1100 (each ~200px wide)
for i in range(5):
    x_start = 120 + i * 195
    x_end = x_start + 185
    p_img = img[1100:1270, x_start:x_end]
    cv2.imwrite(os.path.join(out_dir, f"bestseller_{i+1}.jpg"), p_img, [cv2.IMWRITE_JPEG_QUALITY, 95])

# 4. Categories (6 items: Printers, Projectors, Scanners, Desktops, Inks, Laptops)
# Around y: 780 to 920
for i in range(6):
    x_start = 115 + i * 162
    x_end = x_start + 155
    cat_img = img[785:920, x_start:x_end]
    cv2.imwrite(os.path.join(out_dir, f"category_{i+1}.jpg"), cat_img, [cv2.IMWRITE_JPEG_QUALITY, 95])

# 5. Blog / Latest posts hardware images
# Around y: 2820 to 2970, 4 items across
for i in range(4):
    x_start = 115 + i * 245
    x_end = x_start + 235
    post_img = img[2820:2980, x_start:x_end]
    cv2.imwrite(os.path.join(out_dir, f"post_{i+1}.jpg"), post_img, [cv2.IMWRITE_JPEG_QUALITY, 95])

# 6. Instagram product gallery row
# Around y: 3450 to 3600, 6 items across
for i in range(6):
    x_start = 115 + i * 162
    x_end = x_start + 155
    insta_img = img[3460:3590, x_start:x_end]
    cv2.imwrite(os.path.join(out_dir, f"insta_{i+1}.jpg"), insta_img, [cv2.IMWRITE_JPEG_QUALITY, 95])

print("Cropped UI images from 01 Home.jpg successfully into public/images/ui/")
