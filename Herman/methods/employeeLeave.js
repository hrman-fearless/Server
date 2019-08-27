const User = require('../models/user');

function employeeLeave(id){
  let currentDate = new Date();
  currentDate = currentDate.getUTCFullYear() + '/' + currentDate.getUTCMonth() + '/' + currentDate.getUTCDate();

  return User.findById(id)
    .then((user) => {
      if(user){
        if(user.timeLogged.length !== 0){
          if(user.timeLogged[user.timeLogged.length - 1].arrival && user.timeLogged[user.timeLogged.length - 1].leave === undefined){
            user.timeLogged[user.timeLogged.length - 1].leave = new Date();
            return User.findByIdAndUpdate(id, {timeLogged: user.timeLogged});
          }else{
            return { statusCode: 400, body: JSON.stringify({message: "Employee is not yet record as arrive today"}) }
          }
        }else{
          return { statusCode: 400, body: JSON.stringify({message: "Employee is not yet record as arrive today"}) }
        }   
      }else{
        return { statusCode: 404, body: JSON.stringify({message: "Employee not found"}) }
      }
    })
    .then((user) => {
      return { statusCode: 200, body: JSON.stringify(user) }
    })
    .catch((err) => {
      return { statusCode: 500, body: JSON.stringify(err) }
    });
}

module.exports = {
  employeeLeave
}