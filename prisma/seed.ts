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
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Screen Protectors',
        slug: 'screen-protectors',
        description: 'Keep your screen scratch-free',
        image: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Wireless Earphones',
        slug: 'wireless-earphones',
        description: 'Premium sound quality',
        image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Chargers & Cables',
        slug: 'chargers-cables',
        description: 'Fast charging solutions',
        image: 'https://images.pexels.com/photos/4219863/pexels-photo-4219863.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Power Banks',
        slug: 'power-banks',
        description: 'Portable power on the go',
        image: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Adapters',
        slug: 'adapters',
        description: 'Universal connectivity solutions',
        image: 'https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  const products = await Promise.all([
    // Phone Cases (6 products) - Real branded products
    prisma.product.create({
      data: {
        name: 'Apple Silicone Case with MagSafe',
        slug: 'apple-silicone-magsafe-case',
        description: 'Official Apple silicone case with built-in MagSafe technology. Soft-touch finish with microfiber lining.',
        price: 49,
        oldPrice: 59,
        discount: 17,
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
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
          features: ['MagSafe Charging', 'Soft-Touch Finish', 'Raised Edges', 'Official Apple Product']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Spigen Ultra Hybrid Clear Case',
        slug: 'spigen-ultra-hybrid-clear',
        description: 'Crystal clear TPU bumper with rigid PC back. Shows off your phone while providing military-grade drop protection.',
        price: 29,
        oldPrice: 39,
        discount: 26,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80',
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
          protection: 'Air Cushion Technology, MIL-STD 810G-516.6',
          features: ['Crystal Clear', 'Anti-Yellowing', 'Wireless Charging', 'Raised Bezels']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'OtterBox Defender Series Pro',
        slug: 'otterbox-defender-series-pro',
        description: 'Ultimate rugged protection with port covers and holster clip. Built for extreme conditions.',
        price: 64,
        oldPrice: 79,
        discount: 19,
        image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&q=80',
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
        name: 'dbrand Grip Case',
        slug: 'dbrand-grip-case',
        description: 'Textured grip case with customizable skin panels. Engineered for maximum grip and drop protection.',
        price: 55,
        oldPrice: 65,
        discount: 15,
        image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
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
        name: 'Casetify Impact Case',
        slug: 'casetify-impact-case',
        description: 'Fashion-forward protection with 6.6ft drop rating. Features antimicrobial coating and artistic designs.',
        price: 59,
        oldPrice: 75,
        discount: 21,
        image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=600&q=80',
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
        name: 'Spigen Tough Armor MagSafe',
        slug: 'spigen-tough-armor-magsafe',
        description: 'Dual-layer protection with built-in kickstand and MagSafe compatibility. Engineered for maximum impact absorption.',
        price: 44,
        oldPrice: 55,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&q=80',
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


    // Screen Protectors (6 products) - Real branded products
    prisma.product.create({
      data: {
        name: 'Belkin ScreenForce UltraGlass',
        slug: 'belkin-screenforce-ultraglass',
        description: 'Precision-engineered Belkin screen protector with 9H hardness. Double-ion exchange technology for superior strength.',
        price: 39,
        oldPrice: 49,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&q=80',
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
        name: 'Spigen Glas.tR EZ Fit',
        slug: 'spigen-glastr-ez-fit',
        description: 'Auto-align installation kit with 9H hardness glass. Crystal clear with oleophobic coating.',
        price: 24,
        oldPrice: 32,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&q=80',
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
        name: 'OtterBox Alpha Glass',
        slug: 'otterbox-alpha-glass',
        description: 'Strengthened glass with anti-shatter film. Tested to withstand drops and impacts.',
        price: 44,
        oldPrice: 54,
        discount: 19,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
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
        name: 'Zagg InvisibleShield Glass Elite',
        slug: 'zagg-invisibleshield-glass-elite',
        description: 'Premium glass with ClearPrint technology that makes fingerprints virtually invisible.',
        price: 49,
        oldPrice: 59,
        discount: 17,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
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
        name: 'Spigen AlignMaster Privacy',
        slug: 'spigen-alignmaster-privacy',
        description: 'Privacy screen protector with auto-align installation. Blocks side viewing at 30° angles.',
        price: 34,
        oldPrice: 44,
        discount: 23,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
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
        name: 'amFilm OneTouch Glass',
        slug: 'amfilm-onetouch-glass',
        description: 'Premium glass with one-touch installation frame. 3-pack with lifetime replacement warranty.',
        price: 19,
        oldPrice: 29,
        discount: 34,
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
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


    // Wireless Earphones (6 products) - Real branded products
    prisma.product.create({
      data: {
        name: 'Apple AirPods Pro (2nd Generation)',
        slug: 'apple-airpods-pro-2nd-gen',
        description: 'Official Apple AirPods Pro with Active Noise Cancellation, Adaptive Audio, and MagSafe charging case.',
        price: 249,
        oldPrice: 279,
        discount: 11,
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
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
        name: 'Sony WF-1000XM5',
        slug: 'sony-wf-1000xm5',
        description: 'Premium Sony earbuds with industry-leading noise cancellation and exceptional sound quality.',
        price: 299,
        oldPrice: 329,
        discount: 9,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
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
        name: 'Samsung Galaxy Buds2 Pro',
        slug: 'samsung-galaxy-buds2-pro',
        description: 'Samsung flagship earbuds with intelligent ANC and seamless Galaxy ecosystem integration.',
        price: 199,
        oldPrice: 229,
        discount: 13,
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80',
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
        name: 'Jabra Elite 85t',
        slug: 'jabra-elite-85t',
        description: 'Professional-grade earbuds with adjustable ANC and superior call quality.',
        price: 179,
        oldPrice: 229,
        discount: 22,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80',
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
        name: 'Anker Soundcore Liberty 4 NC',
        slug: 'anker-soundcore-liberty-4-nc',
        description: 'Anker flagship earbuds with adaptive ANC and LDAC audio. Exceptional value for money.',
        price: 99,
        oldPrice: 129,
        discount: 23,
        image: 'https://images.unsplash.com/photo-1631867675167-90a456a90863?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1631867675167-90a456a90863?w=600&q=80',
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
        name: 'Beats Fit Pro',
        slug: 'beats-fit-pro',
        description: 'Secure-fit earbuds with Apple H1 chip, Active Noise Cancelling, and powerful bass.',
        price: 189,
        oldPrice: 199,
        discount: 5,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
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
          features: ['Active Noise Cancelling', 'Transparency Mode', 'Spatial Audio', 'IPX4', 'Apple H1 Chip', 'Wingtip Design']
        }
      },
    }),


    // Chargers & Cables (6 products) - Real branded products
    prisma.product.create({
      data: {
        name: 'Anker 747 GaN Prime Charger',
        slug: 'anker-747-gan-prime-charger',
        description: 'Anker 150W 4-port GaN charger with PowerIQ 4.0. Charge up to 4 devices simultaneously.',
        price: 109,
        oldPrice: 129,
        discount: 16,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
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
        name: 'Apple USB-C to Lightning Cable',
        slug: 'apple-usb-c-lightning-cable',
        description: 'Official Apple USB-C to Lightning cable. MFi certified for fast charging and data transfer.',
        price: 19,
        oldPrice: 29,
        discount: 34,
        image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80',
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
          features: ['MFi Certified', 'Official Apple Product', 'Fast Charging', 'Data Transfer', 'Durable Design']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Belkin BoostCharge Pro 3-in-1',
        slug: 'belkin-boostcharge-pro-3in1',
        description: 'Belkin wireless charging pad for iPhone, Apple Watch, and AirPods. Fast 15W MagSafe charging.',
        price: 149,
        oldPrice: 169,
        discount: 12,
        image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=600&q=80',
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
        name: 'Anker PowerLine III USB-C Cable',
        slug: 'anker-powerline-iii-usb-c',
        description: 'Ultra-durable USB-C to USB-C cable. Tested to withstand 35,000+ bends. 100W fast charging.',
        price: 15,
        oldPrice: 22,
        discount: 32,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
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
        name: 'Spigen ArcStation Pro GaN Charger',
        slug: 'spigen-arcstation-pro-gan',
        description: 'Compact 45W GaN wall charger with foldable plug. Fast charges laptops, tablets, and phones.',
        price: 34,
        oldPrice: 49,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
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
        name: 'Belkin BOOST↑CHARGE USB-C to USB-C',
        slug: 'belkin-boost-charge-usb-c',
        description: 'Premium braided USB-C cable with double-braided nylon. Supports up to 60W charging.',
        price: 24,
        oldPrice: 34,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80',
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

    // Power Banks (6 products) - Real branded products
    prisma.product.create({
      data: {
        name: 'Anker PowerCore 26800mAh',
        slug: 'anker-powercore-26800',
        description: 'Anker ultra-high capacity portable charger with dual input ports and triple USB outputs.',
        price: 59,
        oldPrice: 79,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
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
        name: 'Anker MagGo 10000mAh MagSafe',
        slug: 'anker-maggo-10000-magsafe',
        description: 'Magnetic wireless power bank with MagSafe compatibility. Compact and powerful.',
        price: 69,
        oldPrice: 89,
        discount: 22,
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&q=80',
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
        name: 'RAVPower 20000mAh USB-C PD',
        slug: 'ravpower-20000-usb-c-pd',
        description: 'RAVPower portable charger with 60W USB-C Power Delivery for laptops and phones.',
        price: 49,
        oldPrice: 69,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1618410320928-25228d811631?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1618410320928-25228d811631?w=600&q=80',
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
        name: 'Baseus 65W 20000mAh Laptop Power Bank',
        slug: 'baseus-65w-20000-laptop',
        description: 'Baseus high-speed power bank with 65W USB-C PD for MacBook, laptops, tablets, and phones.',
        price: 79,
        oldPrice: 99,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
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
        name: 'Anker Nano Power Bank 10000mAh',
        slug: 'anker-nano-power-bank-10000',
        description: 'Ultra-compact Anker power bank with built-in USB-C cable. Pocket-sized powerhouse.',
        price: 35,
        oldPrice: 49,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?w=600&q=80',
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
        name: 'Mophie Powerstation Plus XL',
        slug: 'mophie-powerstation-plus-xl',
        description: 'Premium Mophie power bank with integrated cables for universal compatibility.',
        price: 89,
        oldPrice: 119,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1587145820098-e66bb446b5f6?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1587145820098-e66bb446b5f6?w=600&q=80',
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

    // Adapters (6 products) - Real branded products
    prisma.product.create({
      data: {
        name: 'Apple USB-C to 3.5mm Headphone Jack',
        slug: 'apple-usb-c-headphone-adapter',
        description: 'Official Apple adapter for connecting 3.5mm headphones to USB-C devices. High-quality DAC.',
        price: 9,
        oldPrice: 12,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        categoryId: categories[5].id,
        colors: 'White',
        sizes: '',
        rating: 4.6,
        reviews: 2456,
        inStock: true,
        stock: 80,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          compatibility: 'USB-C to 3.5mm',
          features: ['Official Apple Product', 'High-Quality DAC', 'Compact Design', 'Plug & Play']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Apple USB-C Digital AV Multiport',
        slug: 'apple-usb-c-multiport-adapter',
        description: 'Official Apple multiport adapter with HDMI, USB-A, and USB-C charging. 4K support.',
        price: 69,
        oldPrice: 79,
        discount: 13,
        image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=600&q=80',
        categoryId: categories[5].id,
        colors: 'White',
        sizes: '',
        rating: 4.8,
        reviews: 1789,
        inStock: true,
        stock: 45,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          compatibility: 'USB-C Hub',
          features: ['4K HDMI', 'USB 3.1', 'USB-C Charging', 'Official Apple Product', 'Premium Build']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Anker 7-in-1 USB-C Hub',
        slug: 'anker-7in1-usb-c-hub',
        description: 'Anker premium USB-C hub with 4K HDMI, USB 3.0, SD/microSD readers, and 100W charging.',
        price: 45,
        oldPrice: 59,
        discount: 24,
        image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80',
        categoryId: categories[5].id,
        colors: 'Space Gray, Black',
        sizes: '',
        rating: 4.7,
        reviews: 3245,
        inStock: true,
        stock: 60,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          compatibility: 'USB-C Hub',
          features: ['4K HDMI@60Hz', '2x USB 3.0', '100W PD', 'SD/microSD Reader', 'Ethernet Port', 'Aluminum Body']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Belkin USB-C to HDMI Adapter',
        slug: 'belkin-usb-c-hdmi-adapter',
        description: 'Belkin USB-C to HDMI adapter supporting 4K@60Hz. Compact and reliable.',
        price: 29,
        oldPrice: 39,
        discount: 26,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
        categoryId: categories[5].id,
        colors: 'Black, White',
        sizes: '',
        rating: 4.6,
        reviews: 1234,
        inStock: true,
        stock: 55,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          compatibility: 'USB-C to HDMI',
          features: ['4K@60Hz', 'Plug & Play', 'Compact Design', 'Universal Compatibility', '2-Year Warranty']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Anker USB-C to USB-A Adapter (2-Pack)',
        slug: 'anker-usb-c-to-usb-a-adapter',
        description: 'Anker high-speed USB-C to USB-A adapters. Perfect for connecting legacy devices.',
        price: 9,
        oldPrice: 14,
        discount: 36,
        image: 'https://images.unsplash.com/photo-1625814240467-8c8c9092e793?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1625814240467-8c8c9092e793?w=600&q=80',
        categoryId: categories[5].id,
        colors: 'Black',
        sizes: '',
        rating: 4.7,
        reviews: 5678,
        inStock: true,
        stock: 90,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          compatibility: 'USB-C to USB-A',
          features: ['2-Pack', 'USB 3.0 Speed', 'Compact Design', 'Aluminum Housing', 'Universal Compatibility']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Satechi USB-C Pro Hub',
        slug: 'satechi-usb-c-pro-hub',
        description: 'Premium Satechi aluminum hub with 4K HDMI, Ethernet, card readers, and pass-through charging.',
        price: 99,
        oldPrice: 129,
        discount: 23,
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
        images: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
        categoryId: categories[5].id,
        colors: 'Space Gray, Silver',
        sizes: '',
        rating: 4.8,
        reviews: 1456,
        inStock: true,
        stock: 35,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          compatibility: 'USB-C Hub',
          features: ['4K HDMI', 'Gigabit Ethernet', 'SD/microSD', '100W PD', 'USB 3.0', 'Premium Aluminum']
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