import express from "express";
import cors from "cors";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

// CORS settings
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve the static files from the React app
app.use(express.static(join(__dirname + "/client/build")));

// An API endpoint
const formData = [];

app.use(express.json());

app.post("/contact/submit", (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    feedback: req.body.feedback,
  };
  formData.push(data);
  console.log(formData);
});

// Handle any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 3001;

app.listen(port);
