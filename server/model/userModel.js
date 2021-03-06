const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const student = mongoose.Schema([{
  name: String, 
  lastClassAttendanceTime: {type: Number, default: 0},
  totalAttendanceTime: {type: Number, default: 0},
  status: {type: String, default: "Not attended"}
}])

const classroom = mongoose.Schema([
  {
  event_id: Number,
  teacher: String,
  title: String,
  start: String,
  end: String,
  room: String,
  lastClassAttendanceTime: {type: Number, default: 0},
  totalAttendanceTime: {type: Number, default: 0},
  activelyAttendedCount: {type: Number, default: 0},
  mostlyAttendedCount: {type: Number, default: 0},
  failedToAttendCount: {type: Number, default: 0},
  status: String,
  students: [student]
}])



const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'Please add a first name'],
    },
    last_name: {
        type: String,
        required: [true, 'Please add a  last name'],
      },

    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    gender: {
        type: String,
        required: [true, 'Please add a  gender'],
    },
    is_teacher: {
        type: Boolean,
        default: false,
    },
    school: {
      type: String,
      required: [true, 'Please add a  school'],
  },
    pic: {
      type: String,
      default: "https://www.perfecttutor.in/images/student2.png"
  },
    dob: {
      type: String,
      required: [true, 'Please add your dob'],
      required: [true, 'Please add a  date of birth'],
  },
  classrooms: [classroom]
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema)