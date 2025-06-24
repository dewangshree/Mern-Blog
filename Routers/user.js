// const express = require("express")

// const imageUpload = require("../Helpers/Libraries/imageUpload");

// const {profile,editProfile,changePassword,addStoryToReadList,readListPage} = require("../Controllers/user");
// const { getAccessToRoute } = require("../Middlewares/Authorization/auth");


// const router = express.Router() ;

// router.get("/profile",getAccessToRoute ,profile)

// router.post("/editProfile",[getAccessToRoute ,imageUpload.single("photo")],editProfile)

// router.put("/changePassword",getAccessToRoute,changePassword)

// router.post("/:slug/addStoryToReadList",getAccessToRoute ,addStoryToReadList)

// router.get("/readList",getAccessToRoute ,readListPage)



// module.exports = router

const express = require("express");
const router = express.Router();
const {
  profile,
  editProfile,
  changePassword,
  addStoryToReadList,
  readListPage,
  forgotPassword,
  resetPassword,
} = require("../Controllers/user");

const { getAccessToRoute } = require("../Middlewares/Authorization/auth"); // if you have this auth middleware

// Routes for logged-in users
router.get("/profile", getAccessToRoute, profile);
router.put("/edit-profile", getAccessToRoute, editProfile);
router.put("/change-password", getAccessToRoute, changePassword);
router.get("/read-list", getAccessToRoute, readListPage);
router.put("/read-list/:slug", getAccessToRoute, addStoryToReadList);

// 🔑 Routes for password reset (no login required)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
