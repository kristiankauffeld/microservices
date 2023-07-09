const express = require('express');
const dotenv = require('dotenv');
const http = require('http');

const app = express();
dotenv.config({ debug: true });

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
console.log( `Forwarding video requests to ${VIDEO_STORAGE_HOST}:${VIDEO_STORAGE_PORT}.` );

app.get('/video', (req, res) => {
  const forwardRequest = http.request(
    // Forward the request to the video storage microservice.
    {
      host: VIDEO_STORAGE_HOST,
      port: VIDEO_STORAGE_PORT,
      path: '/video?path=SampleVideo_1280x720_1mb.mp4', // Video path is hard-coded for the moment.
      method: 'GET',
      headers: req.headers,
    },
    (forwardResponse) => {
      res.writeHeader(forwardResponse.statusCode, forwardResponse.headers);
      forwardResponse.pipe(res);
    }
  );

  req.pipe(forwardRequest);
});

app.listen(PORT, () => {
  console.log(`Microservice listening on port ${PORT}`);
});
