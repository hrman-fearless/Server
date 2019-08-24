'use strict';

module.exports.hello = async event => {
  console.log('hehehe')
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        makian: 'ahiihhh gilaakkkk',
        input: event,
      }
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.s3bucket = function(event, context, callback) {
  console.log("Incoming Event: ", event);
  console.log('hello gilaaakkkk')
  // console.log("Incoming Event: ", event.Records[0].s3);
  // const bucket = event.Records[0].s3.bucket.name;
  // const filename = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  // const message = `File is uploaded in - ${bucket} -> ${filename}`;
  // console.log(message);
  callback(null, event);
};
