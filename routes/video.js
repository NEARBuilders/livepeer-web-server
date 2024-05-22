const express = require("express");
const multer = require("multer");
const moment = require("moment");

const uploadService = require("../services/upload");
const axiosLivepeer = require("../config/axios");

const router = express.Router();

const upload = multer({ dest: "../temp-asset/" });

router.get("/", async (req, res) => {
  try {
    const response = await axiosLivepeer.get("asset");

    const formattedVideos = response.data.map((video) => ({
      ...video,
      createdAt: moment(video.createdAt).format("DD MM YYYY, hh:mm:ss a"),
    }));

    res.send(formattedVideos);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/playback/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axiosLivepeer.get(`playback/${id}`);

    res.send(response.data.meta.source[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).send("No files were uploaded.");

  try {
    const result = await uploadService.uploadFile({
      tempFilePath: req.file.path,
      fileName: req.body.name,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    res.send(result.data);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Upload failed");
  }
});

module.exports = router;
