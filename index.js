const express = require("express");
const bodyParser = require("body-parser");
const videoRoutes = require("./routes/video");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", videoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
