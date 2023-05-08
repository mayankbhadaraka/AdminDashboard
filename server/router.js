const User = require("./Model/User");
const express = require("express");
const multer = require("multer");
require("./DB/DB");

const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 100000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpe?g|png)$/i)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});

router.post("/saveData", upload.single("ProfilePicture"), async (req, res) => {
  if (req.file) {
    const { FirstName, LastName, Address, Mobile, Email, Password } = req.body;
    const ProfilePicture = `/${req.file.originalname}`;
    try {
      await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toFile(
          "C:/Users/mayan/Desktop/Lucent Innovation/LoginRegisterWithSQL/client/src/Images" +
            `/${req.file.originalname}`
        );
      if (
        !FirstName ||
        !LastName ||
        !Address ||
        !Mobile ||
        Mobile.length != 10 ||
        JSON.stringify(parseInt(Mobile)).length !== Mobile.length ||
        !Email ||
        !Password
      ) {
        res.status(422).json({ message: "Fill Details Properly." });
      } else {
        try {
          const newUser = await User.findOne({ where: { Email: Email } });
          if (newUser) {
            res.status(422).json({ message: "Email Already Exist." });
          } else {
            const hashedPassword = hash(Password);
            try {
              await User.create({
                FirstName: FirstName,
                LastName: LastName,
                Address: Address,
                Mobile: parseInt(Mobile),
                Email: Email,
                Password: hashedPassword,
                ProfilePicture: ProfilePicture,
              });
              res.json({ message: "Register Successfully." });
            } catch (error) {
              res.json({ message: error });
            }
          }
        } catch (error) {
          res.json({ message: error });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  } else {
    const { FirstName, LastName, Address, Mobile, Email, Password } = req.body;
    console.log("No Image");
    const ProfilePicture = null;
    try {
      if (
        !FirstName ||
        !LastName ||
        !Address ||
        !Mobile ||
        Mobile.length != 10 ||
        JSON.stringify(parseInt(Mobile)).length !== Mobile.length ||
        !Email ||
        !Password
      ) {
        res.status(422).json({ message: "Fill Details Properly." });
      } else {
        try {
          const newUser = await User.findOne({ where: { Email: Email } });
          if (newUser) {
            res.status(422).json({ message: "Email Already Exist." });
          } else {
            const hashedPassword = hash(Password);
            try {
              await User.create({
                FirstName: FirstName,
                LastName: LastName,
                Address: Address,
                Mobile: parseInt(Mobile),
                Email: Email,
                Password: hashedPassword,
                ProfilePicture: ProfilePicture,
              });
              res.json({ message: "Register Successfully." });
            } catch (error) {
              res.json({ message: error });
            }
          }
        } catch (error) {
          res.json({ message: error });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
});
// router.post("/logInUser", LoginUser);
// router.post("/update", Edit);
// router.post("/delete:id", DeleteUser);
// router.post("/Pagination", Pagination);
// router.post("/logout", Logout);
