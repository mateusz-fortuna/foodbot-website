import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import emailjs from "emailjs-com";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Init email.js
const userID = process.env.USER_ID;
emailjs.init(userID);

// CORS settings
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Serve the static files from the React app
app.use(express.static(join(__dirname + "/client/build")));

// An API endpoint
const formData = [];

app.use(express.json());

app.post("/contact/submit", (req, res) => {
  formData.push(req.body);
  console.log(formData);
});

// Handle any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port);
