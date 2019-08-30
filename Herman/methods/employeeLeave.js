const User = require('../models/user');

function employeeLeave(id){
  let currentDate = new Date();
  currentDate = currentDate.getUTCFullYear() + '/' + currentDate.getUTCMonth() + '/' + currentDate.getUTCDate();

  return User.findById(id)
    .then((user) => {
      /* istanbul ignore else */
      if(user){
        /* istanbul ignore else */
        if(user.timeLogged.length !== 0){
          /* istanbul ignore if */
          if(user.timeLogged[user.timeLogged.length - 1].arrival && user.timeLogged[user.timeLogged.length - 1].leave === undefined){
            user.timeLogged[user.timeLogged.length - 1].leave = new Date();
            return User.findByIdAndUpdate(id, {timeLogged: user.timeLogged});
          }else{
            throw { statusCode: 400, body: JSON.stringify({message: "Employee is not yet record as arrive today"}) }
          }
        }else{
          throw { statusCode: 400, body: JSON.stringify({message: "Employee is not yet record as arrive today"}) }
        }   
      }else{
        throw { statusCode: 404, body: JSON.stringify({message: "Employee not found"}) }
      }
    })
    .then((user) => { /* istanbul ignore next */
      return { statusCode: 200, body: JSON.stringify(user) }
    })
    .catch((err) => {
      return { statusCode: err.statusCode || 500, body: err.body || "Internal Server Error" }
    });
}

module.exports = {
  employeeLeave
}