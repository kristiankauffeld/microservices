const express = require('express');
const http = require('http');
const fs = require('fs');
const dotenv = require('dotenv');
const { Pool } = require('pg');

const app = express();
dotenv.config({ debug: true });

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

console.log( `Forwarding video requests to ${VIDEO_STORAGE_HOST}:${VIDEO_STORAGE_PORT}.` );

app.get('/video', async (req, res) => {
  const videoId = req.query.id;
  const query = 'SELECT video_path FROM videos WHERE id = $1';
  const result = await pool.query(query, [videoId]);

  if (result.rows.length === 0) {
    return res.status(404).send('Video not found');
  }

  const videoRecord = result.rows[0];
  console.log(`Translated id ${videoId} to path ${videoRecord.video_path}.`);

  const forwardRequest = http.request(
    // Forward the request to the video storage microservice.
    {
      host: VIDEO_STORAGE_HOST,
      port: VIDEO_STORAGE_PORT,
      path: `/video?path=${videoRecord.video_path}`,
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
  console.log(`Microservice listening on port ${PORT}.`);
});
