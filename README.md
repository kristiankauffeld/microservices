# Bootstrapping Microservices

This is the example from Chapter 4 of Bootstrapping Microservices but in this repo the microservice for file storage is using AWS S3 instead of Azure Storage, and this repo is using PostgreSQL database.

## AWS S3 File Storage
In order for the "aws-storage" microservice to work, you need to set up your own S3 bucket on an AWS account and upload the video file. Then afterwards you can use this link in order to test the "aws-storage" microservice:
http://localhost:3000/video?path=SampleVideo_1280x720_1mb.mp4


## PostgreSQL Database

