const AWS = require('aws-sdk');
const rekognition = { 
  "accessKeyId": process.env.HERMAN_REKOG_AWS_ACCESS_KEY,
  "secretAccessKey": process.env.HERMAN_REKOG_AWS_SECRET_KEY,
  "region": "us-east-1"
  }

const Recognition = new AWS.Rekognition(rekognition);

module.exports = Recognition
