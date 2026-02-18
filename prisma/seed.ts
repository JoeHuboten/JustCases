import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Phone Cases',
        slug: 'phone-cases',
        description: 'Protective and stylish cases for your device',
        image: '/products/phone-cases/case-1.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Screen Protectors',
        slug: 'screen-protectors',
        description: 'Keep your screen scratch-free',
        image: '/products/screen-protectors/sp-1.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Wireless Earphones',
        slug: 'wireless-earphones',
        description: 'Premium sound quality',
        image: '/products/wireless-earphones/earphones-1.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Chargers & Cables',
        slug: 'chargers-cables',
        description: 'Fast charging solutions',
        image: '/products/cables/charger-1.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Power Banks',
        slug: 'power-banks',
        description: 'Portable power on the go',
        image: '/products/power-banks/powerbank-1.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Adapters',
        slug: 'adapters',
        description: 'Universal connectivity solutions',
        image: '/products/charging-adapters/adapter-1.jpg',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  const products = await Promise.all([
    // Phone Cases (6 products)
    prisma.product.create({
      data: {
        name: 'Premium Silicone Case with MagSafe',
        slug: 'premium-silicone-magsafe-case',
        description: 'Luxurious silicone case with built-in MagSafe technology. Soft-touch finish with microfiber lining for ultimate protection.',
        price: 49,
        oldPrice: 59,
        discount: 17,
        image: '/products/phone-cases/case-1.jpg',
        images: '/products/phone-cases/case-1.jpg',
        categoryId: categories[0].id,
        colors: 'Midnight, Storm Blue, Clay, Elderberry',
        sizes: 'iPhone 15, iPhone 15 Pro, iPhone 15 Pro Max',
        rating: 4.7,
        reviews: 342,
        inStock: true,
        stock: 45,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'Silicone with microfiber lining',
          protection: 'MagSafe Compatible',
          features: ['MagSafe Charging', 'Soft-Touch Finish', 'Raised Edges', 'Premium Quality']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ultra Hybrid Clear Case',
        slug: 'ultra-hybrid-clear-case',
        description: 'Crystal clear TPU bumper with rigid PC back. Shows off your phone while providing military-grade drop protection.',
        price: 29,
        oldPrice: 39,
        discount: 26,
        image: '/products/phone-cases/case-2.jpg',
        images: '/products/phone-cases/case-2.jpg',
        categoryId: categories[0].id,
        colors: 'Clear, Matte Black',
        sizes: 'iPhone 15, iPhone 15 Pro, Samsung S24',
        rating: 4.6,
        reviews: 1247,
        inStock: true,
        stock: 60,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'TPU + Polycarbonate',
          protection: 'Air Cushion Technology, MIL-STD 810G',
          features: ['Crystal Clear', 'Anti-Yellowing', 'Wireless Charging', 'Raised Bezels']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Defender Series Pro Rugged Case',
        slug: 'defender-series-pro-rugged',
        description: 'Ultimate rugged protection with port covers and holster clip. Built for extreme conditions.',
        price: 64,
        oldPrice: 79,
        discount: 19,
        image: '/products/phone-cases/case-3.jpg',
        images: '/products/phone-cases/case-3.jpg',
        categoryId: categories[0].id,
        colors: 'Black, Blue, Purple, Cactus Green',
        sizes: 'iPhone 15, iPhone 15 Pro, Samsung S24, Google Pixel 8',
        rating: 4.8,
        reviews: 892,
        inStock: true,
        stock: 35,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'Polycarbonate + Synthetic Rubber',
          protection: 'DROP+ Protection, 4X Military Standard',
          features: ['Port Covers', 'Holster Clip', 'Screen Bumper', 'MagSafe Compatible']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Textured Grip Case',
        slug: 'textured-grip-case',
        description: 'Textured grip case with customizable skin panels. Engineered for maximum grip and drop protection.',
        price: 55,
        oldPrice: 65,
        discount: 15,
        image: '/products/phone-cases/case-4.jpg',
        images: '/products/phone-cases/case-4.jpg',
        categoryId: categories[0].id,
        colors: 'Black, Robot Camo, Swarm, Damascus',
        sizes: 'iPhone 15, iPhone 15 Pro, Samsung S24, Pixel 8',
        rating: 4.5,
        reviews: 563,
        inStock: true,
        stock: 40,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          material: 'Polycarbonate with micro-texture grip',
          protection: '6ft Drop Protection',
          features: ['Customizable Skins', 'Textured Grip', 'Raised Camera Ring', 'Wireless Charging']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Fashion Impact Case',
        slug: 'fashion-impact-case',
        description: 'Fashion-forward protection with 6.6ft drop rating. Features antimicrobial coating and artistic designs.',
        price: 59,
        oldPrice: 75,
        discount: 21,
        image: '/products/phone-cases/case-5.jpg',
        images: '/products/phone-cases/case-5.jpg',
        categoryId: categories[0].id,
        colors: 'Clear, Black, Blue Marble, Pink Gradient',
        sizes: 'iPhone 15, iPhone 15 Pro, Samsung S24',
        rating: 4.4,
        reviews: 728,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'TPU with EcoShock technology',
          protection: '6.6ft / 2m Drop Protection',
          features: ['Antimicrobial Coating', 'Raised Bezels', 'Wireless Charging', 'UV Resistant']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tough Armor MagSafe Case',
        slug: 'tough-armor-magsafe-case',
        description: 'Dual-layer protection with built-in kickstand and MagSafe compatibility. Engineered for maximum impact absorption.',
        price: 44,
        oldPrice: 55,
        discount: 20,
        image: '/products/phone-cases/case-6.jpg',
        images: '/products/phone-cases/case-6.jpg',
        categoryId: categories[0].id,
        colors: 'Black, Gunmetal',
        sizes: 'iPhone 15, iPhone 15 Pro, iPhone 15 Pro Max',
        rating: 4.7,
        reviews: 1089,
        inStock: true,
        stock: 55,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'TPU + Polycarbonate',
          protection: 'Air Cushion Technology, Extreme Heavy Duty',
          features: ['Built-in Kickstand', 'MagSafe Compatible', 'Dual Layer', 'Wireless Charging']
        }
      },
    }),


    // Screen Protectors (6 products)
    prisma.product.create({
      data: {
        name: 'ScreenForce UltraGlass Protector',
        slug: 'screenforce-ultraglass-protector',
        description: 'Precision-engineered screen protector with 9H hardness. Double-ion exchange technology for superior strength.',
        price: 39,
        oldPrice: 49,
        discount: 20,
        image: '/products/screen-protectors/sp-1.jpg',
        images: '/products/screen-protectors/sp-1.jpg',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 15, iPhone 15 Pro, iPhone 15 Pro Max',
        rating: 4.7,
        reviews: 892,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: '9H Tempered Glass',
          thickness: '0.33mm',
          features: ['Double-Ion Exchange', 'Easy Align Tray', 'HD Clear', 'Anti-Fingerprint']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Glas.tR EZ Fit Screen Protector',
        slug: 'glastr-ez-fit-protector',
        description: 'Auto-align installation kit with 9H hardness glass. Crystal clear with oleophobic coating.',
        price: 24,
        oldPrice: 32,
        discount: 25,
        image: '/products/screen-protectors/sp-2.jpg',
        images: '/products/screen-protectors/sp-2.jpg',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 15, iPhone 15 Pro, Samsung S24',
        rating: 4.6,
        reviews: 1456,
        inStock: true,
        stock: 65,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: '9H Tempered Glass',
          thickness: '0.33mm',
          features: ['Auto-Align Kit', 'Case Friendly', 'HD Clear', '2-Pack']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Alpha Glass Screen Protector',
        slug: 'alpha-glass-protector',
        description: 'Strengthened glass with anti-shatter film. Tested to withstand drops and impacts.',
        price: 44,
        oldPrice: 54,
        discount: 19,
        image: '/products/screen-protectors/sp-3.jpg',
        images: '/products/screen-protectors/sp-3.jpg',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 15, iPhone 15 Pro, Samsung S24, Pixel 8',
        rating: 4.5,
        reviews: 634,
        inStock: true,
        stock: 45,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          material: 'Strengthened Glass',
          thickness: '0.33mm',
          features: ['Anti-Shatter Film', 'Impact Resistant', 'HD Clear', 'Easy Installation']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'InvisibleShield Glass Elite',
        slug: 'invisibleshield-glass-elite',
        description: 'Premium glass with ClearPrint technology that makes fingerprints virtually invisible.',
        price: 49,
        oldPrice: 59,
        discount: 17,
        image: '/products/screen-protectors/sp-4.jpg',
        images: '/products/screen-protectors/sp-4.jpg',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 15, iPhone 15 Pro, Samsung S24',
        rating: 4.8,
        reviews: 1089,
        inStock: true,
        stock: 40,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'Ion Matrix Glass',
          thickness: '0.33mm',
          features: ['ClearPrint Technology', 'Impact Protection', 'Anti-Glare', 'Easy Apply']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'AlignMaster Privacy Screen',
        slug: 'alignmaster-privacy-screen',
        description: 'Privacy screen protector with auto-align installation. Blocks side viewing at 30° angles.',
        price: 34,
        oldPrice: 44,
        discount: 23,
        image: '/products/screen-protectors/sp-5.jpg',
        images: '/products/screen-protectors/sp-5.jpg',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 15, iPhone 15 Pro, Samsung S24',
        rating: 4.4,
        reviews: 567,
        inStock: true,
        stock: 55,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: '9H Tempered Glass',
          thickness: '0.4mm',
          features: ['Privacy Filter', 'Auto-Align Tool', 'Anti-Spy', 'HD Clear']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'OneTouch Glass 3-Pack',
        slug: 'onetouch-glass-3pack',
        description: 'Premium glass with one-touch installation frame. 3-pack with lifetime replacement warranty.',
        price: 19,
        oldPrice: 29,
        discount: 34,
        image: '/products/screen-protectors/sp-6.jpg',
        images: '/products/screen-protectors/sp-6.jpg',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 15, iPhone 15 Pro, Samsung S24',
        rating: 4.6,
        reviews: 2134,
        inStock: true,
        stock: 70,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          material: '9H Tempered Glass',
          thickness: '0.33mm',
          features: ['OneTouch Installation', '3-Pack', 'Lifetime Warranty', 'HD Clear']
        }
      },
    }),


    // Wireless Earphones (6 products)
    prisma.product.create({
      data: {
        name: 'Pro Wireless Earbuds with ANC',
        slug: 'pro-wireless-earbuds-anc',
        description: 'Premium wireless earbuds with Active Noise Cancellation, Adaptive Audio, and MagSafe charging case.',
        price: 249,
        oldPrice: 279,
        discount: 11,
        image: '/products/wireless-earphones/earphones-1.jpg',
        images: '/products/wireless-earphones/earphones-1.jpg',
        categoryId: categories[2].id,
        colors: 'White',
        sizes: '',
        rating: 4.9,
        reviews: 3482,
        inStock: true,
        stock: 40,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '6 hours ANC (30 hours with case)',
          features: ['Active Noise Cancellation', 'Adaptive Audio', 'Transparency Mode', 'MagSafe Charging', 'Spatial Audio', 'IPX4 Sweat Resistant']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Premium Studio Earbuds',
        slug: 'premium-studio-earbuds',
        description: 'Premium earbuds with industry-leading noise cancellation and exceptional sound quality.',
        price: 299,
        oldPrice: 329,
        discount: 9,
        image: '/products/wireless-earphones/earphones-2.jpg',
        images: '/products/wireless-earphones/earphones-2.jpg',
        categoryId: categories[2].id,
        colors: 'Black, Silver',
        sizes: '',
        rating: 4.8,
        reviews: 1567,
        inStock: true,
        stock: 35,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '8 hours (24 hours with case)',
          features: ['Industry-Leading ANC', 'LDAC Audio', 'Speak-to-Chat', 'Multipoint Connection', 'IPX4 Water Resistant']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Galaxy Buds Pro',
        slug: 'galaxy-buds-pro',
        description: 'Flagship earbuds with intelligent ANC and seamless ecosystem integration.',
        price: 199,
        oldPrice: 229,
        discount: 13,
        image: '/products/wireless-earphones/earphones-3.jpg',
        images: '/products/wireless-earphones/earphones-3.jpg',
        categoryId: categories[2].id,
        colors: 'Graphite, White, Bora Purple',
        sizes: '',
        rating: 4.6,
        reviews: 2134,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '5 hours ANC (18 hours with case)',
          features: ['Intelligent ANC', '360 Audio', 'Auto Switch', 'IPX7 Water Resistant', 'Wireless Charging']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Elite Professional Earbuds',
        slug: 'elite-professional-earbuds',
        description: 'Professional-grade earbuds with adjustable ANC and superior call quality.',
        price: 179,
        oldPrice: 229,
        discount: 22,
        image: '/products/wireless-earphones/earphones-4.jpg',
        images: '/products/wireless-earphones/earphones-4.jpg',
        categoryId: categories[2].id,
        colors: 'Black, Titanium Black, Gold Beige',
        sizes: '',
        rating: 4.5,
        reviews: 1289,
        inStock: true,
        stock: 45,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          battery: '5.5 hours ANC (25 hours with case)',
          features: ['Adjustable ANC', '6-Mic Technology', 'HearThrough', 'Wireless Charging', 'IPX4']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Liberty NC Wireless Earbuds',
        slug: 'liberty-nc-wireless-earbuds',
        description: 'Flagship earbuds with adaptive ANC and LDAC audio. Exceptional value for money.',
        price: 99,
        oldPrice: 129,
        discount: 23,
        image: '/products/wireless-earphones/earphones-5.jpg',
        images: '/products/wireless-earphones/earphones-5.jpg',
        categoryId: categories[2].id,
        colors: 'Black, White, Sky Blue, Pink',
        sizes: '',
        rating: 4.7,
        reviews: 2456,
        inStock: true,
        stock: 60,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '10 hours ANC (50 hours with case)',
          features: ['Adaptive ANC 2.0', 'LDAC Audio', 'Wireless Charging', 'IPX4', '11mm Drivers']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Fit Pro Sports Earbuds',
        slug: 'fit-pro-sports-earbuds',
        description: 'Secure-fit earbuds with Active Noise Cancelling and powerful bass. Perfect for sports.',
        price: 189,
        oldPrice: 199,
        discount: 5,
        image: '/products/wireless-earphones/earphones-6.jpg',
        images: '/products/wireless-earphones/earphones-6.jpg',
        categoryId: categories[2].id,
        colors: 'Black, Stone Purple, Sage Gray, White',
        sizes: '',
        rating: 4.6,
        reviews: 1823,
        inStock: true,
        stock: 42,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '6 hours ANC (24 hours with case)',
          features: ['Active Noise Cancelling', 'Transparency Mode', 'Spatial Audio', 'IPX4', 'Wingtip Design']
        }
      },
    }),


    // Chargers & Cables (6 products)
    prisma.product.create({
      data: {
        name: '150W GaN 4-Port Charger',
        slug: '150w-gan-4port-charger',
        description: '150W 4-port GaN charger with intelligent power distribution. Charge up to 4 devices simultaneously.',
        price: 109,
        oldPrice: 129,
        discount: 16,
        image: '/products/cables/charger-1.jpg',
        images: '/products/cables/charger-1.jpg',
        categoryId: categories[3].id,
        colors: 'Black, White',
        sizes: '',
        rating: 4.8,
        reviews: 1234,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '150W Total (2x USB-C, 2x USB-A)',
          features: ['GaN Technology', 'PowerIQ 4.0', 'Compact Design', 'ActiveShield 2.0', 'Foldable Plug']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'USB-C to Lightning Cable MFi',
        slug: 'usb-c-lightning-cable-mfi',
        description: 'MFi certified USB-C to Lightning cable for fast charging and data transfer.',
        price: 19,
        oldPrice: 29,
        discount: 34,
        image: '/products/cables/charger-2.jpg',
        images: '/products/cables/charger-2.jpg',
        categoryId: categories[3].id,
        colors: 'White',
        sizes: '1m, 2m',
        rating: 4.9,
        reviews: 4523,
        inStock: true,
        stock: 75,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: 'Up to 20W Fast Charging',
          features: ['MFi Certified', 'Premium Quality', 'Fast Charging', 'Data Transfer', 'Durable Design']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: '3-in-1 Wireless Charging Station',
        slug: '3in1-wireless-charging-station',
        description: 'Wireless charging pad for phone, smartwatch, and earbuds. Fast 15W MagSafe charging.',
        price: 149,
        oldPrice: 169,
        discount: 12,
        image: '/products/cables/charger-3.jpg',
        images: '/products/cables/charger-3.jpg',
        categoryId: categories[3].id,
        colors: 'Black, White',
        sizes: '',
        rating: 4.7,
        reviews: 892,
        inStock: true,
        stock: 35,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '15W MagSafe Wireless Charging',
          features: ['3-in-1 Charging', 'MagSafe Compatible', 'Fast Charge', 'LED Indicator', 'Non-Slip Base']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'PowerLine III USB-C Cable',
        slug: 'powerline-iii-usb-c-cable',
        description: 'Ultra-durable USB-C to USB-C cable. Tested to withstand 35,000+ bends. 100W fast charging.',
        price: 15,
        oldPrice: 22,
        discount: 32,
        image: '/products/cables/charger-4.jpg',
        images: '/products/cables/charger-4.jpg',
        categoryId: categories[3].id,
        colors: 'Black, White, Gray, Blue',
        sizes: '0.9m, 1.8m, 3m',
        rating: 4.8,
        reviews: 3456,
        inStock: true,
        stock: 80,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '100W (USB PD)',
          features: ['Ultra-Durable', '35000+ Bend Lifespan', 'Fast Charging', 'Data Transfer', 'Double-Braided']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: '45W GaN Wall Charger',
        slug: '45w-gan-wall-charger',
        description: 'Compact 45W GaN wall charger with foldable plug. Fast charges laptops, tablets, and phones.',
        price: 34,
        oldPrice: 49,
        discount: 31,
        image: '/products/cables/charger-5.jpg',
        images: '/products/cables/charger-5.jpg',
        categoryId: categories[3].id,
        colors: 'Black, White',
        sizes: '',
        rating: 4.6,
        reviews: 678,
        inStock: true,
        stock: 55,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          power: '45W USB-C PD',
          features: ['GaN Technology', 'Compact Size', 'Foldable Plug', 'Fast Charging', 'Universal Compatibility']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Premium Braided USB-C Cable',
        slug: 'premium-braided-usb-c-cable',
        description: 'Premium braided USB-C cable with double-braided nylon. Supports up to 60W charging.',
        price: 24,
        oldPrice: 34,
        discount: 29,
        image: '/products/cables/charger-6.jpg',
        images: '/products/cables/charger-6.jpg',
        categoryId: categories[3].id,
        colors: 'Black, White, Blue, Pink',
        sizes: '1m, 2m, 3m',
        rating: 4.7,
        reviews: 1567,
        inStock: true,
        stock: 65,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          power: '60W USB PD',
          features: ['Double-Braided Nylon', 'Fast Charging', 'Data Transfer', 'Durable Design', '2-Year Warranty']
        }
      },
    }),

    // Power Banks (6 products)
    prisma.product.create({
      data: {
        name: 'PowerCore 26800mAh Power Bank',
        slug: 'powercore-26800-power-bank',
        description: 'Ultra-high capacity portable charger with dual input ports and triple USB outputs.',
        price: 59,
        oldPrice: 79,
        discount: 25,
        image: '/products/power-banks/powerbank-1.jpg',
        images: '/products/power-banks/powerbank-1.jpg',
        categoryId: categories[4].id,
        colors: 'Black',
        sizes: '',
        rating: 4.7,
        reviews: 8934,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          capacity: '26800mAh (96.48Wh)',
          output: '3 USB Ports, 6A Total',
          features: ['Charges iPhone 10x', 'MultiProtect Safety', 'Dual Input Ports', 'LED Indicator']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'MagGo 10000mAh Magnetic Power Bank',
        slug: 'maggo-10000-magnetic-power-bank',
        description: 'Magnetic wireless power bank with MagSafe compatibility. Compact and powerful.',
        price: 69,
        oldPrice: 89,
        discount: 22,
        image: '/products/power-banks/powerbank-2.jpg',
        images: '/products/power-banks/powerbank-2.jpg',
        categoryId: categories[4].id,
        colors: 'Black, White, Blue, Pink',
        sizes: '',
        rating: 4.6,
        reviews: 1567,
        inStock: true,
        stock: 45,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          capacity: '10000mAh',
          output: '15W Wireless + 20W USB-C',
          features: ['MagSafe Compatible', 'Wireless Charging', 'Foldable Stand', 'Pass-Through Charging']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: '20000mAh USB-C PD Power Bank',
        slug: '20000-usb-c-pd-power-bank',
        description: 'Portable charger with 60W USB-C Power Delivery for laptops and phones.',
        price: 49,
        oldPrice: 69,
        discount: 29,
        image: '/products/power-banks/powerbank-3.jpg',
        images: '/products/power-banks/powerbank-3.jpg',
        categoryId: categories[4].id,
        colors: 'Black',
        sizes: '',
        rating: 4.5,
        reviews: 2341,
        inStock: true,
        stock: 55,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          capacity: '20000mAh (74Wh)',
          output: '60W USB-C PD + 18W USB-A',
          features: ['Laptop Compatible', 'Fast Charging', 'LED Display', 'Premium Aluminum']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: '65W Laptop Power Bank 20000mAh',
        slug: '65w-laptop-power-bank-20000',
        description: 'High-speed power bank with 65W USB-C PD for MacBook, laptops, tablets, and phones.',
        price: 79,
        oldPrice: 99,
        discount: 20,
        image: '/products/power-banks/powerbank-4.jpg',
        images: '/products/power-banks/powerbank-4.jpg',
        categoryId: categories[4].id,
        colors: 'Black, White',
        sizes: '',
        rating: 4.7,
        reviews: 1834,
        inStock: true,
        stock: 40,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          capacity: '20000mAh (72Wh)',
          output: '65W USB-C PD',
          features: ['MacBook Compatible', 'Digital Display', 'Fast Recharge', '4 Output Ports']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Nano Power Bank 10000mAh',
        slug: 'nano-power-bank-10000',
        description: 'Ultra-compact power bank with built-in USB-C cable. Pocket-sized powerhouse.',
        price: 35,
        oldPrice: 49,
        discount: 29,
        image: '/products/power-banks/powerbank-5.jpg',
        images: '/products/power-banks/powerbank-5.jpg',
        categoryId: categories[4].id,
        colors: 'Black, White, Blue, Pink',
        sizes: '',
        rating: 4.6,
        reviews: 3452,
        inStock: true,
        stock: 70,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          capacity: '10000mAh',
          output: '22.5W USB-C',
          features: ['Built-in USB-C Cable', 'Ultra Compact', 'Fast Charging', 'LED Display']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Powerstation Plus XL 12000mAh',
        slug: 'powerstation-plus-xl-12000',
        description: 'Premium power bank with integrated cables for universal compatibility.',
        price: 89,
        oldPrice: 119,
        discount: 25,
        image: '/products/power-banks/powerbank-6.jpg',
        images: '/products/power-banks/powerbank-6.jpg',
        categoryId: categories[4].id,
        colors: 'Black',
        sizes: '',
        rating: 4.5,
        reviews: 892,
        inStock: true,
        stock: 30,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          capacity: '12000mAh',
          output: '18W',
          features: ['Built-in Cables', 'USB-C & Lightning', 'Premium Fabric Finish', 'Priority+ Charging']
        }
      },
    }),

    // Adapters (6 products)
    prisma.product.create({
      data: {
        name: 'Apple - Power Adapter, USB-C, 70W',
        slug: 'apple-power-adapter-usb-c-70w',
        description: 'Original Apple USB-C power adapter with 70W output for fast and reliable charging.',
        price: 72,
        oldPrice: 72,
        discount: 0,
        image: '/products/charging-adapters/adapter-1.jpg',
        images: '/products/charging-adapters/adapter-1.jpg',
        categoryId: categories[5].id,
        colors: '',
        sizes: '',
        rating: 4.6,
        reviews: 2456,
        inStock: true,
        stock: 80,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '70W',
          ports: 'USB-C',
          brand: 'Apple'
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ugreen - CD294, 45W',
        slug: 'ugreen-cd294-45w',
        description: 'Ugreen CD294 compact charger with 45W fast charging support.',
        price: 31,
        oldPrice: 31,
        discount: 0,
        image: '/products/charging-adapters/adapter-2.jpg',
        images: '/products/charging-adapters/adapter-2.jpg',
        categoryId: categories[5].id,
        colors: '',
        sizes: '',
        rating: 4.8,
        reviews: 1789,
        inStock: true,
        stock: 45,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '45W',
          ports: '2x USB-C',
          brand: 'Ugreen',
          model: 'CD294'
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ugreen - CD361, 65W',
        slug: 'ugreen-cd361-65w',
        description: 'Ugreen CD361 GaN charger with 65W output and fast USB charging.',
        price: 26,
        oldPrice: 26,
        discount: 0,
        image: '/products/charging-adapters/adapter-3.jpg',
        images: '/products/charging-adapters/adapter-3.jpg',
        categoryId: categories[5].id,
        colors: '',
        sizes: '',
        rating: 4.7,
        reviews: 3245,
        inStock: true,
        stock: 60,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '65W',
          ports: '2x USB-C, USB',
          brand: 'Ugreen',
          model: 'CD361'
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Canyon - OnCharge 250, 25W',
        slug: 'canyon-oncharge-250-25w',
        description: 'Canyon OnCharge 250 wall charger with 25W output and USB/USB-C connectivity.',
        price: 10,
        oldPrice: 10,
        discount: 0,
        image: '/products/charging-adapters/adapter-4.jpg',
        images: '/products/charging-adapters/adapter-4.jpg',
        categoryId: categories[5].id,
        colors: '',
        sizes: '',
        rating: 4.6,
        reviews: 1234,
        inStock: true,
        stock: 55,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          power: '25W',
          ports: 'USB, USB-C',
          brand: 'Canyon',
          series: 'OnCharge 250'
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'TTEC - SmartCharger, 20W',
        slug: 'ttec-smartcharger-20w',
        description: 'TTEC SmartCharger compact charger with 20W power for everyday fast charging.',
        price: 15,
        oldPrice: 15,
        discount: 0,
        image: '/products/charging-adapters/adapter-5.jpg',
        images: '/products/charging-adapters/adapter-5.jpg',
        categoryId: categories[5].id,
        colors: '',
        sizes: '',
        rating: 4.7,
        reviews: 5678,
        inStock: true,
        stock: 90,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          power: '20W',
          ports: 'USB-C',
          brand: 'TTEC',
          series: 'SmartCharger'
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Canyon - Hexagon 65 GaN, USB-A/C, 65W',
        slug: 'canyon-hexagon-65-gan-usb-a-c-65w',
        description: 'Canyon Hexagon 65 GaN charger with dual USB-C and USB-A ports, 65W output.',
        price: 34,
        oldPrice: 34,
        discount: 0,
        image: '/products/charging-adapters/adapter-6.jpg',
        images: '/products/charging-adapters/adapter-6.jpg',
        categoryId: categories[5].id,
        colors: '',
        sizes: '',
        rating: 4.8,
        reviews: 1456,
        inStock: true,
        stock: 35,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '65W',
          ports: '2x USB-C, USB-A',
          brand: 'Canyon',
          series: 'Hexagon 65 GaN'
        }
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);
  // Create an admin user for local development if it doesn't exist
  const adminEmail = 'nstoyanov639@gmail.com';
  const adminPassword = '123123';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        name: 'Admin',
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log(`✅ Created admin user ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin user ${adminEmail} already exists`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
