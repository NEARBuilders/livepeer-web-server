const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const ngrokUrl = "https://c3f6-82-52-88-211.ngrok-free.app";

require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp-asset"),
  })
);

const axiosLivepeer = axios.create({
  baseURL: "https://livepeer.com/api/",
  headers: {
    Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
    "Content-Type": "application/json",
  },
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Livepeer Asset Manager!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/videos", (req, res) => {
  axiosLivepeer
    .get("asset")
    .then((response) => res.send(response.data))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const videoFile = req.files.video;
  const tempFilePath = videoFile.tempFilePath;
  const fileName = videoFile.name;

  const permanentDirPath = path.join(__dirname, "uploaded-asset");
  const permanentFilePath = path.join(permanentDirPath, fileName);

  const publicUrl = `${ngrokUrl}/${path.basename(tempFilePath)}`;

  axiosLivepeer
    .post("asset/upload/url", {
      name: fileName,
      url: publicUrl,
    })
    .then(() => {
      fs.rename(tempFilePath, permanentFilePath, (err) => {
        if (err) {
          console.error("Failed to move file:", err);
          return res.status(500).send("Failed to move file after upload");
        }

        res.send("File uploaded and moved successfully");
      });
    })
    .catch((error) => {
      console.error("Error uploading to Livepeer:", error);
      res.status(500).send(error.response.data);
    });
});
