/* istanbul ignore file */
const AWS = require('aws-sdk');
const rekognition = require('../config/config');
const User = require('../models/user');

async function AWSRekognition(payload) {
  const result = await new Promise (async (resolve, reject) => {
    const recognize = await User.find().select('photos fullname')
    for (let x = 0; x < recognize.length; x++) {
      let dataPerson = recognize[x]
      let personPhoto = recognize[x].photos
      
      console.log(payload);
      console.log(personPhoto);

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
            Bucket: personPhoto.Bucket, 
            Name: personPhoto.Name
          }
        }
      }
      rekognition.compareFaces(params, (err, data) => {
        if (err) reject(err)
        else {
          if (data.FaceMatches[0]) {
            console.log(data.FaceMatches[0]);
            resolve({
              message: `Found Person : ${dataPerson.fullname}`,
              _id: dataPerson._id,
              timestamp: new Date(),
              data: data.FaceMatches
            })
          } else if (data.FaceMatches == [] && x == recognize.length-1) {
            resolve({
              message: 'No Person Found in the Database'
            })
          }
        }
      })
    }
  })
  return result
}

module.exports = {
  AWSRekognition
};