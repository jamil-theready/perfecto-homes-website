export const SITE_NAME = "Perfecto Homes Real Estate";
export const SITE_URL = "https://www.perfectohomesrealestate.com";
export const PHONE = "(916) 878-7260";
export const PHONE_TEL = "+19168787260";
export const EMAIL = "perfectohomes@gmail.com";
// Business WhatsApp (same line as PHONE). Use for primary "message us" CTAs so
// they open WhatsApp instead of the OS dialer/FaceTime on desktop.
export const WA_LINK = `https://wa.me/${PHONE_TEL.replace(/[^0-9]/g, "")}`;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/perfectohomes",
  instagram: "https://www.instagram.com/perfectohomes/",
  tiktok: "https://www.tiktok.com/@perfectohomes?lang=en",
  youtube: "https://www.youtube.com/@perfectohomes",
};

export const TEAM = [
  {
    name: "Elisban Gonzales",
    slug: "elisban-gonzales",
    role: "Peru Property Representative",
    phone: "(916) 878-7703",
    phoneTel: "+19168787703",
    email: "elisban.gonzales@gmail.com",
    bio: "Greetings, My name is Elisban Gonzales. I was born in Peru and I represent our family's properties in Cusco and the Sacred Valley.",
    fullBio: [
      "Peruvian born. My passion for property began with our own family's buildings in Cusco and the Sacred Valley.",
      "I was perplexed by the level of hospitality that was served to me by my realtor. It reminded me very much of the hospitality I served when I worked as head of management in Hotel Cusco and Hotel Machu Picchu back in Peru.",
      "A couple of years later, my interested peaked and I decided to pursue my wanted career. Starting first as a loan officer in 2008, I quickly learned that every behind-the-scenes detail is just as crucial as the flashy deal-making on the front lines. It's this holistic understanding of the real estate process that sets me apart.",
      "I'm not just here to help sell or buy next your house. I'm here to guide, support, and champion your every step. My passion for client care stems from my own experiences. I've been there, navigating the highs and lows of buying and selling homes, so I know firsthand the importance of a trusted ally by your side. Consider me your personal real estate concierge, dedicated to smoothing out the wrinkles and turning your vision into reality.",
    ],
    socialLinks: {
      facebook: "https://www.facebook.com/elisban.gonzales",
      instagram: "https://www.instagram.com/elisban.gonzales/",
    },
    image: "/images/team/elisban.png",
  },
  {
    name: "Alfredo Gonzalez",
    slug: "alfredo-gonzalez",
    role: "Loan Officer | Environmental Sustainability",
    phone: "(415) 508-6864",
    phoneTel: "+14155086864",
    email: "ecoprestamista@gmail.com",
    bio: "Greetings, My name is Alfredo Gonzalez. I work with our family's property listings in Cusco and the Sacred Valley.",
    fullBio: [
      "As a sustainability professional, I believe that the best solutions to climate change come from the communities on the front lines.",
      "I engage with communities to create access to sustainability projects, programs, policies, and initiatives. My experience spans across non-profits, waste management, local government, urban planning, private consulting, higher education endowment investment policies, air quality academic research, equity & inclusion initiatives, marketing & brand strategy development, and organizing grassroots campaigns.",
      "I create content for various businesses and audiences, with the goal of bridging the knowledge gap between informal and formal methods of environmental knowledge and wisdom.",
    ],
    background: [
      { title: "Loan Officer at Absolute Mortgage", year: "2023-2025" },
      { title: "Loan Officer at Farmlink", year: "2022-2023" },
      { title: "MBA Presidio Business School", year: "2020" },
      { title: "Environmental Sustainability at Portland City", year: "2020" },
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/ecoprestamista/",
    },
    peruListings: true,
    image: "/images/team/alfredo.png",
  },
  {
    name: "Jamil Gonzales",
    slug: "jamil-gonzales",
    role: "AI Architect",
    phone: "(916) 218-0751",
    phoneTel: "+19162180751",
    phoneLink: "https://api.whatsapp.com/send/?phone=19162180751&text&type=phone_number&app_absent=0",
    email: "jamil@thereadyconsult.com",
    bio: "Jamil is a creative growth specialist focused on building high-performance websites, SEO systems, and video content that drives real business results. He blends clean, conversion-focused design with strategic search optimization and cinematic video production to help brands show up, stand out, and scale with clarity.",
    image: "/images/team/jamil.png",
  },
];

export const COMMUNITIES = [
  { name: "Cusco", slug: "cusco", image: "/images/peru/cusco.jpg" },
  { name: "Centro Histórico", slug: "centro-historico", image: "/images/peru/centro-historico.jpg" },
  { name: "San Blas", slug: "san-blas", image: "/images/peru/san-blas.jpg" },
  { name: "Wanchaq", slug: "wanchaq", image: "/images/peru/wanchaq.jpg" },
  { name: "San Sebastián", slug: "san-sebastian", image: "/images/peru/san-sebastian.jpg" },
  { name: "San Jerónimo", slug: "san-jeronimo", image: "/images/peru/san-jeronimo.jpg" },
  { name: "Ollantaytambo", slug: "ollantaytambo", image: "/images/peru/qhispicay/03-ollantaytambo-town-rooftop-view-from-hostal-qhispicay.jpg" },
  { name: "Urubamba", slug: "urubamba", image: "/images/peru/hatuchay-restaurant.jpg" },
  { name: "Pisac", slug: "pisac", image: "/images/peru/pisac.jpg" },
  { name: "Chinchero", slug: "chinchero", image: "/images/peru/chinchero.jpg" },
  { name: "Calca", slug: "calca", image: "/images/peru/calca.jpg" },
  { name: "Yucay", slug: "yucay", image: "/images/peru/yucay.jpg" },
  { name: "Maras", slug: "maras", image: "/images/peru/maras.jpg" },
  { name: "Aguas Calientes", slug: "aguas-calientes", image: "/images/peru/aguas-calientes.jpg" },
];

export const PERU_LISTINGS = [
  {
    name: "Calle Siete Cuartones 352",
    slug: "siete-cuartones-352-cusco",
    image: "/images/listings/siete-cuartones-352-cusco/01-courtyard.jpg",
  },
  {
    name: "Predio Victoria",
    slug: "predio-victoria",
    image: "/images/peru/victoria-map.jpg",
  },
  {
    name: "Hostal Qhispicay",
    slug: "hostal-qhispicay-ollantaytambo",
    image: "/images/peru/qhispicay/01-hostal-qhispicay-ollantaytambo-hotel-exterior-facade.jpg",
  },
  {
    name: "Hatuchay Valle Restaurant",
    slug: "hatuchay-valle-restaurant-urubamba",
    image: "/images/peru/hatuchay-restaurant.jpg",
  },
];


