export const product = {
  id: 'sniff-solve-core',
  name: 'Sniff & Solve',
  tagline: 'Modular scent puzzles for dogs who think with their nose.',
  subtitle: 'Six modules. 720 permutations. One station your dog can never finish.',
  description:
    'A machined base station holds six magnetic puzzle modules, each built around a different canine instinct. Rearrange the deck, change the scent, adjust the difficulty, and the puzzle your dog solved last week is gone.',
  longDescription:
    'Most enrichment toys are finished in ten minutes and abandoned in ten days. Sniff & Solve is built around rotation instead of novelty: six modules that can be moved, inverted and recombined, four interchangeable scent cartridges, and difficulty settings that scale from a first-sniff puppy to a working scent dog. The base is powder-coated aluminium with a machined lip and non-slip feet. Modules are food-contact copolyester, dishwasher safe, and rated for dogs who destroy everything else.',

  price: 249,
  currency: 'USD',

  includes: [
    'One base station — 480 × 360 mm, powder-coated aluminium',
    'Six modules: Scent Maze, Treat Tumble, Flip & Find, Snuffle Spiral, Scent Tubes, Paw Press',
    'Four scent cartridges: peanut, bacon, cheese, liver',
    'One installed Snuffle Spiral (spare included)',
    'Wall-mount hardware and four rubber feet',
    'Field guide: 12 weekly deck configurations',
    'Two-year hardware warranty and 60-day trial',
  ],

  stats: [
    { value: '06', label: 'Puzzle modules' },
    { value: '720', label: 'Deck permutations' },
    { value: '04', label: 'Interchangeable scents' },
    { value: '60', label: 'Day trial, no questions' },
  ],

  modules: [
    {
      id: 'scent-maze',
      number: '01',
      name: 'Scent Maze',
      code: 'M-01 / TRACK',
      instinct: 'Tracking & discrimination',
      difficulty: 2,
      time: '15–30 min',
      description:
        'Sliding panels hide four interchangeable scent trails. The dog follows a line of scent, not a line of sight, and learns to work an edge before committing.',
      method:
        'Four cartridges slot under the maze floor. Move a wall, change the reward well, and the same board becomes a different problem.',
      color: '#B96A4C',
    },
    {
      id: 'treat-tumble',
      number: '02',
      name: 'Treat Tumble',
      code: 'M-02 / FORAGE',
      instinct: 'Foraging & persistence',
      difficulty: 3,
      time: '10–25 min',
      description:
        'A clear drum on a brass axle releases kibble at a rate you control. Three internal baffles tune the problem from beginner to genuinely annoying.',
      method:
        'Rotate the baffle ring to change how easily treats fall. The drum is transparent, so the dog can see the reward but not the route to it.',
      color: '#C58F2E',
    },
    {
      id: 'flip-find',
      number: '03',
      name: 'Flip & Find',
      code: 'M-03 / MANIPULATE',
      instinct: 'Manipulation & sequence',
      difficulty: 4,
      time: '20–40 min',
      description:
        'Six hinged lids with six different openings: lift, slide, rotate, press, nudge, latch. Treat placement can be random or patterned.',
      method:
        'Each lid has a different resistance and hinge direction. Start with two lids open; add one per week until the dog is working the full row.',
      color: '#5E7F9C',
    },
    {
      id: 'snuffle-spiral',
      number: '04',
      name: 'Snuffle Spiral',
      code: 'M-04 / NOSE',
      instinct: 'Nose work & persistence',
      difficulty: 2,
      time: '15–45 min',
      description:
        'A washable fleece coil with 30 hidden pockets. Bury treats deep or shallow and let the dog work the whole length of the spiral.',
      method:
        'The spiral is replaceable and machine washable. Compression changes the difficulty: a loose coil is easy, a packed one is real work.',
      color: '#946F8A',
    },
    {
      id: 'scent-tubes',
      number: '05',
      name: 'Scent Tubes',
      code: 'M-05 / REACH',
      instinct: 'Vertical reach & dexterity',
      difficulty: 3,
      time: '10–30 min',
      description:
        'Six vertical tubes at depths from 60 to 240 mm. Smear, drop or wedge the reward — the dog has to solve the angle as well as the depth.',
      method:
        'Brass collars mark each depth. Swap the tube inserts to change bore and difficulty without changing the module.',
      color: '#6E8A77',
    },
    {
      id: 'paw-press',
      number: '06',
      name: 'Paw Press',
      code: 'M-06 / SEQUENCE',
      instinct: 'Cause, effect & impulse',
      difficulty: 5,
      time: '15–35 min',
      description:
        'Four large buttons with a soft click. Press the lit sequence to earn a reward; sequences grow from two steps to six.',
      method:
        'The only powered module: three AA cells last roughly six months. No app required, no account, no subscription.',
      color: '#C47968',
    },
  ],

  scents: [
    {
      code: 'S-01',
      name: 'Roasted peanut',
      notes: 'Warm legume · toasted shell · low smoke',
      intensity: 3,
      color: '#C8892F',
      use: 'The reliable start. High value, low confusion.',
    },
    {
      code: 'S-02',
      name: 'Smoked bacon',
      notes: 'Cured pork · birch smoke · salt',
      intensity: 5,
      color: '#B96A4C',
      use: 'For dogs who need a louder invitation.',
    },
    {
      code: 'S-03',
      name: 'Aged cheese',
      notes: 'Sharp dairy · rind · faint ammonia',
      intensity: 4,
      color: '#C58F2E',
      use: 'A long trail that rewards patience.',
    },
    {
      code: 'S-04',
      name: 'Dried liver',
      notes: 'Iron · dried herb · deep mineral',
      intensity: 5,
      color: '#946F8A',
      use: 'The final cartridge. Use sparingly.',
    },
  ],

  specSheet: [
    { label: 'Base', value: '480 × 360 × 45 mm, powder-coated aluminium, 3.6 kg' },
    { label: 'Modules', value: '150 × 150 × 40–90 mm, food-contact copolyester, 0.5–0.8 kg' },
    { label: 'Deck', value: 'Six recessed bays, N42 magnets, 2.2 kg pull per bay' },
    { label: 'Fabric', value: 'Recycled polyester fleece, machine washable at 30°C' },
    { label: 'Hardware', value: '316 stainless steel, brass collars, TPE feet' },
    { label: 'Power', value: 'Paw Press only: 3 × AA, approximately 6 months' },
    { label: 'Safety', value: 'No loose magnets. No small parts. Tool-secured battery bay.' },
    { label: 'Care', value: 'Modules top-rack dishwasher safe. Base wipes clean.' },
  ],

  specs: {
    dimensions: 'Base 480 × 360 × 45 mm · Modules 150 × 150 mm',
    weight: 'Base 3.6 kg · Modules 0.5–0.8 kg each',
    materials: 'Powder-coated aluminium, food-contact copolyester, recycled fleece, stainless steel',
    care: 'Modules: top-rack dishwasher. Fleece: machine wash cold. Base: damp cloth.',
    safety: 'No loose magnets, no accessible batteries, no small parts',
    warranty: '2 years on base and modules · 60-day trial · free spiral replacement',
    power: 'Paw Press: 3 × AA (included) · all other modules passive',
    compatibility: 'Floor-standing or wall-mounted · dogs 6 kg and up',
  },

  comparison: [
    {
      feature: 'Reconfigurable puzzle',
      station: 'Six bays, 720 permutations',
      snuffle: 'Single layout',
      ball: 'Single mechanism',
      puzzle: 'Fixed board',
    },
    {
      feature: 'Scent work',
      station: 'Four cartridges',
      snuffle: 'Treats only',
      ball: 'Treats only',
      puzzle: 'Treats only',
    },
    {
      feature: 'Difficulty scaling',
      station: 'Five levels per module',
      snuffle: 'Packing density',
      ball: 'Baffle only',
      puzzle: 'One level',
    },
    {
      feature: 'Solo-safe',
      station: 'Yes',
      snuffle: 'Yes',
      ball: 'Yes',
      puzzle: 'Supervised',
    },
    {
      feature: 'Dishwasher-safe parts',
      station: 'All modules',
      snuffle: 'No',
      ball: 'Some',
      puzzle: 'No',
    },
    {
      feature: 'Warranty',
      station: '2 years',
      snuffle: '30 days',
      ball: '1 year',
      puzzle: 'None',
    },
  ],

  faq: [
    {
      q: 'My dog destroys everything. Will this survive?',
      a: 'The base is powder-coated aluminium and the modules are moulded from the same copolyester used in premium chew toys. We beta-tested with 214 households, including 38 self-described power-chewer homes; no module was structurally damaged. If one is, the two-year warranty replaces it.',
    },
    {
      q: 'How long does it actually keep a dog busy?',
      a: 'In our 214-household beta, a full six-module deck produced a median first-session engagement of 41 minutes, with dogs returning for two or three shorter sessions a day. The number that matters is week six: households that changed two modules weekly reported engagement staying roughly flat, while households that left the deck unchanged reported a drop after ten days.',
    },
    {
      q: 'Is the app required?',
      a: 'There is no app. Paw Press runs on three AA cells and holds its sequence locally. Nothing needs pairing, an account or a subscription.',
    },
    {
      q: 'Can I buy modules separately?',
      a: 'Yes. Single modules are $39, the six-module Expansion Pack is $199, replacement spirals are $12, and the four-cartridge scent pack is $18. Every module fits every base.',
    },
    {
      q: 'What if my dog solves it too fast?',
      a: 'That is the design brief. Flip & Find has 720 treat-and-lid permutations; Treat Tumble has three baffle settings; Paw Press sequences grow to six steps; scent cartridges change the information, not just the difficulty. The field guide includes twelve weekly deck configurations.',
    },
    {
      q: 'Is it safe to leave a dog alone with it?',
      a: 'Yes, with one caveat: supervise the first two or three sessions so you can see how your dog works. There are no cords, no loose magnets, no accessible batteries and no parts small enough to swallow. Paw Press is the only module with a battery bay, and it is secured with a tool-fastened plate.',
    },
    {
      q: 'What does the trial cover?',
      a: 'Sixty days from delivery. If your dog loses interest, email us and we refund the order and pay return shipping. The only thing we ask is that you try at least three different deck configurations first — rotation is the product.',
    },
    {
      q: 'Where do you ship?',
      a: 'The United States, Canada, the UK, the EU and Australia. Orders over $100 ship free. Express delivery is available at checkout. This is a demo store: no payment is taken and no physical order ships.',
    },
  ],

  reviews: [
    {
      id: 1,
      name: 'Mara Ellison',
      dog: 'Border collie, 3',
      city: 'Portland, OR',
      rating: 5,
      date: 'October 2026',
      household: 'Beta household 041',
      title: 'The rotation is the whole thing',
      text: 'We started with the maze and the spiral. By week three she was opening the Flip & Find latches without a treat behind them — she just wanted to check. The difference from our old snuffle mat is that I can make it harder without buying a new object. Week six and she still checks the deck when I walk past it.',
    },
    {
      id: 2,
      name: 'Daniel Okafor',
      dog: 'Labrador, 5',
      city: 'Manchester, UK',
      rating: 5,
      date: 'September 2026',
      household: 'Beta household 178',
      title: 'Survived a labrador',
      text: 'I bought it expecting to be disappointed by the plastic. Two months in, the tumble drum has a few scuffs and everything else looks new. The brass axle and the weight of the base are what sold me — it does not slide across the floor when he gets enthusiastic.',
    },
    {
      id: 3,
      name: 'Priya Raman',
      dog: 'Mixed, 8',
      city: 'Toronto, ON',
      rating: 4,
      date: 'September 2026',
      household: 'Beta household 096',
      title: 'Good for an older dog',
      text: 'Our dog is eight and mostly deaf, so scent is how she still gets information about the world. The tubes are her favourite. I took one star off because the Paw Press is too much for her joints, but the modular design means we simply leave that bay empty.',
    },
    {
      id: 4,
      name: 'Jonas Weber',
      dog: 'Miniature schnauzer, 2',
      city: 'Berlin, DE',
      rating: 5,
      date: 'August 2026',
      household: 'Beta household 212',
      title: 'Finally, something he cannot finish',
      text: 'He solved every puzzle we owned in a week. The scent cartridges were the missing piece — the same maze becomes a new problem when the trail changes. The field guide is genuinely useful; we are on configuration nine.',
    },
  ],

  guarantee: [
    {
      title: '60-day nose-back trial',
      text: 'Try three deck configurations. If your dog is not interested, we refund the order and pay the return shipping.',
    },
    {
      title: '2-year hardware warranty',
      text: 'Base, magnets, hinges and collars are covered. If a module fails, we replace it, not the whole station.',
    },
    {
      title: 'Spare spirals, free',
      text: 'Fleece wears out before hardware does. Replacement spirals are free for the life of the station; you cover shipping.',
    },
  ],

  shipping: {
    freeThreshold: 100,
    standard: { price: 9, days: '5–7 business days' },
    express: { price: 19, days: '2–3 business days' },
    international: { price: 29, days: '7–14 business days' },
  },

  images: {
    hero: '/images/hero.svg',
    gallery: [
      '/images/gallery-1.svg',
      '/images/gallery-2.svg',
      '/images/gallery-3.svg',
      '/images/gallery-4.svg',
    ],
  },
};

export type Product = typeof product;
export type Module = (typeof product.modules)[0];
export type Review = (typeof product.reviews)[0];
export type FAQ = (typeof product.faq)[0];
export type Specs = typeof product.specs;
