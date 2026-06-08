import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db-store.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure Cloudinary configuration
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary initialized successfully!");
} else {
  console.log("Cloudinary credentials missing. Falling back to local static uploads.");
}

// Parse large JSON payloads for Base64 image transfers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Serve local uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper to read database store
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    // Return default pre-filled data
    const defaultData = {
      lands: [
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
      ],
      buildings: [
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
      ],
      projects: [
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
      ],
      about: {
        id: "about-1",
        companyHistory: "Founded in 2012 by structural specialists, Sri Amman Builders has established an absolute standard of engineering excellence, customer trust, and real estate reliability across Southern India. Operating on high principles of architectural design, 100% legal document approvals, and completely transparent operations, we have engineered and turned dreams into solid concrete realities.",
        mission: "To construct habitats characterized by structural integrity, aesthetic design layouts, cost affordability, and timely delivery, transforming homeownership dreams into safe secure landmarks.",
        vision: "To be recognized as the gold standard in premium, sustainable, and eco-conscious civil engineering designs in the region, delivering value that stands for generations.",
        achievements: "Honored with the 'Quality Homes Developer of Coimbatore' Award (2024). Completed over 1.5 million sq.ft. of pristine residential layouts and civil structures. Joyfully handed over keys to more than 1,400+ smiling families.",
        address: "102, Near Amman Kovil Complex, Trichy Road, Coimbatore, Tamil Nadu, 641018",
        email: "contact@sriammanbuilders.com",
        phone: "+91 94432 54321 / +91 422 24589"
      },
      hero: {
        id: "hero-1",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80"
      },
      admin: {
        username: "admin",
        passwordHash: "sri_amman_2026"
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper to write database store
function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// API: Auth Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();

  if (username === db.admin.username && password === db.admin.passwordHash) {
    res.json({ success: true, user: { username } });
  } else {
    res.status(401).json({ success: false, message: "Invalid administrative credentials." });
  }
});

// API: Get All Content data
app.get('/api/content', (req, res) => {
  res.json(readDB());
});

// APIs: Lands CRUD
app.post('/api/lands', (req, res) => {
  const db = readDB();
  const newLand = {
    id: `land-${Date.now()}`,
    title: req.body.title || "New Land Plot",
    price: req.body.price || "₹30 Lakhs",
    size: req.body.size || "1,200 sq.ft.",
    location: req.body.location || "Coimbatore",
    description: req.body.description || "Beautiful individual plot layout.",
    imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  };
  db.lands.push(newLand);
  writeDB(db);
  res.status(201).json(newLand);
});

app.put('/api/lands/:id', (req, res) => {
  const db = readDB();
  const index = db.lands.findIndex((l: any) => l.id === req.params.id);
  if (index !== -1) {
    db.lands[index] = { ...db.lands[index], ...req.body };
    writeDB(db);
    res.json(db.lands[index]);
  } else {
    res.status(404).json({ message: "Land not found" });
  }
});

app.delete('/api/lands/:id', (req, res) => {
  const db = readDB();
  db.lands = db.lands.filter((l: any) => l.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// APIs: Buildings CRUD
app.post('/api/buildings', (req, res) => {
  const db = readDB();
  const newBuilding = {
    id: `building-${Date.now()}`,
    title: req.body.title || "New Villa Layout",
    price: req.body.price || "₹75 Lakhs",
    size: req.body.size || "1,500 sq.ft.",
    location: req.body.location || "Coimbatore",
    description: req.body.description || "Spacious newly constructed property.",
    imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  };
  db.buildings.push(newBuilding);
  writeDB(db);
  res.status(201).json(newBuilding);
});

app.put('/api/buildings/:id', (req, res) => {
  const db = readDB();
  const index = db.buildings.findIndex((b: any) => b.id === req.params.id);
  if (index !== -1) {
    db.buildings[index] = { ...db.buildings[index], ...req.body };
    writeDB(db);
    res.json(db.buildings[index]);
  } else {
    res.status(404).json({ message: "Building not found" });
  }
});

app.delete('/api/buildings/:id', (req, res) => {
  const db = readDB();
  db.buildings = db.buildings.filter((b: any) => b.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// APIs: Projects CRUD
app.post('/api/projects', (req, res) => {
  const db = readDB();
  const newProject = {
    id: `project-${Date.now()}`,
    title: req.body.title || "New Construction Project",
    location: req.body.location || "Coimbatore Layout",
    specification: req.body.specification || "High quality structural materials",
    description: req.body.description || "Premium ongoing construction work.",
    completionDate: req.body.completionDate || "Ongoing",
    imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  };
  db.projects.push(newProject);
  writeDB(db);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const db = readDB();
  const index = db.projects.findIndex((p: any) => p.id === req.params.id);
  if (index !== -1) {
    db.projects[index] = { ...db.projects[index], ...req.body };
    writeDB(db);
    res.json(db.projects[index]);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  const db = readDB();
  db.projects = db.projects.filter((p: any) => p.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// APIs: About US Update
app.put('/api/about', (req, res) => {
  const db = readDB();
  db.about = { ...db.about, ...req.body };
  writeDB(db);
  res.json(db.about);
});

// APIs: Hero Image / Settings Update
app.put('/api/hero', (req, res) => {
  const db = readDB();
  db.hero = { ...db.hero, ...req.body };
  writeDB(db);
  res.json(db.hero);
});

// APIs: Admin Account Security Settings Update
app.post('/api/admin/reset', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password cannot be empty" });
  }
  const db = readDB();
  db.admin.passwordHash = password;
  writeDB(db);
  res.json({ success: true, message: "Admin login passcode successfully updated" });
});

// API Router: Upload endpoint (handles base64 image data strings)
app.post('/api/upload', async (req, res) => {
  try {
    const { file } = req.body; // Expects base64 data string (e.g., "data:image/png;base64,...")
    if (!file) {
      return res.status(400).json({ message: "No image file payload provided" });
    }

    if (isCloudinaryConfigured) {
      // Direct highspeed secure upload to Cloudinary
      // Extract matches or post the raw base64 string
      const uploadResp = await cloudinary.uploader.upload(file, {
        folder: 'sri_amman_builders',
      });
      console.log("Uploaded successfully to Cloudinary:", uploadResp.secure_url);
      return res.json({ success: true, imageUrl: uploadResp.secure_url });
    } else {
      // Base64 local storage fallback
      // Strip mimetype headers if we need to write binary, let's parse beautiful base64
      const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        // Return file as raw or try converting
        return res.status(400).json({ message: "Invalid Base64 formats." });
      }

      const fileExtension = matches[1].split('/')[1] || 'png';
      const fileBuffer = Buffer.from(matches[2], 'base64');
      const fileName = `upload-${Date.now()}.${fileExtension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(filePath, fileBuffer);
      console.log("Uploaded file saved locally:", filePath);

      const imageUrl = `/uploads/${fileName}`;
      return res.json({ success: true, imageUrl });
    }
  } catch (error: any) {
    console.error("Image Upload Processing failed:", error);
    res.status(500).json({ success: false, message: "Internal server error uploading image data. Details: " + error.message });
  }
});

// Vite/Development server middleware flow
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Inject Vite Dev Server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static compiled UI assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to PORT and host '0.0.0.0' for proper container ingress
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sri Amman Builders Core Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
