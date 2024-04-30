const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp-asset",
  })
);

// const axiosLivepeer = axios.create({
//   baseURL: "https://livepeer.com/api/",
//   headers: {
//     Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
//     "Content-Type": "application/json",
//   },
// });

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Livepeer Asset Manager!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/videos", async (req, res) => {
  try {
    const assets = await livepeer.asset.getAll();
    res.send(assets);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // Access the uploaded file via the <input> field with the name 'video'
  let videoFile = req.files.video;

  // Temporarily save the file (this example saves it in a local /public directory, adjust as necessary)
  const uploadPath = __dirname + "/public/uploads/" + videoFile.name;

  // Use the mv() method to place the file on the server
  videoFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    // If the file is stored, then send it to Livepeer
    const videoUrl = `https://f8ad-87-15-116-81.ngrok-free.app/uploads/${videoFile.name}`;

    // Use the Livepeer API to upload the video
    axiosLivepeer
      .post("asset/import", {
        url: videoUrl,
        name: videoFile.name,
      })
      .then((response) => res.status(201).send(response.data))
      .catch((error) => res.status(500).send(error.message));
  });
});
