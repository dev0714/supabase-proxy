const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY || "my_secret_key";

// Health check route
app.get("/", (req, res) => {
  res.send("Proxy service is running");
});

// Proxy endpoint at root POST /
app.post("/", async (req, res) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await axios({
      url: req.body.url,
      method: req.body.method || "GET",
      headers: req.body.headers || {},
      data: req.body.data || {},
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
