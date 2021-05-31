import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
app.use(express.json());

dotenv.config();
const { EMAIL_JS_USER, EMAIL_JS_SERVICE, EMAIL_JS_TEMPLATE, EMAIL_JS_TOKEN } =
  process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CORS settings
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Get the ReCAPTCHA authorization code
let authCode = null;
app.post("/contact/authorization", (req) => {
  authCode = req.body.authCode;
});

// Get a data from the contact form and send the email
app.post("/contact/submit", (req, response) => {
  if (authCode) {
    const data = {
      user_id: EMAIL_JS_USER,
      service_id: EMAIL_JS_SERVICE,
      template_id: EMAIL_JS_TEMPLATE,
      template_params: {
        ...req.body,
        "g-recaptcha-response": authCode,
      },
      accessToken: EMAIL_JS_TOKEN,
    };

    return axios
      .post("https://api.emailjs.com/api/v1.0/email/send", data)
      .then(response.send("Email sent successfully"))
      .catch((err) => console.error("Failed to sent email: ", err));
  }

  return console.error("Authorization required");
});

// Serve the static files from the React app
app.use(express.static(join(__dirname + "/client/build")));

// Handle any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port);
