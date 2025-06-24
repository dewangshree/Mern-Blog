// const asyncErrorWrapper = require("express-async-handler")
// const User = require("../Models/user");
// const Story = require("../Models/story");
// const CustomError = require("../Helpers/error/CustomError");
// const { comparePassword ,validateUserInput} = require("../Helpers/input/inputHelpers");

// const profile = asyncErrorWrapper(async (req, res, next) => {

//     return res.status(200).json({
//         success: true,
//         data: req.user
//     })

// })


// const editProfile = asyncErrorWrapper(async (req, res, next) => {

//     const { email, username } = req.body

//     const user = await User.findByIdAndUpdate(req.user.id, {
//         email, username,
//         photo : req.savedUserPhoto
//     },
//         {
//             new: true,
//             runValidators: true
//         })

//     return res.status(200).json({
//         success: true,
//         data: user

//     })

// })


// const changePassword = asyncErrorWrapper(async (req, res, next) => {

//     const  {newPassword , oldPassword}=req.body 

//     if(!validateUserInput(newPassword,oldPassword)){

//         return next(new CustomError("Please check your inputs ", 400))

//     }

//     const user = await User.findById(req.user.id).select("+password")

//     if(!comparePassword(oldPassword , user.password)){
//         return next(new CustomError('Old password is incorrect ', 400))
//     }

//     user.password = newPassword 

//     await user.save() ;


//     return res.status(200).json({
//         success: true,
//         message : "Change Password  Successfully",
//         user : user

//     })

// })


// const addStoryToReadList =asyncErrorWrapper(async(req,res,next) => {

//     const {slug} =req.params 
//     const { activeUser} = req.body  ; 

//     const story = await Story.findOne({slug})

//     const user = await User.findById(activeUser._id)

//     if (!user.readList.includes(story.id)){

//         user.readList.push(story.id)
//         user.readListLength = user.readList.length
//         await user.save() ; 
//     }
    
//     else {
//         const index = user.readList.indexOf(story.id)
//         user.readList.splice(index,1)
//         user.readListLength = user.readList.length
//         await user.save() ; 
//     }

//     const status =user.readList.includes(story.id)

//     return res.status(200).json({
//         success:true ,
//         story  :story ,
//         user : user,
//         status:status
//     })

// })

// const readListPage =asyncErrorWrapper(async (req,res,next) => {

//     const user = await User.findById(req.user.id)
//     const readList = []

//     for (let index = 0; index < user.readList.length; index++) {
       
//        var story = await Story.findById( user.readList[index]).populate("author")

//        readList.push(story)

//     }

//     return res.status(200).json({
//         success :true ,
//         data :readList
//     })

// })

// module.exports = {
//     profile,
//     editProfile,
//     changePassword,
//     addStoryToReadList,
//     readListPage
// }



const asyncErrorWrapper = require("express-async-handler");
const crypto = require("crypto");
const User = require("../Models/user");
const Story = require("../Models/story");
const sendEmail = require("../Helpers/Libraries/sendEmail");
const CustomError = require("../Helpers/error/CustomError");
const { comparePassword, validateUserInput } = require("../Helpers/input/inputHelpers");

// 🔐 Profile
const profile = asyncErrorWrapper(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

// ✏️ Edit Profile
const editProfile = asyncErrorWrapper(async (req, res, next) => {
  const { email, username } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      email,
      username,
      photo: req.savedUserPhoto,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    data: user,
  });
});

// 🔁 Change Password
const changePassword = asyncErrorWrapper(async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;

  if (!validateUserInput(newPassword, oldPassword)) {
    return next(new CustomError("Please check your inputs", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!comparePassword(oldPassword, user.password)) {
    return next(new CustomError("Old password is incorrect", 400));
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
    user: user,
  });
});

// 📚 Add or Remove Story from Reading List
const addStoryToReadList = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { activeUser } = req.body;

  const story = await Story.findOne({ slug });
  const user = await User.findById(activeUser._id);

  if (!user.readList.includes(story.id)) {
    user.readList.push(story.id);
    user.readListLength = user.readList.length;
    await user.save();
  } else {
    const index = user.readList.indexOf(story.id);
    user.readList.splice(index, 1);
    user.readListLength = user.readList.length;
    await user.save();
  }

  const status = user.readList.includes(story.id);

  return res.status(200).json({
    success: true,
    story: story,
    user: user,
    status: status,
  });
});

// 📖 View Read List Page
const readListPage = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const readList = [];

  for (let index = 0; index < user.readList.length; index++) {
    const story = await Story.findById(user.readList[index]).populate("author");
    readList.push(story);
  }

  return res.status(200).json({
    success: true,
    data: readList,
  });
});

// 📧 Forgot Password
const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("No user found with that email", 404));
  }

  // ✅ FIXED: Match model method name
  const resetToken = user.getResetPasswordTokenFromUser();
  await user.save();

  const resetUrl = `${process.env.URI}/reset-password/${resetToken}`;
  const message = `
    <h1>Password Reset</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
  `;

  await sendEmail({
    to: user.email,
    subject: "MERN Blog Password Reset",
    html: message,
  });

  return res.status(200).json({
    success: true,
    message: "Password reset link sent to email.",
  });
});

// 🔁 Reset Password Using Token
const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Invalid or expired reset token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
  });
});

module.exports = {
  profile,
  editProfile,
  changePassword,
  addStoryToReadList,
  readListPage,
  forgotPassword,
  resetPassword,
};

