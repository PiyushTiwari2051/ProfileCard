const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

const profileFilePath = path.join(__dirname, 'profile.json');

// Realistic seed data
const defaultProfile = {
  name: "Alex Morgan",
  title: "Senior Product Designer",
  bio: "Alex is a multidisciplinary product designer based in San Francisco, specializing in crafting premium digital interfaces. With over eight years of experience, they focus on bridging the gap between functional user needs and clean, elegant aesthetics.",
  phone: "+1 (415) 555-0198",
  email: "alex.morgan@designstudio.io",
  location: "San Francisco, CA",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
  linkedin: "https://linkedin.com/in/alexmorgan-design",
  instagram: "https://instagram.com/alexmorgan.design",
  github: "https://github.com/alexmorgan-design",
  template: "glassmorphic"
};

// Seed profile.json if it doesn't exist
const seedProfileFile = () => {
  try {
    if (!fs.existsSync(profileFilePath)) {
      fs.writeFileSync(profileFilePath, JSON.stringify(defaultProfile, null, 2), 'utf8');
    }
  } catch (error) {
    console.error("❌ Error seeding profile file:", error.message);
  }
};

// Run the seed function
seedProfileFile();

// GET /api/profile
app.get('/api/profile', (req, res) => {
  try {
    if (!fs.existsSync(profileFilePath)) {
      fs.writeFileSync(profileFilePath, JSON.stringify(defaultProfile, null, 2), 'utf8');
    }
    const data = fs.readFileSync(profileFilePath, 'utf8');
    const profile = JSON.parse(data);
    
    // Ensure template exists
    const mergedProfile = {
      template: "glassmorphic",
      ...profile
    };
    return res.status(200).json({ success: true, data: mergedProfile });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to read profile data" });
  }
});

// PUT /api/profile
app.put('/api/profile', (req, res) => {
  try {
    if (!fs.existsSync(profileFilePath)) {
      fs.writeFileSync(profileFilePath, JSON.stringify(defaultProfile, null, 2), 'utf8');
    }

    const currentData = fs.readFileSync(profileFilePath, 'utf8');
    const currentProfile = JSON.parse(currentData);

    // Merge req.body into existing profile
    const updatedProfile = {
      template: "glassmorphic",
      ...currentProfile,
      ...req.body
    };

    fs.writeFileSync(profileFilePath, JSON.stringify(updatedProfile, null, 2), 'utf8');
    return res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update profile data" });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`✅ Profile API running → http://localhost:5000`);
});
