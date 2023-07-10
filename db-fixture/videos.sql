CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  video_path TEXT NOT NULL
);

INSERT INTO videos (video_path) VALUES ('SampleVideo_1280x720_1mb.mp4');
