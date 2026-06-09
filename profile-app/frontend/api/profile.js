// Vercel Serverless Function — handles GET and PUT /api/profile
// Uses a module-level in-memory store initialized with realistic defaults.
// Data persists within the same warm serverless instance.

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

// Module-level store — persists across warm invocations of the same instance
let profileStore = { ...defaultProfile };

export default function handler(req, res) {
  // CORS headers so frontend can talk to this function
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: profileStore });
  }

  if (req.method === 'PUT') {
    try {
      const body = req.body;
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid request body' });
      }
      profileStore = { ...profileStore, ...body };
      return res.status(200).json({ success: true, data: profileStore });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to update profile data' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
