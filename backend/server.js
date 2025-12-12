const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const supabase = require("./config/supabase"); 
const app = express();

// --- START: MODIFIED CORS CONFIGURATION ---
// Gagamitin ang FRONTEND_URL na iseset sa Render.com
const corsOptions = {
  // Ang 'origin' ay ang inyong Netlify URL
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions)); // Gagamitin ang corsOptions
app.use(express.json());
// --- END: MODIFIED CORS CONFIGURATION ---

// Routes
app.use("/api", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/student", require("./routes/students"));
app.use("/api/material", require("./routes/materials"));
app.use("/api/task", require("./routes/tasks"));
app.use("/api/activity", require("./routes/activities"));

const PORT = process.env.PORT || 5000;

// TEST SUPABASE WHEN SERVER STARTS
(async () => {
  try {
    const { data, error } = await supabase
      .from("tbl_users")
      .select("user_id")
      .limit(1);

    if (error) throw error;

    console.log("\n🟢 Supabase Connected Successfully!");
  } catch (error) {
    console.error("🔴 Supabase Connection Failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}\n`);
  });
})();
