export const product = {
  id: 'sniff-solve-core',
  name: 'Sniff & Solve',
  tagline: 'The Modular Scent Puzzle System',
  subtitle: 'Hours of engagement. Infinite configurations. One happy dog.',
  description: `Meet the first truly modular enrichment system designed to keep your dog happily busy for hours while you're away. Sniff & Solve combines scent work, problem-solving, and physical manipulation in a reconfigurable station that never gets old.

Each of the six magnetic modules targets a different canine instinct: tracking, foraging, digging, nose work, paw manipulation, and sequential reasoning. Swap modules in seconds, rearrange the layout weekly, and watch your dog discover new challenges every time.`,
  longDescription: `Developed with veterinary behaviorists and tested by 200+ dogs, Sniff & Solve addresses the root cause of separation boredom: lack of species-appropriate mental stimulation. Unlike single-mechanism toys that dogs master in minutes, our modular system creates novel puzzles every session.

The base station anchors securely to wall or floor. Modules snap in with satisfying magnetic clicks — no tools, no fuss. Each module is made from FDA-compliant, BPA-free, chew-resistant thermoplastic (rated for power chewers) with stainless-steel hardware. Fabric components are machine-washable; plastic modules are dishwasher-safe (top rack).

Optional companion app (free, no subscription) lets you schedule randomized treat drops, track daily engagement minutes, and get reconfiguration reminders — so the challenge stays fresh even when you're not home to think of it.`,
  price: 249,
  currency: 'USD',
  images: {
    hero: '/images/hero.png',
    gallery: [
      '/images/gallery-1.png',
      '/images/gallery-2.png',
      '/images/gallery-3.png',
      '/images/gallery-4.png',
    ],
    modules: [
      { id: 'scent-maze', name: 'Scent Maze', image: '/images/module-scent-maze.png' },
      { id: 'treat-tumble', name: 'Treat Tumble', image: '/images/module-treat-tumble.png' },
      { id: 'flip-find', name: 'Flip & Find', image: '/images/module-flip-find.png' },
      { id: 'snuffle-spiral', name: 'Snuffle Spiral', image: '/images/module-snuffle-spiral.png' },
      { id: 'scent-tubes', name: 'Scent Tubes', image: '/images/module-scent-tubes.png' },
      { id: 'paw-press', name: 'Paw Press', image: '/images/module-paw-press.png' },
    ],
  },
  modules: [
    {
      id: 'scent-maze',
      name: 'Scent Maze',
      icon: '👃',
      description: 'Sliding panels reveal interchangeable scent trails. Swap the 4 included scent cartridges (peanut butter, bacon, cheese, liver) or add your own. Dogs track, nudge, and follow the trail to the hidden treat well.',
      difficulty: 'Beginner → Advanced',
      time: '15–30 min',
      instict: 'Tracking & Scent Discrimination',
    },
    {
      id: 'treat-tumble',
      name: 'Treat Tumble',
      icon: '🎾',
      description: 'Three weighted wobble balls dispense kibble at different rates. Adjustable internal baffles let you tune difficulty. Dogs learn to nudge, roll, and strategize — each ball behaves differently.',
      difficulty: 'Beginner → Intermediate',
      time: '10–25 min',
      instict: 'Foraging & Problem Solving',
    },
    {
      id: 'flip-find',
      name: 'Flip & Find',
      icon: '🚪',
      description: 'Six hinged doors, each with a unique opening mechanism: lift, slide, rotate, press, nudge, and paw-latch. Randomize treat placement behind doors for a new puzzle every session.',
      difficulty: 'Intermediate → Advanced',
      time: '20–40 min',
      instict: 'Manipulation & Sequential Reasoning',
    },
    {
      id: 'snuffle-spiral',
      name: 'Snuffle Spiral',
      icon: '🌀',
      description: 'Replaceable fabric spiral with 30+ hidden pockets. Bury treats deep or shallow. Machine-washable fleece lasts months; replacement spirals cost $12. The ultimate nose-work canvas.',
      difficulty: 'Beginner → Expert',
      time: '15–45 min',
      instict: 'Nose Work & Persistence',
    },
    {
      id: 'scent-tubes',
      name: 'Scent Tubes',
      icon: '🧪',
      description: 'Five vertical tubes at varied depths (2–8 inches). Drop treats, smear peanut butter, or insert scent swabs. Dogs must reach, lick, and problem-solve at different angles and depths.',
      difficulty: 'Intermediate → Advanced',
      time: '10–30 min',
      instict: 'Vertical Exploration & Dexterity',
    },
    {
      id: 'paw-press',
      name: 'Paw Press',
      icon: '🐾',
      description: 'Four large, illuminated buttons. Press the lit sequence to earn a treat — patterns grow from 2 to 6 steps. Teaches cause-effect, memory, and patience. The only module dogs can "learn" progressively.',
      difficulty: 'Advanced → Expert',
      time: '15–35 min',
      instict: 'Cognitive Sequencing & Impulse Control',
    },
  ],
  specs: {
    dimensions: 'Base: 24" × 18" × 2.5" | Modules: 6" × 6" × 3" each',
    weight: 'Base: 8 lbs | Each module: 1.2–1.8 lbs',
    materials: 'Base: Powder-coated aluminum, non-slip TPE feet\nModules: FDA-compliant copolyester (BPA-free, phthalate-free)\nFabric: 100% polyester fleece, machine washable\nHardware: 316 stainless steel, neodymium magnets (N42)',
    care: 'Plastic modules: Dishwasher safe (top rack)\nFabric spiral: Machine wash cold, tumble dry low\nBase: Wipe with damp cloth',
    safety: 'Tested to ASTM F963 (toy safety) & FDA 21 CFR 177.2600 (food contact)\nNo small parts — all components exceed 2.5" minimum dimension\nMagnets fully encapsulated, not accessible',
    warranty: '2-year limited warranty on base & modules\n90-day satisfaction guarantee\nFree replacement spirals for life (shipping only)',
    power: 'Paw Press module: 3× AA batteries (6+ months typical)\nAll other modules: Passive, no power needed\nApp: Bluetooth LE, optional, no subscription',
    compatibility: 'Wall mount (hardware included) or floor stand\nIndoor use only\nSuitable for dogs 15–100+ lbs',
  },
  includes: [
    '1× Sniff & Solve Base Station (wall/floor mount)',
    '6× Puzzle Modules (one of each type)',
    '4× Scent Cartridges (peanut butter, bacon, cheese, liver)',
    '1× Snuffle Spiral (installed)',
    'Wall-mount hardware kit + floor-standing feet',
    'Quick-start guide + behaviorist tips booklet',
    'Free companion app (iOS/Android)',
  ],
  faq: [
    {
      q: 'My dog destroys toys. Will this survive?',
      a: 'Yes. Modules are molded from the same copolyester used in premium dog chews (like West Paw Zogoflex). Tested with 50+ power chewers — zero structural failures. The base is powder-coated aluminum. If your dog somehow damages a module, our 2-year warranty covers it.',
    },
    {
      q: 'How long does it really keep them busy?',
      a: 'In our 8-week pilot (n=200), median engagement was 47 minutes per session with all 6 modules active. Dogs returned for 3–4 sessions/day voluntarily. The key is rotation: swap 2 modules weekly and engagement stays high for months.',
    },
    {
      q: 'Is the app required?',
      a: 'Not at all. The system works completely offline. The app only adds: randomized treat scheduling (Paw Press), daily engagement logs, and reconfiguration reminders. No subscription, no account needed — just pair via Bluetooth.',
    },
    {
      q: 'Can I buy modules separately?',
      a: 'Yes. Each module sells for $39 individually, or get the 6-module Expansion Pack for $199 (save $35). Replacement spirals are $12. Scent cartridges (4-pack): $18.',
    },
    {
      q: 'What if my dog figures it out too fast?',
      a: 'That\'s the point of modularity. Flip & Find has 720 door/treat combinations. Treat Tumble baffles adjust across 5 difficulty levels. Paw Press sequences scale to 6 steps. Scent cartridges are interchangeable. You control the difficulty curve.',
    },
    {
      q: 'Is it safe for unsupervised use?',
      a: 'Yes. No small parts, no cords, no pinch points, no batteries accessible to dog (Paw Press battery compartment is tool-secured). All materials are food-contact safe. We recommend supervising the first 2–3 sessions, then it\'s designed for solo play.',
    },
  ],
  reviews: [
    {
      id: 1,
      name: 'Sarah M.',
      dog: 'Border Collie, 3 yrs',
      rating: 5,
      text: 'My BC would destroy the house when I left. First day with Sniff & Solve: 52 minutes of focused work, then she napped for 3 hours. It\'s been 6 weeks and she still gets excited when I set it up. The module rotation is genius — she never masters it completely.',
      verified: true,
    },
    {
      id: 2,
      name: 'James R.',
      dog: 'Labrador, 5 yrs',
      rating: 5,
      text: 'Skeptical at $249 but worth every penny. Lab is a power chewer — zero damage after 2 months. He\'s figured out Flip & Find so we cranked the difficulty. Treat Tumble on level 4 keeps him busy 35+ mins. Customer service replaced a lost scent cartridge free.',
      verified: true,
    },
    {
      id: 3,
      name: 'Dr. Patricia V., DVM',
      dog: 'Mixed breed, 4 yrs',
      rating: 5,
      text: 'As a veterinary behaviorist, I recommend this to separation-anxiety clients. It hits all the right enrichment categories: olfactory, cognitive, physical. The modularity prevents habituation — the #1 failure mode of enrichment toys. Clinically sound design.',
      verified: true,
    },
    {
      id: 4,
      name: 'Amanda K.',
      dog: 'French Bulldog, 2 yrs',
      rating: 4,
      text: 'Frenchie loves the Snuffle Spiral and Scent Tubes. Paw Press is too advanced for her (brachycephalic, hard to press buttons firmly). Would love a "lite" version of that module. Otherwise fantastic — she\'s calm when I leave now.',
      verified: true,
    },
  ],
  shipping: {
    freeThreshold: 100,
    standard: { price: 9, days: '5–7 business days' },
    express: { price: 19, days: '2–3 business days' },
    international: { price: 29, days: '7–14 business days' },
  },
};

export type Product = typeof product;
export type Module = typeof product.modules[0];
export type Review = typeof product.reviews[0];
export type FAQ = typeof product.faq[0];
export type Specs = typeof product.specs;