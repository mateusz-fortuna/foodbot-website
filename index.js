import express from "express";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve the static files from the React app
app.use(express.static(join(__dirname + "client/build")));

// An API endpoint
app.get("/api", (req, res) => {
  const list = ["a", "b", "c"];
  res.json(list);
});

// Handle any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 3001;

app.listen(port);
