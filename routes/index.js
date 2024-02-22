var express = require('express');
var router = express.Router();
const SignUp = require('../model/Signup');
const Vender = require('../model/Admin/VenderRegistration');
const AddProduct = require('../model/Admin/AddProduct');
const AboutUs = require('../model/Admin/AboutUs');
const Comments = require('../model/Admin/Comment');
const FeedBack = require('../model/Admin/FeedBack');
const Reviews = require('../model/Admin/Reviews');
const SavedProduct = require('../model/Admin/SavedProduct');
const LikeProduct = require('../model/Admin/Like');
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
var JWT_SECRET = "impoNexpo";
const npStorage = require("node-persist");
var nodemailer = require("nodemailer");
var multer = require('multer');
const Auth = require('../middlewere/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// signup api
router.post('/Signup', async (req, res) => {
  try {
    const { FirstName, LastName, Email, Mobile, Password, AccountType, CompanyName, Country, ReasionForSignUp, Site, TnC } = req.body;
    const existingUser = await SignUp.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUserMobile = await SignUp.findOne({ Mobile });
    if (existingUserMobile) {
      return res.status(400).json({ message: 'Mobile already exists' });
    }

    const user = await SignUp.create({
      FirstName,
      LastName,
      Email,
      Mobile,
      Password,
      AccountType,
      CompanyName,
      Country,
      ReasionForSignUp,
      Site,
      TnC
    })

    var data = {
      user: {
        id: user.id,
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    res.status(200).json({ authToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// login api
router.post('/Email/login', async (req, res) => {
  const { Email, Password } = req.body;
  try {
    var hash = await SignUp.find({ Email: Email });
    if (hash != "") {
      if (hash[0].Password == Password) {
        var data = {
          user: {
            id: hash[0].id
          }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.status(200).json({ authToken });
      } else {
        return res.status(400).json({ status: 400, message: 'Wrong password' });
      }
    } else {
      return res.status(400).json({ status: 400, message: 'Please Enter Correct Email' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/Mobile/login', async (req, res) => {
  const { Mobile, Password } = req.body;
  try {
    var hash = await SignUp.find({ Mobile: Mobile });
    if (hash != "") {
      if (hash[0].Password == Password) {
        var data = {
          user: {
            id: hash[0].id
          }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.status(200).json({ authToken });
      } else {
        return res.status(400).json({ status: 400, message: 'Wrong password' });
      }
    } else {
      return res.status(400).json({ status: 400, message: 'Please Enter Correct Email' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// send Email otp for  forgot passoword
router.get("/User/SendOtp/ForgotPassword/:email", async function (req, res) {
  try {
    await npStorage.init();

    const email = req.params.email;
    const gen_otp = Math.floor(1000 + Math.random() * 9000);
    const otp = gen_otp.toString();
    const StrEmail = String(email);

    await npStorage.setItem(StrEmail, otp);
    const spacedOtp = otp.split('').map(digit => `${digit}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`).join('');
    var smtpConfig = {
      host: 'smtp.gmail.com',
      secure: false, // use SSL
      auth: {
        user: 'loyaltylion11@gmail.com',
        pass: 'emwcxqyknneselaw' // Replace with the App Password you generated
      }
    };
    var smtpTransport = nodemailer.createTransport(smtpConfig);

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: '"Imponexpo@Service " <loyaltylion11@gmail.com>',
      to: email,
      subject: "Imponexpo - Forgot Password verification",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
      <div style="background-color: #523cf6; text-align: center; padding:5px; color: white; border-radius: 10px; margin:0px auto;width:90%;">
      <h3 >Imponexpo - Forgot Password verification</h3>
    </div>
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:30px 0px;width:100%;padding:20px 0; text-align: center;">
        <p class=" text-align: center;">Please Verify Otp To Reset Password of Imponexpo <br> Do Not share this Otp. OTP is valid for 5 minutes</p>
        <h1 style="margin:20px 0px;width:100%;  text-align: center;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${spacedOtp}</h1>
        
        <p style="color:#00000073; margin:30px auto;width:70%;">If you didn't request then you can safely ignore it.<br /></p>
        <p style="font-size:0.9em; text-align: right;width:85%;">Thanks,<br />The Imponexpo Team</p>
      </div>
    </div>
    <div style="background-color: #523cf6; text-align: center;padding:4px; color: white;  ">
      <h5 class="h3">Copyrights @ Lion11 All Rights Reserved</h5>
    </div>
      </body>
      </html>
        `,
    };


    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
        return res.json(error);
      } else {
        console.log("Message sent: " + response);
        return res.json({ message: "OTP sent successfully" });
      }
    });
    setTimeout(async () => {
      await npStorage.removeItem(StrEmail);
      console.log("OTP cleared after 5 minutes");
    }, 300000);

    // return res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// verify Otp for user forgot password
router.post("/User/VerifyOtp/ForgotPassword", async function (req, res) {
  await npStorage.init();
  const email = req.body.Email;
  var user_otp = req.body.user_otp;
  const StrEmail = String(email);
  var store_otp = await npStorage.getItem(StrEmail);
  if (store_otp == user_otp) {
    res.status(200).json({ status: 200, message: "verified successfully" });
  } else {
    res.status(403).json({ status: 403, message: "Please enter Valid Otp" });
  }
});

// Update  for user forgot password
router.post("/Update/User/Password", async function (req, res) {
  await npStorage.init();
  const email = req.body.Email;
  const Password = req.body.Password;
  try {

    const filter = { Email: email };
    const update = { Password: Password };

    const updated = await SignUp.findOneAndUpdate(filter, update);
    if (updated.Email == email) {
      res.status(200).json({ status: 200, message: "Password Update Successfully" });
    } else {
      res.status(404).json({ status: 404, message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Somethings Went Wrong" });
  }
});

// increase views of product for trending
router.get("/Increase/View/Product/:id", async (req, res) => {
  const productId = req.params.id;
  const filter = { _id: productId }
  const update = { $inc: { Views: 1 } }
  const Data = await AddProduct.findOneAndUpdate(filter, update)
  res.status(200).json({ Data });
})

// find trending products   
router.get("/Trending/Products", async (req, res) => {
  const Data = await AddProduct.find().sort({ Views: -1 })
  res.status(200).json({ Data });
})

// find recent products
router.get("/Recent/Products", async (req, res) => {
  const Data = await AddProduct.find().sort({ CreatedAt: -1 })
  res.status(200).json({ Data });
})

// increase vender views by _id for trending
router.get("/Increase/View/Vender/:id", async (req, res) => {
  const _id = req.params.id;
  const filter = { _id: _id }
  const update = { $inc: { Views: 1 } }
  const Data = await Vender.findOneAndUpdate(filter, update)
  res.status(200).json({ Data });
})

// find trending vender 
router.get("/Trending/Vender", async (req, res) => {
  const Data = await Vender.find().sort({ Views: -1 })
  res.status(200).json({ Data });
})

// find products by category
router.get("/Find/HashTags", async (req, res) => {
  try {
    const data = await AddProduct.find({}, { HashTags: 1, _id: 0 });
    let hashtagsCount = {};

    // Flatten the array and count the occurrences of each hashtag
    data.forEach(item => {
      item.HashTags.forEach(tag => {
        hashtagsCount[tag] = (hashtagsCount[tag] || 0) + 1;
      });
    });

    // Convert the counts into an array of objects
    let sortedHashtags = [];
    for (let tag in hashtagsCount) {
      sortedHashtags.push({ tag, count: hashtagsCount[tag] });
    }

    // Sort the hashtags based on their counts
    sortedHashtags.sort((a, b) => b.count - a.count);

    // Extract only the hashtags from the sorted array
    let result = sortedHashtags.map(item => item.tag);

    res.status(200).json({ Data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add what prapel and business saying about us
router.post('/Add/AboutUs', Auth, async (req, res) => {
  try {
    const { Rank, Name, Descreption } = req.body;
    console.log(req.user)
    const VenderData = await Vender.find({ _id: req.user.id })
    console.log(VenderData[0].BusinessName)
    console.log(VenderData[0].ProfileImage)

    const user = await AboutUs.create({
      Profile: VenderData[0].ProfileImage,
      Rank,
      Name: VenderData[0].BusinessName,
      Descreption
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get what prapel and business saying about us
router.get('/Get/AboutUs', async (req, res) => {
  try {
    const Data = await AboutUs.find().sort({ CreatedAt: -1 });
    res.status(200).json({ Data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// find products by category
router.get("/Find/Products/:Category", async (req, res) => {
  const Category = req.params.Category
  const Data = await AddProduct.find({ Category }).sort({ CreatedAt: -1 })
  res.status(200).json({ Data });
})


// :::::::::::::::::::::::::::::::
// Like product

router.get("/Like/Product/:id/:UserId", async (req, res) => {

  const productId = req.params.id;
  const UserId = req.params.UserId;

  try {
    const product = await AddProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingLike = await LikeProduct.findOne({
      ProductId: productId,
      UserId: UserId
    });

    if (existingLike) {
      // If like already exists, remove the like
      await LikeProduct.findByIdAndDelete(existingLike._id);
      await AddProduct.findByIdAndUpdate(productId, { $inc: { Like: -1 } });
      return res.status(200).json({ message: "Like removed successfully" });
    } else {
      // If like does not exist, add the like
      await LikeProduct.create({
        ProductId: productId,
        UserId: UserId
      });
      await AddProduct.findByIdAndUpdate(productId, { $inc: { Like: 1 } });
      return res.status(200).json({ message: "Product liked successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// router.get("/Like/Product/:id/:UserId", async (req, res) => {
//   const productId = req.params.id;
//   const UserId = req.params.UserId;
//   const filter = { _id: productId };
//   const update = { $inc: { Like: 1 } };
//   const Data = await AddProduct.findOneAndUpdate(filter, update);
//   const user = await SignUp.findById(UserId); // Populate user data
//   const like = await LikeProduct.create({
//     ProductId: productId,
//     UserId: UserId
//   });
//   res.status(200).json({ like });
// });



// Comment on Product

router.post("/Comment/Product/:id/:UserId", async (req, res) => {
  const Id = req.params.id;
  const UserId = req.params.UserId;
  try {
    const { Message } = req.body;

    const user = await Comments.create({
      ProductId: Id,
      UserId: UserId,
      Message: Message
    });
    if (user) {
      const filter = { _id: Id }
      const update = { $inc: { Comment: 1 } }
      await AddProduct.findOneAndUpdate(filter, update)
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

// find comment of product

router.get("/Find/Product/Comments/:id", async (req, res) => {
  const Id = req.params.id;
  const Data = await Comments.find({ ProductId: Id }).sort({ CreatedAt: -1 })
  res.status(200).json({ Data });
})


// save product --- niraj

router.get("/Save/Product/:userId/:productId", async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  try {
    // Check if the product is already saved by the user
    const alreadySaved = await SavedProduct.findOne({
      UserId: userId,
      ProductId: productId
    });

    if (alreadySaved) {
      // If the product is already saved, delete it
      await SavedProduct.deleteOne({
        UserId: userId,
        ProductId: productId
      });

      // Decrease the "Saved" count of the product
      await AddProduct.findByIdAndUpdate(productId, { $inc: { Saved: -1 } });
      res.status(200).json({ message: 'Unsaved!' });
    } else {
      // If the product is not saved, save it
      await SavedProduct.create({
        UserId: userId,
        ProductId: productId
      });

      // Increase the "Saved" count of the product
      await AddProduct.findByIdAndUpdate(productId, { $inc: { Saved: 1 } });
      res.status(200).json({ message: 'Saved!' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// old 
// router.get("/Save/Product/:userId/:productId", async (req, res) => {
//   const userId = req.params.userId;
//   const productId = req.params.productId;

//   try {
//     // Check if the product is already saved by the user
//     const alreadySaved = await SavedProduct.findOne({
//       UserId: userId,
//       ProductId: productId
//     });

//     if (alreadySaved) {
//       // If the product is already saved, delete it
//       await SavedProduct.deleteOne({
//         UserId: userId,
//         ProductId: productId
//       });

//       // Decrease the "Saved" count of the product
//       await AddProduct.findByIdAndUpdate(productId, { $inc: { Saved: -1 } });
//     } else {
//       // If the product is not saved, save it
//       await SavedProduct.create({
//         UserId: userId,
//         ProductId: productId
//       });

//       // Increase the "Saved" count of the product
//       await AddProduct.findByIdAndUpdate(productId, { $inc: { Saved: 1 } });
//     }

//     res.status(200).json({ message: 'Success!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// send FeedBack on Product
router.post("/Send/FeedBack/:id/:UserId", async (req, res) => {
  const Id = req.params.id;
  const UserId = req.params.UserId;
  try {
    const { feedback } = req.body; // Use a different variable name to avoid confusion with the model name
    const user = await FeedBack.create({
      ProductId: Id,
      UserId: UserId,
      FeedBack: feedback // Use the variable name for the feedback from req.body
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// find Feedback of product
router.get("/Find/Product/Feedback/:id", async (req, res) => {
  const Id = req.params.id;
  const Data = await FeedBack.find({ ProductId: Id }).sort({ CreatedAt: -1 })
  res.status(200).json({ Data });
})

// delete Feedback of product // for admin
router.get("/Delete/Product/Feedback/:id", async (req, res) => {
  const Id = req.params.id;
  await FeedBack.deleteOne({
    _id: Id
  });
  res.status(200).json({ Message: 'Feedback deleted' });
})


// send Reviews on Product
router.post("/Send/Reviews/:id/:UserId", async (req, res) => {
  const Id = req.params.id;
  const UserId = req.params.UserId;
  try {
    const { reviews } = req.body; // Use a different variable name to avoid confusion with the model name
    const user = await Reviews.create({
      ProductId: Id,
      UserId: UserId,
      Reviews: reviews // Use the variable name for the feedback from req.body
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// find Reviews of product
router.get("/Find/Product/Reviews/:id", async (req, res) => {
  const Id = req.params.id;
  const Data = await Reviews.find({ ProductId: Id }).sort({ CreatedAt: -1 })
  res.status(200).json({ Data });
})

// delete Reviews of product // for admin
router.get("/Delete/Product/Reviews/:id", async (req, res) => {
  const Id = req.params.id;
  await Reviews.deleteOne({
    _id: Id
  });
  res.status(200).json({ Message: 'Reviews deleted' });
})


router.post('/products/:productId/rate', async (req, res) => {
  const productId = req.params.productId;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid rating value. Rating must be between 1 and 5.' });
  }

  try {
    const product = await AddProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const updatedAverageRating = Math.round(((product.averageRating * product.totalRatings) + rating) / (product.totalRatings + 1) * 2) / 2;
    product.averageRating = updatedAverageRating;
    product.totalRatings += 1;
    await product.save();
    res.status(200).json({ message: 'Product rated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
