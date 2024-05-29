const { ErrorHandler } = require("../../../helper");
const User =require("../../../models/user");
const { getResetPasswordTemplate } = require("../../../utils/emailTemplates");
const sendEmail = require("../../../utils/sendEmail");
const sendToken = require("../../../utils/sendToken");
const crypto= require("crypto")
const registerUser= async(req,res,next)=>{
    const {name,email,password}=req.body;
    const user = await User.create({
        name,email,password
    })

    sendToken(user, 201, res);
}

 const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
    }
  
    // Find user in the database
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler(401,"Invalid email or password"));
    }
  
    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler(401,"Invalid email or password"));
    }
    sendToken(user, 200, res);
  };

  const logout = async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      message: "Logged Out",
    });
  };

  const forgotPassword = async (req, res, next) => {
    // Find user in the database
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHandler("User not found with this email", 404));
    }
  
    // Get reset password token
    const resetToken = user.getResetPasswordToken();
  
    await user.save();
  
    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;
  
    const message = getResetPasswordTemplate(user?.name, resetUrl);
  
    try {
      await sendEmail({
        email: user.email,
        subject: "ShopIT Password Recovery",
        message,
      });
  
      res.status(200).json({
        message: `Email sent to: ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save();
      return next(new ErrorHandler(500,error?.message));
    }
  };

  const resetPassword =async (req, res, next) => {
    // Hash the URL Token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          400,"Password reset token is invalid or has been expired"
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Passwords does not match", 400));
    }
  
    // Set the new password
    user.password = req.body.password;
  
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  };
  const getUserProfile = async (req, res, next) => {
    const user = await User.findById(req?.user?._id);
  
    res.status(200).json({
      user,
    });
  }

const updatePassword = async (req, res, next) => {
    const user = await User.findById(req?.user?._id).select("+password");
  
    // Check the previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler(400,"Old Password is incorrect"));
    }
  
    user.password = req.body.password;
    user.save();
  
    res.status(200).json({
      success: true,
    });
  }
  // Update User Profile  =>  /v1/me/update
 const updateProfile = async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
  
    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
    });
  
    res.status(200).json({
      user,
    });
  };

  const allUsers = async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      users,
    });
  };
  const getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(404,`User not found with id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      user,
    });
  };

  // Update User Details - ADMIN  =>  v1/admin/users/:id
 const updateUser = async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
    });
  
    res.status(200).json({
      user,
    });
  };
  
  // Delete User - ADMIN  =>  /api/v1/admin/users/:id
 const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(404,`User not found with id: ${req.params.id}`)
      );
    }
  
    // TODO - Remove user avatar from cloudinary
  
    await user.deleteOne();
  
    res.status(200).json({
      success: true,
    });
  };
  
  
module.exports={registerUser,loginUser,logout,forgotPassword, resetPassword, getUserProfile,updatePassword,updateProfile,allUsers,
    getUserDetails,updateUser,deleteUser
} 