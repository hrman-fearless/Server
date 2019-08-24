const AWS = require('aws-sdk');
const rekognition = { 
  "accessKeyId": 'AKIA5EL55NZSDEZAJMDX',
  "secretAccessKey": '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',
  "region": "ap-southeast-1"
  }

const Recognition = new AWS.Rekognition(rekognition);

module.exports = Recognition
