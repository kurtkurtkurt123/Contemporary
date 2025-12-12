const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const supabase = require("./config/supabase"); 
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
<<<<<<< HEAD
=======
app.use("/api/activity", require("./routes/activities"));
>>>>>>> test/supabase-migration

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
