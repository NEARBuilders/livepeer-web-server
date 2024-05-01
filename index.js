// const express = require("express");
// const bodyParser = require("body-parser");
// const fs = require("fs");
// const axios = require("axios");
// const multer = require("multer");
// const axiosLivepeer = require("./config/axios");
// const { uploadFile } = require("./services/upload");

// const upload = multer({ dest: "temp-asset/" });

// const app = express();

// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
// console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const videoRoutes = require("./routes/video");
// const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   fileUpload({
//     createParentPath: true,
//     useTempFiles: true,
//     tempFileDir: path.join(__dirname, "temp-asset"),
//   })
// );

app.use("/", videoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
