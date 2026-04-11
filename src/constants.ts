import { DeviceConfig } from './types';

export const DEVICES: DeviceConfig[] = [
  // --- Apple iPhone Series ---
  { id: 'iphone-15-pm', name: 'iPhone 15 Pro Max', width: 430, height: 932, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-15-plus', name: 'iPhone 15 Plus', width: 430, height: 932, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-15', name: 'iPhone 15', width: 393, height: 852, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', width: 393, height: 852, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-14-pm', name: 'iPhone 14 Pro Max', width: 430, height: 932, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-14-plus', name: 'iPhone 14 Plus', width: 428, height: 926, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-13-pm', name: 'iPhone 13 Pro Max', width: 428, height: 926, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-13', name: 'iPhone 13', width: 390, height: 844, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-13-mini', name: 'iPhone 13 Mini', width: 360, height: 780, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-se-2022', name: 'iPhone SE (2022)', width: 375, height: 667, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-12-pm', name: 'iPhone 12 Pro Max', width: 428, height: 926, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-12', name: 'iPhone 12', width: 390, height: 844, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-11-pm', name: 'iPhone 11 Pro Max', width: 414, height: 896, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-11', name: 'iPhone 11', width: 414, height: 896, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-x', name: 'iPhone X', width: 375, height: 812, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-8-plus', name: 'iPhone 8 Plus', width: 414, height: 736, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-8', name: 'iPhone 8', width: 375, height: 667, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-se-2020', name: 'iPhone SE (2020)', width: 375, height: 667, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'iphone-5s', name: 'iPhone 5s', width: 320, height: 568, category: 'mobile', headerHeight: 60, footerHeight: 50 },

  // --- Samsung Galaxy Series ---
  { id: 's24-ultra', name: 'Galaxy S24 Ultra', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's24', name: 'Galaxy S24', width: 360, height: 780, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's23-ultra', name: 'Galaxy S23 Ultra', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's23', name: 'Galaxy S23', width: 360, height: 780, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's22-ultra', name: 'Galaxy S22 Ultra', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's22', name: 'Galaxy S22', width: 360, height: 780, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's21-ultra', name: 'Galaxy S21 Ultra', width: 360, height: 760, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's21', name: 'Galaxy S21', width: 393, height: 851, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's20-ultra', name: 'Galaxy S20 Ultra', width: 360, height: 760, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's20', name: 'Galaxy S20', width: 393, height: 851, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 's10-plus', name: 'Galaxy S10+', width: 360, height: 760, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'a54-5g', name: 'Galaxy A54 5G', width: 393, height: 851, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'z-flip-5', name: 'Galaxy Z Flip 5', width: 360, height: 880, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'z-fold-5-folded', name: 'Galaxy Z Fold 5 (Folded)', width: 360, height: 740, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'note-20-ultra', name: 'Galaxy Note 20 Ultra', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },

  // --- Google Pixel Series ---
  { id: 'pixel-8-pro', name: 'Pixel 8 Pro', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'pixel-8', name: 'Pixel 8', width: 393, height: 851, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'pixel-7-pro', name: 'Pixel 7 Pro', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'pixel-7', name: 'Pixel 7', width: 393, height: 851, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'pixel-6-pro', name: 'Pixel 6 Pro', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'pixel-5', name: 'Pixel 5', width: 393, height: 851, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'pixel-4-xl', name: 'Pixel 4 XL', width: 412, height: 869, category: 'mobile', headerHeight: 60, footerHeight: 50 },

  // --- Other Mobile Brands ---
  { id: 'oneplus-12', name: 'OnePlus 12', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'oneplus-11', name: 'OnePlus 11', width: 414, height: 896, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'xiaomi-13-pro', name: 'Xiaomi Mi 13 Pro', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'redmi-note-12', name: 'Xiaomi Redmi Note 12', width: 360, height: 780, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'huawei-p60-pro', name: 'Huawei P60 Pro', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },
  { id: 'sony-xperia-1-v', name: 'Sony Xperia 1 V', width: 412, height: 915, category: 'mobile', headerHeight: 60, footerHeight: 50 },

  // --- Foldables (Unfolded) ---
  { id: 'z-fold-5-unfolded', name: 'Galaxy Z Fold 5 (Unfolded)', width: 1812, height: 2176, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'pixel-fold-unfolded', name: 'Google Pixel Fold (Unfolded)', width: 1840, height: 2208, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'mix-fold-3', name: 'Xiaomi Mix Fold 3', width: 1916, height: 2160, category: 'tablet', headerHeight: 60, footerHeight: 50 },

  // --- Tablets ---
  { id: 'ipad-pro-12-9', name: 'iPad Pro 12.9" (6th Gen)', width: 1024, height: 1366, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'ipad-pro-11', name: 'iPad Pro 11" (4th Gen)', width: 834, height: 1194, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'ipad-air-5', name: 'iPad Air (5th Gen)', width: 820, height: 1180, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'ipad-mini-6', name: 'iPad Mini (6th Gen)', width: 744, height: 1133, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'ipad-10th', name: 'iPad 10th Gen', width: 820, height: 1180, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'tab-s9-ultra', name: 'Galaxy Tab S9 Ultra', width: 1120, height: 1400, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'tab-s9', name: 'Galaxy Tab S9', width: 800, height: 1280, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'surface-pro-9', name: 'Surface Pro 9', width: 960, height: 1440, category: 'tablet', headerHeight: 60, footerHeight: 50 },
  { id: 'fire-hd-10', name: 'Amazon Fire HD 10', width: 800, height: 1280, category: 'tablet', headerHeight: 60, footerHeight: 50 },

  // --- Laptops ---
  { id: 'macbook-air-13', name: 'MacBook Air (M2, 13")', width: 1280, height: 832, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'macbook-air-15', name: 'MacBook Air (M2, 15")', width: 1440, height: 932, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'macbook-pro-14', name: 'MacBook Pro 14" (M3)', width: 1512, height: 982, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'macbook-pro-16', name: 'MacBook Pro 16" (M3)', width: 1728, height: 1117, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'xps-13', name: 'Dell XPS 13 (2023)', width: 960, height: 1200, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'xps-15', name: 'Dell XPS 15 (2023)', width: 1728, height: 1080, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'spectre-x360', name: 'HP Spectre x360 14"', width: 1500, height: 1000, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'thinkpad-x1', name: 'ThinkPad X1 Carbon', width: 1280, height: 800, category: 'desktop', headerHeight: 40, footerHeight: 0 },

  // --- Desktop Monitors ---
  { id: 'desktop-fhd', name: 'Full HD (1920x1080)', width: 1920, height: 1080, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'desktop-qhd', name: 'QHD (2560x1440)', width: 2560, height: 1440, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'desktop-4k', name: '4K Ultra HD (3840x2160)', width: 3840, height: 2160, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'ultrawide', name: 'Ultrawide Monitor (21:9)', width: 3440, height: 1440, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'imac-5k', name: '5K iMac', width: 5120, height: 2880, category: 'desktop', headerHeight: 40, footerHeight: 0 },

  // --- Wearables & Others ---
  { id: 'apple-watch-9', name: 'Apple Watch Series 9', width: 163, height: 136, category: 'mobile', headerHeight: 20, footerHeight: 0 },
  { id: 'pixel-watch-2', name: 'Google Pixel Watch 2', width: 169, height: 169, category: 'mobile', headerHeight: 20, footerHeight: 0 },
  { id: 'echo-show-5', name: 'Amazon Echo Show 5', width: 480, height: 240, category: 'mobile', headerHeight: 20, footerHeight: 0 },
  { id: 'smart-tv-4k', name: 'Smart TV (4K)', width: 1920, height: 1080, category: 'desktop', headerHeight: 40, footerHeight: 0 },
  { id: 'custom', name: 'Custom Resolution', width: 1200, height: 800, category: 'custom', headerHeight: 40, footerHeight: 0 },
];
