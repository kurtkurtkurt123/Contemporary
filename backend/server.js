// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./config/mysql"); // <--- Import DB connection
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/student", require("./routes/students"));
app.use("/api/material", require("./routes/materials"));
app.use("/api/task", require("./routes/tasks"));

const PORT = process.env.PORT || 5000;

// TEST DATABASE WHEN SERVER STARTS
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("\n🟢 MySQL Database Connected Successfully!");
  } catch (error) {
    console.error("🔴 MySQL Connection Failed:", error);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}\n`);
  });
})();
