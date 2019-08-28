const User = require('../models/user');

function employeeArrive(result){
  return User.findById(result._id)
    .then((user) => {
      if(user){
        if(user.timeLogged.length === 0){
          user.timeLogged.push({arrival: result.timestamp});
          return User.findByIdAndUpdate(result._id, {timeLogged: user.timeLogged});
        }else{
          let exist = false;

          user.timeLogged.forEach((el) => {
            let newArrival = result.timestamp.getUTCFullYear() + '/' + result.timestamp.getUTCMonth() + '/' + result.timestamp.getUTCDate();
            let dbArrival = el.arrival.getUTCFullYear() + '/' + el.arrival.getUTCMonth() + '/' + el.arrival.getUTCDate();

            if(newArrival === dbArrival){
              exist = true;
            }
          });

          if(exist !== true){
            user.timeLogged.push({arrival: result.timestamp});
            return User.findByIdAndUpdate(result._id, {timeLogged: user.timeLogged}, {new: true});
          }else{
            return null;
          }

        }
      }
    })
    .then((user) => {
      if(user){
        return user;
      }
    })
    .catch((err) => {
      return { statusCode: 500, body: JSON.stringify(err) }
    })
}

module.exports = {
  employeeArrive
}