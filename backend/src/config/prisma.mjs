export const SEEDED_PRODUCTS = [
  {
    id: "prod_tee_steel",
    name: "Explore Every Day Graphic Tee",
    tagline: "100% combed organic cotton with water-based eco print",
    description: "Engineered for everyday durability and unmatched comfort. Crafted with pre-shrunk organic ring-spun cotton that gets softer with every wash. Designed with reinforced double-needle stitching on the collar and hem.",
    priceInCents: 2200,
    originalPriceInCents: 2800,
    category: "Shirt",
    subCategory: "Shirt",
    gender: "kids",
    stock: 80,
    reservedStock: 1,
    rating: 4.8,
    reviewCount: 142,
    features: [
          "100% GOTS certified organic ring-spun cotton",
          "Non-toxic water-based screen printing",
          "Pre-shrunk fabric to prevent shrinking in wash",
          "Reinforced shoulder-to-shoulder neck tape"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Steel Blue",
                "hex": "#607D8B"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          },
          {
                "name": "Grey",
                "hex": "#9A9A9A"
          }
    ],
    images: [
      "/products/product_tee.png",
      "/products/product_shirt.png"
    ],
    tags: ["shirt","shirts","tee","graphic-tee","kids","cotton","summer"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_jogger_olive",
    name: "Kids Jogger Pant",
    tagline: "Tough flex cotton blend jogger with reinforced knees",
    description: "The ultimate play-ready jogger designed to withstand rough tumble and play. Features an elasticated ribbed waistband with an adjustable drawstring, roomy side pockets, and durable articulated knee paneling.",
    priceInCents: 2500,
    originalPriceInCents: 3200,
    category: "Pant",
    subCategory: "Pant",
    gender: "kids",
    stock: 35,
    reservedStock: 1,
    rating: 4.9,
    reviewCount: 98,
    features: [
          "98% durable organic cotton twill, 2% elastane flex",
          "Articulated knee construction for maximum mobility",
          "Encased elastic cuffs and waistband with cotton drawcord",
          "Deep front pockets and secure rear welt pocket"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          }
    ],
    images: [
      "/products/product_sweatpants.png",
      "/products/product_denim.png"
    ],
    tags: ["pant","pants","jogger","bottoms","kids","twill","playwear"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_hoodie_sage",
    name: "Kids Crewneck Sweatshirt",
    tagline: "Cozy heavyweight French terry fleece in seasonal pastels",
    description: "A timeless cozy wardrobe essential. Brushed on the inside for cloud-like softness, our French terry sweatshirt provides lightweight warmth during brisk mornings and evening adventures.",
    priceInCents: 3200,
    originalPriceInCents: 4000,
    category: "Outerwear",
    subCategory: "Hoodie",
    gender: "kids",
    stock: 12,
    reservedStock: 0,
    rating: 4.7,
    reviewCount: 76,
    features: [
          "380 GSM Heavyweight brushed French terry",
          "Raglan sleeves for natural silhouette & easy layering",
          "Ribbed collar, cuffs, and hem with Lycra memory retention",
          "Flatlock seams to eliminate chafing"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Grey",
                "hex": "#9A9A9A"
          }
    ],
    images: [
      "/products/product_hoodie.png",
      "/products/product_sweatpants.png"
    ],
    tags: ["outerwear","hoodie","hoodies","sweatshirt","crewneck","fleece","kids"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_jacket_denim",
    name: "Vintage Wash Denim Trucker Jacket",
    tagline: "Heavy 13oz Japanese selvedge-inspired rigid denim",
    description: "Classic heritage styling meets modern tailoring. Finished with antique brass shank buttons, dual button-flap chest pockets, and waist cinch adjusters.",
    priceInCents: 6800,
    originalPriceInCents: 8500,
    category: "Outerwear",
    subCategory: "Jacket",
    gender: "men",
    stock: 24,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 112,
    features: [
          "13oz 100% durable cotton denim with authentic fading",
          "Point collar with brass shank button front closure",
          "Dual chest flap pockets and deep interior stow pockets",
          "Adjustable button tabs at back waist"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          }
    ],
    images: [
      "/products/studio_denim_jacket.jpg",
      "/products/product_coat.png"
    ],
    tags: ["outerwear","jacket","jackets","denim","trucker","men"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_knit_sweater",
    name: "Merino Wool Cable Knit Sweater",
    tagline: "Heirloom gauge Australian merino wool in heritage stitch",
    description: "Naturally thermo-regulating and odor-resistant. Intricately knit with traditional honeycomb and cable patterns that elevate everyday attire.",
    priceInCents: 5400,
    originalPriceInCents: 7000,
    category: "Outerwear",
    subCategory: "Knitwear",
    gender: "men",
    stock: 28,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 89,
    features: [
          "100% Superfine Australian Merino wool",
          "Traditional honeycomb and rope cable knit pattern",
          "Heavyweight 5-gauge knit for extreme warmth",
          "Reinforced crew neckline with ribbed hem and cuffs"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "White",
                "hex": "#F5F5F5"
          },
          {
                "name": "Green",
                "hex": "#3D7A44"
          },
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          }
    ],
    images: [
      "/products/product_knitwear.png",
      "/products/product_hoodie.png"
    ],
    tags: ["outerwear","knitwear","knit","sweater","sweaters","merino","wool","men"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_canvas_tote",
    name: "Heavyweight Utility Canvas Tote",
    tagline: "20oz industrial waterproof waxed canvas shopper",
    description: "Engineered for daily groceries, weekend farmers markets, and work commutes. Includes internal zip pocket and brass key clip lanyard.",
    priceInCents: 2800,
    originalPriceInCents: 3500,
    category: "Accessories",
    subCategory: "Accessories",
    gender: "unisex",
    stock: 55,
    reservedStock: 0,
    rating: 4.7,
    reviewCount: 64,
    features: [
          "20oz Double-ply heavyweight organic cotton canvas",
          "Dual reinforced rolled carry handles with 10\" shoulder drop",
          "Internal zippered security pocket for phone & wallet",
          "Solid brass interior key clip clasp"
    ],
    availableSizes: ["One Size"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          }
    ],
    images: [
      "/products/studio_tote_bag.jpg",
      "/products/product_cardholder.png"
    ],
    tags: ["accessories","bag","tote","canvas","shopper","unisex"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_beanie_merino",
    name: "Ribbed Merino Wool Beanie",
    tagline: "Dense 7-gauge rib knit for supreme warmth without itch",
    description: "Versatile watchcap silhouette with an adjustable roll cuff. Breathable, antibacterial, and completely itch-free for sensitive scalps.",
    priceInCents: 1800,
    originalPriceInCents: 2400,
    category: "Accessories",
    subCategory: "Hat",
    gender: "unisex",
    stock: 45,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 153,
    features: [
          "100% Extra-fine Merino wool yarn",
          "Adjustable fold-over cuff for custom fit and ear coverage",
          "Seamless 3D circular knit crown",
          "Natural moisture-wicking and odor-resistant properties"
    ],
    availableSizes: ["One Size"],
    availableColors: [
          {
                "name": "Red",
                "hex": "#C0392B"
          },
          {
                "name": "Grey",
                "hex": "#9A9A9A"
          },
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          }
    ],
    images: [
      "/products/studio_beanie_scarf.jpg",
      "/products/product_knitwear.png"
    ],
    tags: ["accessories","hat","hats","beanie","merino","knitwear","unisex"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_cargo_shorts",
    name: "Field Utility Cargo Shorts",
    tagline: "Weatherproof ripstop cotton with 6 tactical bellows pockets",
    description: "Rugged outdoor cargo shorts tailored for warm-weather hiking and urban expeditions. Built with heavy-duty mil-spec ripstop fabric.",
    priceInCents: 3400,
    originalPriceInCents: 4200,
    category: "Pant",
    subCategory: "Pant",
    gender: "men",
    stock: 40,
    reservedStock: 0,
    rating: 4.6,
    reviewCount: 58,
    features: [
          "100% Ripstop cotton with water-repellent DWR coating",
          "6 Multi-functional bellows pockets with drainage grommets",
          "Reinforced seat panel and gusseted crotch",
          "Custom heavy-duty YKK zipper with brass button fastening"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          }
    ],
    images: [
      "/products/product_sweatpants.png",
      "/products/product_denim.png"
    ],
    tags: ["pant","pants","shorts","cargo","bottoms","outdoor","men"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_men_oxford_shirt",
    name: "Classic Oxford Button-Down Shirt",
    tagline: "Pinpoint combed cotton basketweave with mother-of-pearl buttons",
    description: "The quintessential smart-casual staple. Cut with a modern tailored drape from breathable heavy pinpoint Oxford cotton. Features an authentic rolled button-down collar and single chest pocket.",
    priceInCents: 4800,
    originalPriceInCents: 6200,
    category: "Shirt",
    subCategory: "Shirt",
    gender: "men",
    stock: 52,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 168,
    features: [
          "100% Long-staple combed cotton pinpoint Oxford cloth",
          "Genuine mother-of-pearl cross-stitched buttons",
          "Classic box pleat with locker loop on reverse",
          "Pre-washed for vintage lived-in softness"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "White",
                "hex": "#F5F5F5"
          },
          {
                "name": "Steel Blue",
                "hex": "#607D8B"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          }
    ],
    images: [
      "/products/studio_oxford_shirt.jpg",
      "/products/product_shirt.png"
    ],
    tags: ["shirt","shirts","oxford","button-down","smart-casual","men"],
    isFeatured: true,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_men_heavy_hoodie",
    name: "Heavyweight French Terry Pullover Hoodie",
    tagline: "450 GSM custom-milled combed cotton fleece with double-lined hood",
    description: "Built like a fortress of comfort. Milled from ultra-dense 450 GSM low-shrink French terry with heavy rib side gussets for unrestricted mobility. Finished with metal-tipped braided drawcords.",
    priceInCents: 6200,
    originalPriceInCents: 7800,
    category: "Outerwear",
    subCategory: "Hoodie",
    gender: "men",
    stock: 38,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 205,
    features: [
          "450 GSM Heavyweight organic combed cotton",
          "Cross-grain cut fleece body to prevent vertical shrinkage",
          "Substantial double-layer self-fabric hood",
          "Heavyweight 1x1 rib side panels and kangaroo pocket"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          }
    ],
    images: [
      "/products/product_hoodie.png",
      "/products/product_sweatpants.png"
    ],
    tags: ["outerwear","hoodie","hoodies","sweatshirt","pullover","men"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_men_selvedge_denim",
    name: "Slim Taper Japanese Selvedge Jeans",
    tagline: "14oz red-line raw indigo denim woven on vintage shuttle looms",
    description: "Crafted for denim purists in Okayama. Milled with pure rope-dyed indigo yarn that fades into striking high-contrast honeycombs and whiskers over years of wear.",
    priceInCents: 7500,
    originalPriceInCents: 9500,
    category: "Pant",
    subCategory: "Pant",
    gender: "men",
    stock: 29,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 94,
    features: [
          "14oz 100% Zimbabwe long-staple cotton raw denim",
          "Classic red-line selvedge ID visible on turn-up cuffs",
          "Custom stamped copper doughnut button fly and rivets",
          "Thick debossed vegetable-tanned leather waistband patch"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          }
    ],
    images: [
      "/products/product_denim.png",
      "/products/product_sweatpants.png"
    ],
    tags: ["pant","pants","jeans","denim","selvedge","bottoms","men"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_men_wool_bomber",
    name: "Insulated Flight Bomber Jacket",
    tagline: "Water-repellent flight satin with PrimaLoft eco insulation",
    description: "A refined modern revision of military flight jackets. Features high-density twill shell that repels wind and sleet, quilted lining with eco insulation, and heavy 2-way antique brass zipper.",
    priceInCents: 8900,
    originalPriceInCents: 11000,
    category: "Outerwear",
    subCategory: "Jacket",
    gender: "men",
    stock: 22,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 134,
    features: [
          "High-density recycled nylon flight satin shell",
          "100g PrimaLoft Silver eco-fill insulation",
          "Heavy two-way YKK front zip with storm fly baffle",
          "Signature utility zip sleeve pocket with pen slots"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          }
    ],
    images: [
      "/products/product_coat.png",
      "/products/product_parka.png"
    ],
    tags: ["outerwear","jacket","jackets","bomber","flight-jacket","men"],
    isFeatured: true,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_men_relaxed_chino",
    name: "Pleated Relaxed Chino Trouser",
    tagline: "Brushed cotton twill with single forward pleats and cuffed hem",
    description: "Effortless relaxed tailoring. Designed with subtle front pleats for room around the thighs tapering into a neat hem. Peach-skin brushed finish offers rich texture and day-long softness.",
    priceInCents: 4500,
    originalPriceInCents: 5800,
    category: "Pant",
    subCategory: "Pant",
    gender: "men",
    stock: 46,
    reservedStock: 0,
    rating: 4.7,
    reviewCount: 88,
    features: [
          "100% Breathable brushed cotton twill (8.5oz)",
          "Front single pleats for easy draping comfort",
          "Corozo nut button closure with sturdy zip fly",
          "Deep slash side pockets and dual back welt pockets"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          }
    ],
    images: [
      "/products/product_sweatpants.png",
      "/products/product_denim.png"
    ],
    tags: ["pant","pants","chino","trouser","pleated","bottoms","men"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_men_waffle_crew",
    name: "Thermal Waffle-Knit Longsleeve",
    tagline: "320 GSM heavy waffle weave base layer in garment dye",
    description: "Engineered with a micro-thermal knit grid that traps ambient warmth while remaining lightweight and airy. Fitted ribbed cuffs keep sleeves in place when layered under jackets.",
    priceInCents: 3600,
    originalPriceInCents: 4600,
    category: "Shirt",
    subCategory: "Shirt",
    gender: "men",
    stock: 60,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 114,
    features: [
          "320 GSM 100% Organic cotton waffle weave",
          "Pre-washed and garment-dyed for dimensional color depth",
          "Extended 3-inch ribbed cuffs to seal out drafts",
          "Reinforced crewneck with flatlock topstitching"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Grey",
                "hex": "#9A9A9A"
          },
          {
                "name": "White",
                "hex": "#F5F5F5"
          },
          {
                "name": "Steel Blue",
                "hex": "#607D8B"
          }
    ],
    images: [
      "/products/product_tee.png",
      "/products/product_knitwear.png"
    ],
    tags: ["shirt","shirts","waffle","thermal","longsleeve","men"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_cashmere_crew",
    name: "Pure Cashmere Relaxed Crewneck",
    tagline: "Grade-A 2-ply Mongolian cashmere in featherweight luxury",
    description: "Indulgently soft against bare skin. Spun from sustainably harvested Grade-A cashmere fibers, creating an ethereal halo of weightless warmth that resists pilling season after season.",
    priceInCents: 7800,
    originalPriceInCents: 9800,
    category: "Outerwear",
    subCategory: "Knitwear",
    gender: "women",
    stock: 30,
    reservedStock: 0,
    rating: 5,
    reviewCount: 189,
    features: [
          "100% Grade-A Mongolian cashmere yarn (12-gauge)",
          "Subtle dropped shoulders for an effortless, relaxed silhouette",
          "Fine ribbed collar, hem, and extended wrist cuffs",
          "Oeko-Tex certified eco-friendly low-impact dyes"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "White",
                "hex": "#F5F5F5"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          }
    ],
    images: [
      "/products/product_knitwear.png",
      "/products/studio_women_blouse.jpg"
    ],
    tags: ["outerwear","knitwear","knit","sweater","cashmere","women"],
    isFeatured: true,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_linen_blouse",
    name: "Breezy French Linen Oversized Shirt",
    tagline: "Pre-washed Normandy flax with mother-of-pearl buttons",
    description: "Airy and graceful. Woven from 100% natural French flax that keeps you cool through sweltering afternoons and layers easily over swimwear or tanks. Features dropped shoulders and a curved step hem.",
    priceInCents: 5200,
    originalPriceInCents: 6600,
    category: "Shirt",
    subCategory: "Shirt",
    gender: "women",
    stock: 42,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 125,
    features: [
          "100% French Normandy linen (pre-washed for softness)",
          "Relaxed boxy cut with dropped shoulder and high-low curved hem",
          "Point collar with sustainable shell buttons",
          "Naturally thermo-regulating and antibacterial"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "White",
                "hex": "#F5F5F5"
          },
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          }
    ],
    images: [
      "/products/studio_women_blouse.jpg",
      "/products/product_shirt.png"
    ],
    tags: ["shirt","shirts","blouse","linen","summer","women"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_wide_trouser",
    name: "High-Rise Wide-Leg Pleated Pant",
    tagline: "Flowing drape stretch twill with sharp front pressed creases",
    description: "Sculpted high waist falling into dramatic, elongated wide legs. Tailored with front inverted double pleats and discreet stretch waistband facing for seamless comfort from morning meeting to dinner.",
    priceInCents: 5800,
    originalPriceInCents: 7400,
    category: "Pant",
    subCategory: "Pant",
    gender: "women",
    stock: 35,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 177,
    features: [
          "68% recycled poly, 28% viscose, 4% elastane stretch twill",
          "Architectural high-rise fit with hook & bar tab closure",
          "Crisp pressed center leg creases for lengthening line",
          "Deep functional side pockets and rear faux welt pockets"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          }
    ],
    images: [
      "/products/product_sweatpants.png",
      "/products/product_denim.png"
    ],
    tags: ["pant","pants","trouser","wide-leg","pleated","bottoms","women"],
    isFeatured: true,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_trench_coat",
    name: "Water-Resistant Storm Flap Trench Coat",
    tagline: "Heritage double-breasted gabardine with removable tie belt",
    description: "An iconic silhouette made weather-ready. Woven from tight-density cotton gabardine treated with a PFC-free water-resistant coating. Detailed with storm flaps, epaulettes, and horn buttons.",
    priceInCents: 11000,
    originalPriceInCents: 14000,
    category: "Outerwear",
    subCategory: "Jacket",
    gender: "women",
    stock: 18,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 95,
    features: [
          "100% Water-repellent cotton gabardine twill",
          "Double-breasted front with real tortoiseshell horn buttons",
          "Back storm flap, shoulder epaulettes, and buckle sleeve straps",
          "Detachable waist belt with faux horn D-rings"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          }
    ],
    images: [
      "/products/product_coat.png",
      "/products/product_parka.png"
    ],
    tags: ["outerwear","jacket","jackets","coat","trench","trench-coat","women"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_crop_hoodie",
    name: "Brushed Fleece Boxy Cropped Hoodie",
    tagline: "Cozy combed cotton fleece with wide silhouette and raw hem",
    description: "Modern streetwear edge meets weekend coziness. Features a roomy boxy cut hitting right at the high waistline, double-layered hood, and soft fleece interior.",
    priceInCents: 4400,
    originalPriceInCents: 5600,
    category: "Outerwear",
    subCategory: "Hoodie",
    gender: "women",
    stock: 50,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 140,
    features: [
          "380 GSM Brushed organic cotton-poly fleece",
          "Flattering boxy cropped silhouette with relaxed dropped shoulders",
          "Double-lined hood without bulky drawstrings for clean aesthetics",
          "Ribbed wrist cuffs with thumbholes"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Grey",
                "hex": "#9A9A9A"
          },
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "White",
                "hex": "#F5F5F5"
          }
    ],
    images: [
      "/products/product_hoodie.png",
      "/products/product_sweatpants.png"
    ],
    tags: ["outerwear","hoodie","hoodies","cropped","sweatshirt","women"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_ribbed_cardigan",
    name: "Chunky Ribbed V-Neck Cardigan",
    tagline: "Alpaca-wool blend knit with oversized tortoiseshell buttons",
    description: "Cozy and versatile for all seasons. Knit with a sumptuous alpaca wool blend in a tactile fisherman rib stitch, ideal for pairing over slip dresses or denim.",
    priceInCents: 6400,
    originalPriceInCents: 8200,
    category: "Outerwear",
    subCategory: "Knitwear",
    gender: "women",
    stock: 26,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 118,
    features: [
          "40% Alpaca, 35% Wool, 25% Recycled polyamide tactile yarn",
          "Plunging flattering V-neckline with exaggerated tortoiseshell buttons",
          "Fisherman patent rib stitch for bouncy insulating drape",
          "Deep welt hip pockets and ribbed borders"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "White",
                "hex": "#F5F5F5"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          }
    ],
    images: [
      "/products/product_knitwear.png",
      "/products/studio_women_blouse.jpg"
    ],
    tags: ["outerwear","knitwear","knit","cardigan","sweater","sweaters","alpaca","women"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_kids_puffer_jacket",
    name: "Recycled Down Lightweight Puffer Jacket",
    tagline: "650-fill power recycled down with water-repellent ripstop shell",
    description: "Featherweight warmth that packs down into its own pocket. Filled with certified 650-fill recycled down and wrapped in resilient mini-ripstop fabric.",
    priceInCents: 4800,
    originalPriceInCents: 6200,
    category: "Outerwear",
    subCategory: "Jacket",
    gender: "kids",
    stock: 34,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 104,
    features: [
          "100% Recycled nylon mini-ripstop with water-repellent finish",
          "650-Fill power ethically reclaimed down insulation",
          "Fleece-lined chin guard and elasticized hood binding",
          "Internal write-on ID label with hand-me-down tracking lines"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Steel Blue",
                "hex": "#607D8B"
          },
          {
                "name": "Red",
                "hex": "#C0392B"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          }
    ],
    images: [
      "/products/studio_puffer_jacket.jpg",
      "/products/product_parka.png"
    ],
    tags: ["outerwear","jacket","jackets","puffer","down","winter","kids"],
    isFeatured: true,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_kids_organic_tee",
    name: "Organic Cotton Dino Adventure Tee",
    tagline: "Soft combed ring-spun cotton with playful hand-drawn print",
    description: "Spark everyday imaginations with our whimsical hand-illustrated explorer dinosaur tee. Soft, breathable, and tagless to prevent neck irritation.",
    priceInCents: 1800,
    originalPriceInCents: 2400,
    category: "Shirt",
    subCategory: "Shirt",
    gender: "kids",
    stock: 75,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 86,
    features: [
          "100% Certified organic combed cotton (180 GSM)",
          "Tagless heat-transfer neck label for zero scratchiness",
          "Reinforced shoulder seams that survive tugging and rough play",
          "Machine wash safe with colorfast non-toxic inks"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "White",
                "hex": "#F5F5F5"
          },
          {
                "name": "Steel Blue",
                "hex": "#607D8B"
          }
    ],
    images: [
      "/products/product_tee.png",
      "/products/product_shirt.png"
    ],
    tags: ["shirt","shirts","tee","graphic-tee","kids","organic","cotton"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_kids_knit_pullover",
    name: "Chunky Knit Fair Isle Crewneck",
    tagline: "Cozy itch-free cotton-merino yarn with festive yoke pattern",
    description: "Rich heritage pattern meets kid-proof durability. Knit with soft itch-free cotton and merino yarn, ensuring festive warmth without any of the scratchiness.",
    priceInCents: 3400,
    originalPriceInCents: 4400,
    category: "Outerwear",
    subCategory: "Knitwear",
    gender: "kids",
    stock: 28,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 62,
    features: [
          "60% Organic cotton, 40% Extra-fine Merino wool yarn",
          "Intricate traditional Fair Isle yoke knit design",
          "Stretchy ribbed crewneck that pulls easily over little heads",
          "Gentle hand-washable knit structure with anti-shrink finish"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Red",
                "hex": "#C0392B"
          },
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          }
    ],
    images: [
      "/products/product_knitwear.png",
      "/products/product_hoodie.png"
    ],
    tags: ["outerwear","knitwear","knit","sweater","sweaters","pullover","fair-isle","kids"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_kids_cargo_pant",
    name: "Reinforced Kneepad Trail Cargo Pant",
    tagline: "Ripstop stretch cotton with Cordura-reinforced knee patches",
    description: "Built for playground climbing, forest trails, and sandbox diggers. Dual-layer reinforced knee panels and secure hook-and-loop cargo pockets prevent tearing.",
    priceInCents: 2800,
    originalPriceInCents: 3600,
    category: "Pant",
    subCategory: "Pant",
    gender: "kids",
    stock: 45,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 92,
    features: [
          "97% Tough cotton ripstop, 3% Spandex stretch weave",
          "Heavy-duty double-layer articulated knee reinforcement",
          "Internal adjustable buttonhole elastic waistband for growing kids",
          "Quick-release magnetic snap front fastening"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          }
    ],
    images: [
      "/products/product_sweatpants.png",
      "/products/product_denim.png"
    ],
    tags: ["pant","pants","cargo","bottoms","trail","outdoor","kids"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_washed_cotton_cap",
    name: "Heritage Washed Twill Dad Cap",
    tagline: "Low-profile 6-panel unstructured chino cap with brass clasp",
    description: "The timeless unconstructed baseball cap. Enzyme garment-washed for a naturally broken-in look with an antique brass tri-glide buckle strap.",
    priceInCents: 2200,
    originalPriceInCents: 2800,
    category: "Accessories",
    subCategory: "Hat",
    gender: "unisex",
    stock: 60,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 130,
    features: [
          "100% Pigment-dyed washed cotton chino twill",
          "Classic low-profile 6-panel unconstructed crown",
          "Pre-curved bill with tonal stitching",
          "Self-fabric strap with antique brass tuck-in slide buckle"
    ],
    availableSizes: ["One Size"],
    availableColors: [
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          }
    ],
    images: [
      "/products/studio_beanie_scarf.jpg",
      "/products/studio_tote_bag.jpg"
    ],
    tags: ["accessories","hat","hats","cap","twill","dad-cap","unisex"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_merino_fringe_scarf",
    name: "Pure Merino Wool Oversized Scarf",
    tagline: "Plush brushed merino wool with rolled fringe edge",
    description: "Envelop yourself in pure merino warmth. Generously proportioned at 200cm long for versatile wrapping and knotting, finished with classic twisted fringe tassels.",
    priceInCents: 3800,
    originalPriceInCents: 4800,
    category: "Accessories",
    subCategory: "Accessories",
    gender: "unisex",
    stock: 32,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 84,
    features: [
          "100% Superfine Australian Merino wool",
          "Brushed texture for velvety cloud-like feel",
          "Substantial 200cm x 50cm dimensions for versatile styling",
          "Hand-twisted fringe tassel ends"
    ],
    availableSizes: ["One Size"],
    availableColors: [
          {
                "name": "Grey",
                "hex": "#9A9A9A"
          },
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          }
    ],
    images: [
      "/products/studio_beanie_scarf.jpg",
      "/products/product_knitwear.png"
    ],
    tags: ["accessories","scarf","merino","wool","fringe","winter","unisex"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_leather_utility_belt",
    name: "Full-Grain Bridle Leather Belt",
    tagline: "1.5-inch English bridle leather with solid brass buckle",
    description: "Cut from thick 9oz vegetable-tanned bridle leather that molds to your waist and develops an incredible natural patina over decades of wear.",
    priceInCents: 3400,
    originalPriceInCents: 4200,
    category: "Accessories",
    subCategory: "Accessories",
    gender: "men",
    stock: 50,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 62,
    features: [
          "9-10oz Full-grain vegetable tanned bridle leather",
          "Solid brushed antique brass buckle secured with Chicago screws",
          "Beveled, burnished, and hand-waxed edges",
          "Standard 1.5-inch width fits all standard belt loops"
    ],
    availableSizes: ["S","M","L","XL"],
    availableColors: [
          {
                "name": "Black",
                "hex": "#0F0F0F"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          }
    ],
    images: [
      "/products/studio_leather_bag.jpg",
      "/products/product_cardholder.png"
    ],
    tags: ["accessories","belt","leather","bridle","men"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_canvas_commute_backpack",
    name: "Weatherproof Roll-Top Commuter Backpack",
    tagline: "22L waterproof waxed canvas with padded 16-inch laptop sleeve",
    description: "Engineered for cycling commutes and rainy city travels. Features an expandable roll-top main compartment, magnetic Fidlock buckle closure, and ergonomic padded shoulder straps.",
    priceInCents: 6800,
    originalPriceInCents: 8500,
    category: "Accessories",
    subCategory: "Accessories",
    gender: "unisex",
    stock: 30,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 110,
    features: [
          "Waterproof 18oz waxed cotton duck canvas with Cordura bottom",
          "Dedicated side-access padded compartment fits up to 16-inch laptops",
          "Fidlock magnetic quick-release chest buckle",
          "Breathable 3D air-mesh back panel for summer commutes"
    ],
    availableSizes: ["One Size"],
    availableColors: [
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          },
          {
                "name": "Steel Blue",
                "hex": "#607D8B"
          }
    ],
    images: [
      "/products/studio_tote_bag.jpg",
      "/products/product_cardholder.png"
    ],
    tags: ["accessories","bag","backpack","commuter","canvas","waterproof","unisex"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_knit_turtleneck",
    name: "Oversized Merino Wool Turtleneck Sweater",
    tagline: "Sumptuous Italian-spun merino wool with relaxed dropped shoulders",
    description: "The definitive cold-weather sanctuary. Spun from cloud-soft Italian merino wool in a tactile chunky brioche stitch. Features a dramatic slouchy roll neck and clean ribbed trims.",
    priceInCents: 6800,
    originalPriceInCents: 8500,
    category: "Outerwear",
    subCategory: "Knitwear",
    gender: "women",
    stock: 42,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 88,
    features: [
          "100% Extra-fine Italian spun Merino wool (7-gauge brioche knit)",
          "Unstructured fold-down rollneck collar with relaxed volume",
          "Stepped hem with deep side splits for easy tucking into trousers",
          "Natural temperature regulation and natural odor resistance"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "White",
                "hex": "#FDFBF7"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          }
    ],
    images: [
      "/products/product_knitwear.png",
      "/products/studio_women_blouse.jpg"
    ],
    tags: ["outerwear","knitwear","knit","sweater","sweaters","turtleneck","wool","women"],
    isFeatured: true,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_ribbed_tee",
    name: "Supima Cotton Ribbed Baby Tee",
    tagline: "Ultra-soft micro-rib cotton with flattering body-skimming fit",
    description: "The modern foundational tee. Milled from silky long-staple American Supima cotton with a hint of modal flex. Cut to hit precisely at the waistband of high-rise trousers.",
    priceInCents: 2800,
    originalPriceInCents: 3600,
    category: "Shirt",
    subCategory: "Shirt",
    gender: "women",
    stock: 65,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 112,
    features: [
          "95% American Supima cotton, 5% Elastane fine micro-rib",
          "Pre-shrunk fabric that holds shape wash after wash",
          "Flattering crew neckline with subtle double-needle stitch hem",
          "Ultra-breathable featherweight handfeel"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "White",
                "hex": "#F5F5F5"
          },
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          }
    ],
    images: [
      "/products/product_tee.png",
      "/products/studio_women_blouse.jpg"
    ],
    tags: ["shirt","shirts","tee","baby-tee","ribbed","cotton","women"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_high_straight_jean",
    name: "High-Rise Vintage Straight Jeans",
    tagline: "Rigid 12oz washed cotton denim with flattering straight silhouette",
    description: "Inspired by vintage 90s archive fits. High-rise waist that holds you in, flowing into a relaxed straight leg that stacks cleanly over sneakers or loafers.",
    priceInCents: 7200,
    originalPriceInCents: 9000,
    category: "Pant",
    subCategory: "Pant",
    gender: "women",
    stock: 38,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 96,
    features: [
          "100% Rigid organic cotton denim (12.5oz)",
          "Authentic stone-wash fading with soft whiskering",
          "Copper rivets and button fly with antique silver shank",
          "Straight leg cut with 30-inch inseam"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          },
          {
                "name": "White",
                "hex": "#F5F5F5"
          }
    ],
    images: [
      "/products/product_denim.png",
      "/products/product_sweatpants.png"
    ],
    tags: ["pant","pants","jeans","denim","straight-leg","bottoms","women"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_leather_crossbody",
    name: "Pebbled Italian Leather Half-Moon Crossbody",
    tagline: "Full-grain supple calfskin with brass hardware and adjustable strap",
    description: "Minimalist luxury for the woman on the move. Sculpted in Florence from scratch-resistant pebbled calfskin leather. Fits essentials with interior card slots and zippered security pouch.",
    priceInCents: 8800,
    originalPriceInCents: 11000,
    category: "Accessories",
    subCategory: "Accessories",
    gender: "women",
    stock: 25,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 78,
    features: [
          "Full-grain Italian pebbled calfskin leather with twill lining",
          "Sleek half-moon silhouette with two-way top zipper",
          "Adjustable 18-24 inch leather shoulder strap",
          "Hand-painted burnished edges and polished solid brass hardware"
    ],
    availableSizes: ["One Size"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          }
    ],
    images: [
      "/products/studio_leather_bag.jpg",
      "/products/product_cardholder.png"
    ],
    tags: ["accessories","bag","crossbody","leather","purse","handbag","women"],
    isFeatured: true,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_fleece_zip_hoodie",
    name: "Luxe French Terry Full-Zip Hoodie",
    tagline: "Heavyweight 400 GSM brushed fleece with two-way antique nickel zipper",
    description: "Elevated lounge comfort. Constructed from cloud-soft 400 GSM French terry with clean tailored seams, a two-way zipper for custom styling, and thermal split kangaroo pockets.",
    priceInCents: 5800,
    originalPriceInCents: 7200,
    category: "Outerwear",
    subCategory: "Hoodie",
    gender: "women",
    stock: 48,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 92,
    features: [
          "400 GSM Heavyweight combed cotton French terry",
          "Two-way matte antique nickel zipper with extended pull tabs",
          "Double-ply hood with hidden internal collar tape",
          "Ribbed side gussets and cuffs with reinforced thumb loops"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          },
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "White",
                "hex": "#F5F5F5"
          }
    ],
    images: [
      "/products/product_hoodie.png",
      "/products/product_sweatpants.png"
    ],
    tags: ["outerwear","hoodie","hoodies","zip-up","sweatshirt","fleece","women"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_women_wool_beret",
    name: "Structured Boiled Wool French Beret",
    tagline: "Traditional seamless millinery felted wool with water-resistant finish",
    description: "Chic Parisian charm. Formed seamlessly from 100% natural boiled merino wool that repels light drizzle and holds its sculptural crown shape without slouching.",
    priceInCents: 2600,
    originalPriceInCents: 3400,
    category: "Accessories",
    subCategory: "Hat",
    gender: "women",
    stock: 35,
    reservedStock: 0,
    rating: 4.7,
    reviewCount: 54,
    features: [
          "100% Merino boiled wool with dense water-resistant felt structure",
          "Seamless 3D blocked crown with traditional top stem",
          "Internal leatherette sweatband for gentle friction-free grip",
          "Natural thermo-regulating warmth for brisk autumn city strolls"
    ],
    availableSizes: ["One Size"],
    availableColors: [
          {
                "name": "Black",
                "hex": "#0F0F0F"
          },
          {
                "name": "Red",
                "hex": "#C0392B"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          }
    ],
    images: [
      "/products/studio_beanie_scarf.jpg",
      "/products/studio_leather_bag.jpg"
    ],
    tags: ["accessories","hat","hats","beret","wool","french-beret","women"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_kids_sherpa_zip_jacket",
    name: "Plush Sherpa Fleece Full-Zip Jacket",
    tagline: "Ultra-cozy high-pile sherpa with contrast nylon chest pocket",
    description: "Teddy-bear softness meets playground grit. High-pile sherpa fleece traps deep pocketed warmth, paired with a water-resistant woven nylon chest pocket and reflective zipper pulls.",
    priceInCents: 4200,
    originalPriceInCents: 5400,
    category: "Outerwear",
    subCategory: "Jacket",
    gender: "kids",
    stock: 36,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 110,
    features: [
          "100% Recycled high-pile double-sided sherpa fleece",
          "Contrast woven nylon zippered chest pocket and stand collar lining",
          "YKK easy-glide zipper with oversized kid-friendly rubber pull tab",
          "Lycra stretch binding on collar, cuffs, and hem to seal out wind"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Steel Blue",
                "hex": "#607D8B"
          }
    ],
    images: [
      "/products/studio_puffer_jacket.jpg",
      "/products/product_coat.png"
    ],
    tags: ["outerwear","jacket","jackets","sherpa","fleece","zip-up","kids"],
    isFeatured: true,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_kids_hoodie_fleece",
    name: "Colorblock Organic Cotton Pullover Hoodie",
    tagline: "Durable French terry with double-lined hood and roomy kangaroo pocket",
    description: "Vibrant retro colorblocking designed for endless energy. Soft combed loopback cotton fleece that breathes well in classroom classrooms and stays warm at recess.",
    priceInCents: 3600,
    originalPriceInCents: 4500,
    category: "Outerwear",
    subCategory: "Hoodie",
    gender: "kids",
    stock: 50,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 74,
    features: [
          "340 GSM 100% Certified organic combed cotton terry",
          "Double-ply crossover hood without drawcords for child safety",
          "Reinforced bar-tacked kangaroo handwarmer pocket",
          "Durable flatlock stitching that prevents chafing"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          },
          {
                "name": "Sage",
                "hex": "#8FAE97"
          },
          {
                "name": "Red",
                "hex": "#C0392B"
          }
    ],
    images: [
      "/products/product_hoodie.png",
      "/products/product_tee.png"
    ],
    tags: ["outerwear","hoodie","hoodies","sweatshirt","colorblock","fleece","kids"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_kids_knit_beanie_set",
    name: "Ribbed Merino Beanie & Mitten Set",
    tagline: "Non-scratchy pure merino wool knit with foldover cuff and string mittens",
    description: "Total winter warmth for little adventurers. Spun from itch-free Australian merino wool in a snug stretchy rib knit that stays comfortably on active heads and hands.",
    priceInCents: 2200,
    originalPriceInCents: 2800,
    category: "Accessories",
    subCategory: "Hat",
    gender: "kids",
    stock: 40,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 65,
    features: [
          "100% Superfine Australian Merino wool yarn",
          "Fold-over cuff beanie adjusts as child grows",
          "Matching seamless rib mittens with anti-loss connector string",
          "Antibacterial and breathable to prevent sweaty heads"
    ],
    availableSizes: ["One Size"],
    availableColors: [
          {
                "name": "Red",
                "hex": "#C0392B"
          },
          {
                "name": "Steel Blue",
                "hex": "#607D8B"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          }
    ],
    images: [
      "/products/studio_beanie_scarf.jpg",
      "/products/product_knitwear.png"
    ],
    tags: ["accessories","hat","hats","beanie","mittens","knitwear","merino","kids"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_kids_striped_longsleeve",
    name: "Breton Stripe Heavyweight Cotton Longsleeve",
    tagline: "Classic nautical yarn-dyed stripe with reinforced neckline",
    description: "Timeless maritime styling built tough for play. Milled from 220 GSM heavyweight combed cotton jersey with yarn-dyed stripes that never bleed or fade in hot laundry cycles.",
    priceInCents: 2400,
    originalPriceInCents: 3000,
    category: "Shirt",
    subCategory: "Shirt",
    gender: "kids",
    stock: 55,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 82,
    features: [
          "220 GSM 100% Organic ring-spun combed cotton jersey",
          "True yarn-dyed horizontal nautical stripes",
          "Ribbed boatneck collar reinforced with Lycra elasticity",
          "Side vent hems for unrestricted motion during play"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          },
          {
                "name": "Red",
                "hex": "#C0392B"
          }
    ],
    images: [
      "/products/product_tee.png",
      "/products/studio_oxford_shirt.jpg"
    ],
    tags: ["shirt","shirts","longsleeve","stripe","breton","tee","kids"],
    isFeatured: false,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_kids_denim_overalls",
    name: "Heritage Rigid Cotton Utility Overalls",
    tagline: "Adjustable slider straps with brass hardware and reinforced knee panels",
    description: "The quintessential timeless childhood silhouette. Crafted from tough 10oz washed indigo denim with adjustable shoulder sliders, brass side buttons, and double-layer knees.",
    priceInCents: 4600,
    originalPriceInCents: 5800,
    category: "Pant",
    subCategory: "Pant",
    gender: "kids",
    stock: 30,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 71,
    features: [
          "100% Durable washed cotton denim (10oz)",
          "Double-ply articulated knee patches for crawling and climbing",
          "Multi-compartment chest bib pocket and ruler side slot",
          "Heavy-duty brass buckle clasps and side shank buttons"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Blue",
                "hex": "#3B6FD4"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Khaki",
                "hex": "#C3A882"
          }
    ],
    images: [
      "/products/product_denim.png",
      "/products/product_sweatpants.png"
    ],
    tags: ["pant","pants","overalls","dungarees","denim","bottoms","kids"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_men_corduroy_overshirt",
    name: "8-Wale Cotton Corduroy Overshirt",
    tagline: "Chunky textured corduroy with dual chest flap pockets and horn buttons",
    description: "The ideal transitional layer between shirt and jacket. Woven from plush 8-wale cotton corduroy with a structured drape, oversized chest patch pockets, and faux horn buttons.",
    priceInCents: 6400,
    originalPriceInCents: 8000,
    category: "Shirt",
    subCategory: "Shirt",
    gender: "men",
    stock: 44,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 93,
    features: [
          "100% Heavyweight cotton corduroy (8-wale plush texture)",
          "Substantial weight allows wearing as an overshirt or light jacket",
          "Dual chest flap pockets with button-through closures",
          "Back shoulder yoke with center pleat for movement"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Charcoal",
                "hex": "#4A4A4A"
          }
    ],
    images: [
      "/products/studio_oxford_shirt.jpg",
      "/products/product_shirt.png"
    ],
    tags: ["shirt","shirts","overshirt","corduroy","shacket","jacket","men"],
    isFeatured: true,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_men_tech_fleece_zip",
    name: "Thermal Double-Knit Zip Track Hoodie",
    tagline: "Streamlined ergonomic raglan fit with bonded zippered sleeve stash pocket",
    description: "Engineered athletic precision. Formed from a sleek double-knit spacer fabric that traps air for lightweight insulation without bulk. Features bonded zip pockets and scuba hood.",
    priceInCents: 7400,
    originalPriceInCents: 9200,
    category: "Outerwear",
    subCategory: "Hoodie",
    gender: "men",
    stock: 36,
    reservedStock: 0,
    rating: 4.9,
    reviewCount: 115,
    features: [
          "66% Organic cotton, 34% Recycled poly double-knit thermal spacer",
          "Ergonomic multi-panel scuba hood with high neck baffle",
          "Bonded waterproof zipper tape on left bicep stash pocket",
          "Seamless underarm gussets for zero-restriction mobility"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Black",
                "hex": "#0F0F0F"
          },
          {
                "name": "Grey",
                "hex": "#9A9A9A"
          },
          {
                "name": "Steel Blue",
                "hex": "#607D8B"
          }
    ],
    images: [
      "/products/product_hoodie.png",
      "/products/product_parka.png"
    ],
    tags: ["outerwear","hoodie","hoodies","zip-up","tech-fleece","track","men"],
    isFeatured: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "prod_men_canvas_carpenter",
    name: "Heavy 12oz Duck Canvas Carpenter Pant",
    tagline: "Triple-needle stitched seams with utility hammer loop and tool pockets",
    description: "Workwear heritage perfected for everyday streetwear. Cut from indestructible 12oz washed cotton duck canvas with triple-needle stitched outseams and authentic utility pocketing.",
    priceInCents: 6200,
    originalPriceInCents: 7800,
    category: "Pant",
    subCategory: "Pant",
    gender: "men",
    stock: 40,
    reservedStock: 0,
    rating: 4.8,
    reviewCount: 84,
    features: [
          "12oz Heavyweight 100% Cotton duck canvas with soft enzyme wash",
          "Triple-stitched felled seams along outseam and seat for durability",
          "Authentic left-leg hammer loop and dual right-leg utility ruler pockets",
          "Relaxed straight fit with roomy leg opening that clears work boots"
    ],
    availableSizes: ["XS","S","M","L","XL"],
    availableColors: [
          {
                "name": "Khaki",
                "hex": "#C3A882"
          },
          {
                "name": "Olive",
                "hex": "#556B2F"
          },
          {
                "name": "Black",
                "hex": "#0F0F0F"
          }
    ],
    images: [
      "/products/product_sweatpants.png",
      "/products/product_denim.png"
    ],
    tags: ["pant","pants","carpenter","canvas","duck-canvas","workwear","bottoms","men"],
    isFeatured: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

class MemoryStore {
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.statusLogs = new Map();
    this.seedDefaults();
  }

  seedDefaults() {
    const customer = {
      id: 'cust_001',
      email: 'customer@shop.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Alice Customer',
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const warehouse = {
      id: 'ware_001',
      email: 'warehouse@shop.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Bob Warehouse',
      role: 'WAREHOUSE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const admin = {
      id: 'admin_001',
      email: 'admin@shop.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Charlie Admin',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(customer.id, customer);
    this.users.set(warehouse.id, warehouse);
    this.users.set(admin.id, admin);

    const customer2 = {
      id: 'cust_002',
      email: 'david.m@example.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'David Miller',
      role: 'CUSTOMER',
      createdAt: new Date(Date.now() - 86400000 * 30),
      updatedAt: new Date(Date.now() - 86400000 * 30),
    };

    const customer3 = {
      id: 'cust_003',
      email: 'sarah.j@example.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Sarah Jenkins',
      role: 'CUSTOMER',
      createdAt: new Date(Date.now() - 86400000 * 25),
      updatedAt: new Date(Date.now() - 86400000 * 25),
    };

    const customer4 = {
      id: 'cust_004',
      email: 'michael.c@example.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Michael Chen',
      role: 'CUSTOMER',
      createdAt: new Date(Date.now() - 86400000 * 15),
      updatedAt: new Date(Date.now() - 86400000 * 15),
    };

    this.users.set(customer2.id, customer2);
    this.users.set(customer3.id, customer3);
    this.users.set(customer4.id, customer4);

    for (const prod of SEEDED_PRODUCTS) {
      this.products.set(prod.id, { ...prod });
    }

    const cargoShorts = this.products.get('prod_cargo_shorts');
    if (cargoShorts) cargoShorts.stock = 4;
    const beret = this.products.get('prod_women_wool_beret');
    if (beret) beret.stock = 5;

    const initialOrder = {
      id: 'ord_1001',
      orderNumber: 'ORD-2026-1001',
      userId: customer.id,
      status: 'PLACED',
      fulfillmentType: 'DELIVERY',
      totalAmountInCents: 4500,
      shippingAddress: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        phone: '+1-555-0199',
      },
      trackingNumber: null,
      notes: 'Initial test order placed by customer',
      createdAt: new Date(Date.now() - 60000),
      updatedAt: new Date(Date.now() - 60000),
    };

    this.orders.set(initialOrder.id, initialOrder);
    this.orderItems.set(initialOrder.id, [
      {
        id: 'item_1',
        orderId: initialOrder.id,
        productId: 'prod_tee_steel',
        name: 'Explore Every Day Graphic Tee',
        priceInCents: 2200,
        quantity: 1,
        size: 'M',
        color: 'Steel Blue',
        image: '/products/product_tee.png',
      },
      {
        id: 'item_2',
        orderId: initialOrder.id,
        productId: 'prod_jogger_olive',
        name: 'Kids Jogger Pant',
        priceInCents: 2300,
        quantity: 1,
        size: 'L',
        color: 'Olive',
        image: '/products/product_sweatpants.png',
      },
    ]);

    this.statusLogs.set(initialOrder.id, [
      {
        id: 'log_1',
        orderId: initialOrder.id,
        fromStatus: null,
        toStatus: 'PLACED',
        changedById: customer.id,
        changedByRole: 'CUSTOMER',
        note: 'Order created',
        createdAt: new Date(Date.now() - 60000),
      },
    ]);

    const sampleOrders = [
      {
        order: {
          id: 'ord_1002',
          orderNumber: 'ORD-2026-1002',
          userId: 'cust_001',
          status: 'PROCESSING',
          fulfillmentType: 'DELIVERY',
          totalAmountInCents: 8900,
          shippingAddress: {
            street: '123 Main St',
            city: 'Metropolis',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            phone: '+1-555-0199',
          },
          trackingNumber: null,
          notes: 'Standard shipping requested',
          createdAt: new Date(Date.now() - 3600000 * 4),
          updatedAt: new Date(Date.now() - 3600000 * 1),
        },
        items: [
          {
            id: 'item_1002_1',
            orderId: 'ord_1002',
            productId: 'prod_men_wool_bomber',
            name: 'Insulated Flight Bomber Jacket',
            priceInCents: 8900,
            quantity: 1,
            size: 'L',
            color: 'Olive',
            image: '/products/product_coat.png',
          },
        ],
        logs: [
          {
            id: 'log_1002_1',
            orderId: 'ord_1002',
            fromStatus: null,
            toStatus: 'PLACED',
            changedById: 'cust_001',
            changedByRole: 'CUSTOMER',
            note: 'Order placed',
            createdAt: new Date(Date.now() - 3600000 * 4),
          },
          {
            id: 'log_1002_2',
            orderId: 'ord_1002',
            fromStatus: 'PLACED',
            toStatus: 'PROCESSING',
            changedById: 'ware_001',
            changedByRole: 'WAREHOUSE',
            note: 'Picked and packed at station B',
            createdAt: new Date(Date.now() - 3600000 * 1),
          },
        ],
      },
      {
        order: {
          id: 'ord_1003',
          orderNumber: 'ORD-2026-1003',
          userId: 'cust_002',
          status: 'SHIPPED',
          fulfillmentType: 'DELIVERY',
          totalAmountInCents: 12300,
          shippingAddress: {
            street: '789 Sunset Blvd',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90028',
            country: 'USA',
            phone: '+1-555-0244',
          },
          trackingNumber: 'TRK-982141',
          notes: 'Leave on porch',
          createdAt: new Date(Date.now() - 86400000 * 1),
          updatedAt: new Date(Date.now() - 3600000 * 3),
        },
        items: [
          {
            id: 'item_1003_1',
            orderId: 'ord_1003',
            productId: 'prod_men_selvedge_denim',
            name: 'Slim Taper Japanese Selvedge Jeans',
            priceInCents: 7500,
            quantity: 1,
            size: '32',
            color: 'Indigo',
            image: '/products/product_denim.png',
          },
          {
            id: 'item_1003_2',
            orderId: 'ord_1003',
            productId: 'prod_men_oxford_shirt',
            name: 'Classic Oxford Button-Down Shirt',
            priceInCents: 4800,
            quantity: 1,
            size: 'M',
            color: 'White',
            image: '/products/studio_oxford_shirt.jpg',
          },
        ],
        logs: [
          {
            id: 'log_1003_1',
            orderId: 'ord_1003',
            fromStatus: null,
            toStatus: 'PLACED',
            changedById: 'cust_002',
            changedByRole: 'CUSTOMER',
            note: 'Order placed',
            createdAt: new Date(Date.now() - 86400000 * 1),
          },
          {
            id: 'log_1003_2',
            orderId: 'ord_1003',
            fromStatus: 'PLACED',
            toStatus: 'PROCESSING',
            changedById: 'ware_001',
            changedByRole: 'WAREHOUSE',
            note: 'Order fulfillment started',
            createdAt: new Date(Date.now() - 3600000 * 12),
          },
          {
            id: 'log_1003_3',
            orderId: 'ord_1003',
            fromStatus: 'PROCESSING',
            toStatus: 'SHIPPED',
            changedById: 'ware_001',
            changedByRole: 'WAREHOUSE',
            note: 'Dispatched via Express Courier. Tracking: TRK-982141',
            createdAt: new Date(Date.now() - 3600000 * 3),
          },
        ],
      },
      {
        order: {
          id: 'ord_1004',
          orderNumber: 'ORD-2026-1004',
          userId: 'cust_003',
          status: 'DELIVERED',
          fulfillmentType: 'DELIVERY',
          totalAmountInCents: 24000,
          shippingAddress: {
            street: '456 Elm Court',
            city: 'Seattle',
            state: 'WA',
            postalCode: '98101',
            country: 'USA',
            phone: '+1-555-0312',
          },
          trackingNumber: 'TRK-842019',
          notes: '',
          createdAt: new Date(Date.now() - 86400000 * 3),
          updatedAt: new Date(Date.now() - 86400000 * 1),
        },
        items: [
          {
            id: 'item_1004_1',
            orderId: 'ord_1004',
            productId: 'prod_women_trench_coat',
            name: 'Water-Resistant Storm Flap Trench Coat',
            priceInCents: 18800,
            quantity: 1,
            size: 'M',
            color: 'Khaki',
            image: '/products/product_coat.png',
          },
          {
            id: 'item_1004_2',
            orderId: 'ord_1004',
            productId: 'prod_women_linen_blouse',
            name: 'Breezy French Linen Oversized Shirt',
            priceInCents: 5200,
            quantity: 1,
            size: 'S',
            color: 'White',
            image: '/products/studio_women_blouse.jpg',
          },
        ],
        logs: [
          {
            id: 'log_1004_1',
            orderId: 'ord_1004',
            fromStatus: 'SHIPPED',
            toStatus: 'DELIVERED',
            changedById: 'ware_001',
            changedByRole: 'WAREHOUSE',
            note: 'Package signed and delivered at door',
            createdAt: new Date(Date.now() - 86400000 * 1),
          },
        ],
      },
      {
        order: {
          id: 'ord_1005',
          orderNumber: 'ORD-2026-1005',
          userId: 'cust_004',
          status: 'READY_FOR_PICKUP',
          fulfillmentType: 'PICKUP',
          totalAmountInCents: 7500,
          shippingAddress: {
            street: 'RHshop Downtown Flagship Store',
            city: 'New York',
            state: 'NY',
            postalCode: '10012',
            country: 'USA',
            phone: '+1-555-0900',
          },
          trackingNumber: null,
          notes: 'Hold for pickup by Michael',
          createdAt: new Date(Date.now() - 3600000 * 6),
          updatedAt: new Date(Date.now() - 3600000 * 2),
        },
        items: [
          {
            id: 'item_1005_1',
            orderId: 'ord_1005',
            productId: 'prod_knit_sweater',
            name: 'Merino Wool Cable Knit Sweater',
            priceInCents: 7500,
            quantity: 1,
            size: 'L',
            color: 'Navy',
            image: '/products/product_knitwear.png',
          },
        ],
        logs: [
          {
            id: 'log_1005_1',
            orderId: 'ord_1005',
            fromStatus: 'PROCESSING',
            toStatus: 'READY_FOR_PICKUP',
            changedById: 'ware_001',
            changedByRole: 'WAREHOUSE',
            note: 'Item staged at retail counter locker #4',
            createdAt: new Date(Date.now() - 3600000 * 2),
          },
        ],
      },
      {
        order: {
          id: 'ord_1006',
          orderNumber: 'ORD-2026-1006',
          userId: 'cust_001',
          status: 'COMPLETED',
          fulfillmentType: 'PICKUP',
          totalAmountInCents: 16500,
          shippingAddress: {
            street: 'RHshop Downtown Flagship Store',
            city: 'New York',
            state: 'NY',
            postalCode: '10012',
            country: 'USA',
          },
          trackingNumber: null,
          notes: '',
          createdAt: new Date(Date.now() - 86400000 * 4),
          updatedAt: new Date(Date.now() - 86400000 * 2),
        },
        items: [
          {
            id: 'item_1006_1',
            orderId: 'ord_1006',
            productId: 'prod_women_cashmere_crew',
            name: 'Pure Cashmere Relaxed Crewneck',
            priceInCents: 12500,
            quantity: 1,
            size: 'M',
            color: 'Camel',
            image: '/products/product_knitwear.png',
          },
          {
            id: 'item_1006_2',
            orderId: 'ord_1006',
            productId: 'prod_canvas_tote',
            name: 'Heavyweight Utility Canvas Tote',
            priceInCents: 4000,
            quantity: 1,
            size: 'One Size',
            color: 'Natural',
            image: '/products/studio_tote_bag.jpg',
          },
        ],
        logs: [
          {
            id: 'log_1006_1',
            orderId: 'ord_1006',
            fromStatus: 'READY_FOR_PICKUP',
            toStatus: 'COMPLETED',
            changedById: 'ware_001',
            changedByRole: 'WAREHOUSE',
            note: 'Customer picked up at counter with verification',
            createdAt: new Date(Date.now() - 86400000 * 2),
          },
        ],
      },
      {
        order: {
          id: 'ord_1007',
          orderNumber: 'ORD-2026-1007',
          userId: 'cust_003',
          status: 'DELIVERED',
          fulfillmentType: 'DELIVERY',
          totalAmountInCents: 31000,
          shippingAddress: {
            street: '456 Elm Court',
            city: 'Seattle',
            state: 'WA',
            postalCode: '98101',
            country: 'USA',
          },
          trackingNumber: 'TRK-771920',
          notes: '',
          createdAt: new Date(Date.now() - 86400000 * 6),
          updatedAt: new Date(Date.now() - 86400000 * 4),
        },
        items: [
          {
            id: 'item_1007_1',
            orderId: 'ord_1007',
            productId: 'prod_women_wide_trouser',
            name: 'High-Rise Wide-Leg Pleated Pant',
            priceInCents: 11000,
            quantity: 1,
            size: 'S',
            color: 'Charcoal',
            image: '/products/product_sweatpants.png',
          },
          {
            id: 'item_1007_2',
            orderId: 'ord_1007',
            productId: 'prod_women_leather_crossbody',
            name: 'Pebbled Italian Leather Half-Moon Crossbody',
            priceInCents: 20000,
            quantity: 1,
            size: 'One Size',
            color: 'Black',
            image: '/products/studio_leather_bag.jpg',
          },
        ],
        logs: [
          {
            id: 'log_1007_1',
            orderId: 'ord_1007',
            fromStatus: 'SHIPPED',
            toStatus: 'DELIVERED',
            changedById: 'ware_001',
            changedByRole: 'WAREHOUSE',
            note: 'Delivered',
            createdAt: new Date(Date.now() - 86400000 * 4),
          },
        ],
      },
      {
        order: {
          id: 'ord_1008',
          orderNumber: 'ORD-2026-1008',
          userId: 'cust_002',
          status: 'CANCELLED',
          fulfillmentType: 'DELIVERY',
          totalAmountInCents: 5200,
          shippingAddress: {
            street: '789 Sunset Blvd',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90028',
            country: 'USA',
          },
          trackingNumber: null,
          notes: 'Customer changed mind',
          createdAt: new Date(Date.now() - 3600000 * 18),
          updatedAt: new Date(Date.now() - 3600000 * 17),
        },
        items: [
          {
            id: 'item_1008_1',
            orderId: 'ord_1008',
            productId: 'prod_men_corduroy_overshirt',
            name: '8-Wale Cotton Corduroy Overshirt',
            priceInCents: 5200,
            quantity: 1,
            size: 'M',
            color: 'Olive',
            image: '/products/studio_oxford_shirt.jpg',
          },
        ],
        logs: [
          {
            id: 'log_1008_1',
            orderId: 'ord_1008',
            fromStatus: 'PLACED',
            toStatus: 'CANCELLED',
            changedById: 'cust_002',
            changedByRole: 'CUSTOMER',
            note: 'Order cancelled by customer before fulfillment',
            createdAt: new Date(Date.now() - 3600000 * 17),
          },
        ],
      },
    ];

    for (const so of sampleOrders) {
      this.orders.set(so.order.id, so.order);
      this.orderItems.set(so.order.id, so.items);
      this.statusLogs.set(so.order.id, so.logs);
    }
  }

  reset() {
    this.users.clear();
    this.products.clear();
    this.orders.clear();
    this.orderItems.clear();
    this.statusLogs.clear();
    this.seedDefaults();
  }
}

export const memoryDb = new MemoryStore();
