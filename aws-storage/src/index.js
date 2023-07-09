const express = require('express');
const dotenv = require('dotenv');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
dotenv.config({ debug: true });

const PORT = process.env.PORT;
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const client = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

app.get('/video', async (req, res) => {
  const videoPath = req.query.path;

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: videoPath,
  });

  try {
    const response = await client.send(command);
    console.log(response); // Log the response object

    // Set appropriate headers and stream the S3 response body to the client
    res.set({
      'Content-Type': response.ContentType,
      'Content-Length': response.ContentLength,
    });
    response.Body.pipe(res);
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`Microservice listening on port ${PORT}`);
});
