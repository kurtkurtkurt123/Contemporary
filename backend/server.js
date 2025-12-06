// backend/server.js
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/auth"));   
app.use("/api/users", require("./routes/user")); 
app.use("/api/student", require("./routes/student")); // <--- IDAGDAG ITO!

// Start server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});