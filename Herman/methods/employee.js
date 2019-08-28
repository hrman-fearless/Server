const User = require('../models/user');
const { compareHash } = require('../helpers/bcrypt');
const { sign } = require('../helpers/jwt');

class EmployeeMethods{

  static findAll(){
    return User.find()
      .then((users) => {
        return { statusCode: 200, body: JSON.stringify({data: users}) };
      })
      .catch((err) => {
        return { statusCode: 500, body: JSON.stringify(err)};
      })
  }

  static findById(id){
    return User.findById(id)
      .then((user) => {
        return { statusCode: 200, body: JSON.stringify({data: user}) };
      })
      .catch((err) => {
        return { statusCode: 500, body: JSON.stringify(err)};
      })
  }

  static update(id, data){
    return User.findOneAndUpdate({_id: id}, data, {runValidators: true, new: true})
      .then((user) => {
        return { statusCode:200, body: JSON.stringify({data: user}) };
      })
      .catch((err) => {
        return { statusCode: 500, body: JSON.stringify(err)};
      })
  }

  static signIn(data){
    return User.findOne({email: data.email})
      .then((user) => {
        if(user){
          if(compareHash(data.password, user.password)){
            
            const payload = {
              id: user._id,
              email : user.email,
              name: user.fullname,
              title: user.title
            }
            
            const token = sign(payload, process.env.SECRET_TOKEN);

            return User.findOneAndUpdate({_id: user._id}, {deviceID: data.deviceID})
              .then((user) => {
                return { statusCode: 200, body: JSON.stringify({id: user._id, token}) }
              })
              .catch((err) => {
                return { statusCode: 500, body: JSON.stringify(err)};
              })

            
          }else{
            return { statusCode: 401, body: JSON.stringify({message: 'Email or Password is invalid'}) };
          }
        }else{
          return { statusCode: 401, body: JSON.stringify({message: 'Email or Password is invalid'}) };
        }
      })
      .catch((err) => {
        return { statusCode: 500, body: JSON.stringify(err)};
      })
  }

  static register(data){
    return User.create(data)
      .then((user) => {
        return { statusCode: 201, body: JSON.stringify({data: user}) }
      })
      .catch((err) => {
        return { statusCode: 500, body: JSON.stringify(err)};
      })
  }

  static getWeekly(){
    return User.find().select('_id fullname timeLogged')
      .then((users) => {
        return { statusCode: 200, body: JSON.stringify(users) }
      })
      .catch((err) => {
        return { statusCode: 500, body: JSON.stringify(err)};
      });
  }

  static getDaily(){
    const output = [];
    return User.find().select('_id fullname timeLogged')
      .then((users) => {
        
        users.forEach((emp) => {
          const dataEmp = {
            _id: emp._id,
            fullname: emp.fullname
          }
      
          let today = new Date();
          today = today.getUTCFullYear() + '/' + today.getUTCMonth() + '/' + today.getUTCDate();
          let lastTimeLogged = (emp.timeLogged[emp.timeLogged.length-1]) && emp.timeLogged[emp.timeLogged.length-1].arrival || new Date("2000/01/01");
          lastTimeLogged = lastTimeLogged.getUTCFullYear() + '/' + lastTimeLogged.getUTCMonth() + '/' + lastTimeLogged.getUTCDate();
      
          if(today === lastTimeLogged){
            dataEmp.timeLogged = emp.timeLogged[emp.timeLogged.length-1].arrival;
          }else{
            dataEmp.timeLogged = null;
          }
          
          output.push(dataEmp);
      
        });

        return { statusCode: 200, body: JSON.stringify(output) }

      })
      .catch((err) => {
        return { statusCode: 500, body: JSON.stringify(err)};
      })
  }

}


module.exports = EmployeeMethods;