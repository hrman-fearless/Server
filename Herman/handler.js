'use strict';
const mongoose = require('mongoose');
const querystring = require('querystring');
const rekognition = require('./config/config');
const { AWSRekognition } = require('./helpers/rekognition');
// const { compareHash } = require('./helpers/bcrypt');
const { sign } = require('./helpers/jwt');
const connectDB = mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true
}, function(err) {
  if (err) console.log(err);
});
mongoose.set('useCreateIndex', true)
const User = require('./models/user');

module.exports.createUser = async (event, context, callback) => {
  const newUser = querystring.parse(event.body);
  newUser.birthday = new Date (newUser.birthday.split('-').reverse().join('-'))
  try {
    const created = await User.create(newUser)
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `User ${newUser.fullname} has been created`,
          data: created,
        }
      )
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: `Error`,
          error,
        }
      )
    }
  }
}

// module.exports.signIn = async (event, context, callback) => {
//   const returningUser = querystring.parse(event.body);
//   try {
//     const found = await User.findOne({
//       email : returningUser.email
//     })
//     if (found) {
//       if (compareHash(returningUser.password, found.password)) {
//         const token = sign({
//           id: found._id,
//           email : found.email,
//           name: found.name,
//           title: found.title
//         }, process.env.SECRET_TOKEN);
//         return ({
//           statusCode: 200,
//           body: JSON.stringify(
//             {
//               token
//             }
//           )
//         })
//       } else {
//         return ({
//         status : 401,
//           message : 'Invalid Username or Password'
//         })
//       }
//     } else {
//       return ({
//         status : 401,
//         message : 'Invalid Username or Password'
//       })
//     }
//   } catch (error) {
//     console.log(error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify(
//         {
//           message: `Error`,
//           error,
//         }
//       )
//     }
//   }
// }

module.exports.employeeArrived = async (payload, event, context, callback) =>  {
  console.log('Start Here');
  console.log(payload);

  // const params = {
  //   SimilarityThreshold: 70, 
  //   SourceImage: {
  //    S3Object: {
  //       Bucket: imageURL.Bucket, 
  //       Name: imageURL.Name
  //     }
  //   }, 
  //   TargetImage: {
  //    S3Object: {
  //       Bucket: "herman-photos", 
  //       Name: "yuda2.jpg"
  //     }
  //   }
  // }

  // const result = await new Promise ((resolve, reject) => {
  //   rekognition.compareFaces(params, function(err, data) {
  //     if (err) reject(err)
  //     else {
  //       resolve(data)
  //     }
  //   })
  // })
  // return {
  //   statusCode: 500,
  //   body: JSON.stringify(
  //     {
  //       message: `Hasil`,
  //       result,
  //     }
  //   )
  // }
}

module.exports.test = async (event, context, callback) => {
  const data = event.Records[0].s3
  const payload = {
    Bucket : data.bucket.name,
    Name: data.object.key
  }
  console.log(payload);
  console.log('Triggered');
  const result = await AWSRekognition(payload)
  console.log(result, '@test');
  
}