const AWS = require('aws-sdk');
const rekognition = require('../config/config');

async function AWSRekognition(payload) {
  console.log('@AWSRekognition');
  console.log(payload);
  const params = {
    SimilarityThreshold: 90, 
    SourceImage: {
     S3Object: {
        Bucket: payload.Bucket, 
        Name: payload.Name
      }
    }, 
    TargetImage: {
     S3Object: {
        Bucket: "herman-photos", 
        Name: "yuda2.jpg"
      }
    }
  }

  const result = await new Promise ((resolve, reject) => {
    rekognition.compareFaces(params, function(err, data) {
      if (err) reject(err)
      else {
        resolve(data)
      }
    })
  })
  
  return result
}

module.exports = {
  AWSRekognition
};
