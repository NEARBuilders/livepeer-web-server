const axiosLivepeer = require("../config/axios");
const tus = require("tus-js-client");
const fs = require("fs");

const requestUploadUrl = async (assetName) => {
  try {
    const response = await axiosLivepeer.post("asset/request-upload", {
      name: assetName,
    });
    return response.data.tusEndpoint;
  } catch (error) {
    throw error;
  }
};

const uploadFile = async (fileDetails) => {
  const { tempFilePath, fileName, mimetype, size } = fileDetails;

  const fileStream = fs.createReadStream(tempFilePath);
  const tusEndpoint = await requestUploadUrl(fileName);

  return new Promise((resolve, reject) => {
    const uploader = new tus.Upload(fileStream, {
      endpoint: tusEndpoint,
      metadata: {
        filename: fileName,
        filetype: mimetype,
      },
      uploadSize: size,
      onError: reject,
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log("Uploaded:", percentage + "%");
      },
      onSuccess: () => {
        console.log("Upload finished:", uploader.url);
        resolve("Upload finished");
      },
    });

    uploader.start();
  });
};

module.exports = { uploadFile };
