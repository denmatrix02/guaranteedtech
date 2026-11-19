import cv2
import os

preview_dir = r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\analysis"
crops_dir = r"c:\Users\DENNIS\Documents\Guaranteed Tech\ui\crops"
os.makedirs(crops_dir, exist_ok=True)

# 1. Home Page Analysis (1200 x 3941)
home = cv2.imread(os.path.join(preview_dir, "Home_preview.jpg"))
if home is not None:
    h, w, _ = home.shape
    # Top bar & Header & Hero: y: 0 to 600
    cv2.imwrite(os.path.join(crops_dir, "home_01_header_hero.jpg"), home[0:600, :])
    # Category navigation: y: 600 to 900
    cv2.imwrite(os.path.join(crops_dir, "home_02_categories.jpg"), home[600:1000, :])
    # Featured / best sellers / cards: y: 1000 to 1800
    cv2.imwrite(os.path.join(crops_dir, "home_03_products.jpg"), home[1000:1800, :])
    # Mid section / banners / smart finder: y: 1800 to 2600
    cv2.imwrite(os.path.join(crops_dir, "home_04_mid_promo.jpg"), home[1800:2700, :])
    # Accessories / reviews / articles: y: 2700 to 3400
    cv2.imwrite(os.path.join(crops_dir, "home_05_reviews_articles.jpg"), home[2700:3500, :])
    # Footer: y: 3400 to end
    cv2.imwrite(os.path.join(crops_dir, "home_06_footer.jpg"), home[3400:h, :])
    print("Cropped Home Page sections successfully")

# 2. Shop Page (1200 x 2071)
shop = cv2.imread(os.path.join(preview_dir, "Shop_preview.jpg"))
if shop is not None:
    sh, sw, _ = shop.shape
    cv2.imwrite(os.path.join(crops_dir, "shop_top_filters.jpg"), shop[0:800, :])
    cv2.imwrite(os.path.join(crops_dir, "shop_grid.jpg"), shop[800:1600, :])
    print("Cropped Shop Page sections successfully")

# 3. Product Page (1200 x 3538)
prod = cv2.imread(os.path.join(preview_dir, "Product_preview.jpg"))
if prod is not None:
    ph, pw, _ = prod.shape
    cv2.imwrite(os.path.join(crops_dir, "product_top_buybox.jpg"), prod[0:1000, :])
    cv2.imwrite(os.path.join(crops_dir, "product_specs_tabs.jpg"), prod[1000:2000, :])
    cv2.imwrite(os.path.join(crops_dir, "product_related_reviews.jpg"), prod[2000:3000, :])
    print("Cropped Product Page sections successfully")

print("All crops generated.")

