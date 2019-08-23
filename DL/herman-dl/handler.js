'use strict';

module.exports.hello = async event => {
  console.log("masuk")
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Hello'
      }
    ),
  };
};

module.exports.another = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Another'
      }
    ),
  };
};

