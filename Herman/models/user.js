const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const { hashPassword } = require('../helpers/bcrypt');

const userSchema = new Schema({
  fullname:  {
    type : String,
    required : [true, `Please Fill in Your Name`],
  },
  title: {
    type : String,
    required : [true, `Please Provide Username for Your Account`],
  },
  jobDesc: {
    type: String,
    required: [true, `Please Provide Job Description for Your Account`]
  },
  isManager: {
    type: Boolean
  },
  email: {
    type : String,
    required : [true, `Please Provide a Valid Email for Your Account`],
    match : [/^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please Proved a Valid Email'],
    unique: true 
  },
  password: {
    type : String,
    required : [true, 'Please Provide Password for Your Account'],
    minlength : [8, `Password Must be 8 Characters or More`],
    match : [/^[a-zA-Z0-9]*$/ , 'Password can Only Contain Alpha Numeric']
  },
  birthday: {
    type: Date,
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  photos: {
    Bucket: String,
    Name: String
  },
  timeLogged: [
    {
      arrival: Date,
      leave: Date
    }
  ]
}, {
  versionKey : false,
  timestamps: true
});

userSchema.pre('save', function(next) {
  this.password = hashPassword(this.password)
  next()
})

userSchema.plugin(uniqueValidator, { message: `Someone Already Used {VALUE} as their {PATH}` });

let User;
try {
  User = mongoose.model('user')
} catch (error) {
  User = mongoose.model('user', userSchema)
}

module.exports = User
