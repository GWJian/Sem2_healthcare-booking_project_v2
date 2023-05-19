//this is server.js
const express = require("express");
const app = express();
const PORT = 8000;
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const { DB_HOST, DB_PORT, DB_NAME } = process.env;

//connect to the local database
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

//connect to the cloud database
app.use(cors());
// app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.static("public"));

//this is chatengine.io
app.post("/authenticate", async (req, res) => {
  const { username } = req.body;
  // Get or create user on Chat Engine!
  try {
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      { username: username, secret: username, first_name: username },
      { headers: { "Private-Key": process.env.CHAT_ENGINE_PRIVATE_KEY } }
      //chat_engine_private_key
    );
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});
//end of chatengine.io

app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/adminUser"));
app.use("/profile", require("./routes/userProfile"));
app.use("/appointment", require("./routes/userAppointment"));
app.use("/adminappointment", require("./routes/adminAppointment"));
app.use("/rating", require("./routes/ratingRoutes"));

app.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));
