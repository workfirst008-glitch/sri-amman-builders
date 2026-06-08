import { Land, Building, Project, About } from '../types';

export const DEFAULT_LANDS: Land[] = [
  {
    id: "land-1",
    title: "Amman Elite Garden",
    price: "₹45 Lakhs",
    size: "1,200 sq.ft.",
    location: "Saravanampatti, Coimbatore",
    description: "Premium gated community villa plots with sweet drinking water sources, 30-feet individual blacktop tar roads, underground electricity drains, and 24/7 round-the-clock site security. Safe high-appreciation zone located just 5 minutes away from Saravanampatti IT Park and leading global educational institutions.",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "land-2",
    title: "Royal Horizon Estate",
    price: "₹1.2 Crores",
    size: "4,800 sq.ft.",
    location: "Kovaipudur, Coimbatore",
    description: "Spacious individual plots situated on scenic, quiet hill slopes. Fully cleared titles and pristine weather year-round. Perfect for custom luxury double-story bungalows, layout has 100% traditional Vaastu compliance, beautiful natural groundwater resources, and a wide perimeter boundary wall.",
    imageUrl: "https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=800&q=80"
  }
];

export const DEFAULT_BUILDINGS: Building[] = [
  {
    id: "building-1",
    title: "Amman Signature Residency",
    price: "₹85 Lakhs",
    size: "1,800 sq.ft.",
    location: "Vadavalli, Coimbatore",
    description: "Stunning 3 BHK luxury independent villa architectural design, currently open for booking. Features state-of-the-art Italian open-concept modular kitchen setup, beautiful master suites, wide private terrace gardening zones, solid premium marble and granite flooring, and independent covered car parking garage.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "building-2",
    title: "Amman Heights Deluxe Apartments",
    price: "₹65 Lakhs",
    size: "1,350 sq.ft.",
    location: "Peelamedu, Coimbatore",
    description: "Premium high-quality 2 BHK and 3 BHK residential apartments. Offers complete futuristic lifestyle amenities: state-of-the-art gymnasiums, children amusement zones, dedicated community party halls, water treatment plants, comprehensive fire defense systems, and full structural load compliance.",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Amman IT Hub Phase I",
    location: "Saravanampatti, Coimbatore",
    specification: "B+G+7 Floor Layout, Double Glazed Structural Facade, Triple Power Generators, Advanced Multi-Zone Fire Fighting Controls, Eco Water Recirculation.",
    description: "Successfully delivered corporate IT landmark built for high-performance international tech offices. Incorporates massive open structural span spaces, heavy layout server floor loading support, and complete high-security perimeter card access systems built with precision.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    completionDate: "May 2025"
  },
  {
    id: "project-2",
    title: "Sri Amman Enclave Layout",
    location: "Singanallur, Coimbatore",
    specification: "High Grade Fe550 RCC Frames, Teak Wood Main Direct Entry Doors, Automated Solar Inverter backups, Fully Landscaped Parks.",
    description: "Ongoing construction work of 40 luxury independent villas equipped with a clubhouse, fully equipped central play gardens, modern water purification infrastructure, rainwater retention systems, and clean tar roads built to premium structural standards.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    completionDate: "December 2026"
  }
];

export const DEFAULT_ABOUT: About = {
  id: "about-1",
  companyHistory: "Founded in 2012 by structural specialists, Sri Amman Builders has established an absolute standard of engineering excellence, customer trust, and real estate reliability across Southern India. Operating on high principles of architectural design, 100% legal document approvals, and completely transparent operations, we have engineered and turned dreams into solid concrete realities.",
  mission: "To construct habitats characterized by structural integrity, aesthetic design layouts, cost affordability, and timely delivery, transforming homeownership dreams into safe secure landmarks.",
  vision: "To be recognized as the gold standard in premium, sustainable, and eco-conscious civil engineering designs in the region, delivering value that stands for generations.",
  achievements: "Honored with the 'Quality Homes Developer of Coimbatore' Award (2024). Completed over 1.5 million sq.ft. of pristine residential layouts and civil structures. Joyfully handed over keys to more than 1,400+ smiling families.",
  address: "102, Near Amman Kovil Complex, Trichy Road, Coimbatore, Tamil Nadu, 641018",
  email: "contact@sriammanbuilders.com",
  phone: "+91 94432 54321 / +91 422 24589"
};

export const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80";
