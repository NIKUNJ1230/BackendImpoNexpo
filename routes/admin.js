var express = require('express');
var router = express.Router();

// models
const SignUp = require('../model/Admin/Admin');
const Vender = require('../model/Admin/VenderRegistration');
const AddProduct = require('../model/Admin/AddProduct');
const Categories = require('../model/Admin/Categories');

var multer = require('multer');
var jwt = require('jsonwebtoken');
var auth = require('../middlewere/auth')
var JWT_SECRET = "impoNexpo";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('/admin routes');
});

// /admin/ admin panel sign up
router.post('/Signup', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const existingUser = await SignUp.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const user = await SignUp.create({
      Email,
      Password
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

// admin panel sign in
router.post('/login', async (req, res) => {
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



// vender Registration
router.post('/Registration/Vender', upload.single('profileImage'), async (req, res) => {
  try {
    const { Manager, BusinessName, Website, Mobile, EntityType, Email, Country, Address, ProductName, ProductCategory, ProductDescription, AffiliatePartner, SellersCapacity, Summary, Password } = req.body;
    const profileImage = req.file ? req.file.filename : '';
    const existingUser = await Vender.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await Vender.create({
      Manager, BusinessName, Website, Mobile, EntityType, Email, Country, Address, ProductName, ProductCategory, ProductDescription, ProfileImage: profileImage, AffiliatePartner, SellersCapacity, Summary, Password
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// vender login
router.post('/Vender/login', async (req, res) => {
  const { Email, Password } = req.body;
  try {
    var hash = await Vender.find({ Email: Email });
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

// product upload
router.post('/Vender/AddProduct', auth, upload.array('productImage'), async (req, res) => {
  try {
    const { VenderId, ProductName, HashTags, ProductDescription, StartPrice, EndPrice, MinOrder, Stock, Category, SubCategory } = req.body;
    const productImages = req.files.map(file => file.filename); // Get filenames of all uploaded images
    console.log(productImages)
    const product = await AddProduct.create({
      VenderId, ProductImage: productImages, ProductName, HashTags, ProductDescription, StartPrice, EndPrice, MinOrder, Stock, Category, SubCategory
    });
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/Get/All/Product", async (req, res) => {
  try {
    const product = await AddProduct.find().sort({ CreatedAt: -1 });
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

// router.post('/Vender/AddProduct', auth, upload.single('productImage'), async (req, res) => {
//   try {
//     const { ProductName, HashTags, ProductDescription, StartPrice, EndPrice, MinOrder, Stock, Category,SubCategory } = req.body;
//     const productImage = req.file ? req.file.filename : '';
//     const product = await AddProduct.create({
//       VenderId: req.user.id, ProductImage: productImage, ProductName, HashTags: HashTags, ProductDescription, StartPrice, EndPrice, MinOrder, Stock, Category, SubCategory
//     });

//     res.status(200).json({ product });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// find categories for  :: figma page name more categories
router.get('/Find/Categories', async (req, res) => {
  try {
    const Category = await Categories.find({}, { _id: 0 });
    res.status(200).json({ Category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// add categories  :: figma page name more categories
router.post('/Add/Categories', async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    let category = await Categories.findOne({ name });
    if (category) {
      category.subcategories.push(...subcategories);
    } else {
      category = new Categories({
        name,
        subcategories
      });
    }
    await category.save();
    res.status(201).json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/get/all/product', async (req, res) => {
  try {
    let products = [
      {
          id: 1,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "Readymade",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 2,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "live",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 16, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 3,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "live",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 4,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "Readymade",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 5,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "live",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 6,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "Readymade",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 7,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "live",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 8,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "live",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 9,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "Readymade",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 10,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "live",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
  
      {
          id: 11,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "Readymade",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
      {
          id: 12,
          user: {
              profile: "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
              name: "David",
              handle: "@david-semllons",
              contury: "china",
              followers: "1.5k",
          },
          availability: "live",
          image: "https://m.media-amazon.com/images/I/414g9UxZ7YL._SX300_SY300_QL70_FMwebp_.jpg",
          description: "8 threads with up to 4.1 GHz max boost clock and 4MB L3 cache deliver exceptional processing speeds. AMD Radeon graphics help you perform intensive multimedia tasks.",
          hashtages: ["#go", "#World","David","#Semllons","imorts"],
          minOrder: 20,
          maxPrice: 40,
          minprice: 80,
          title: "HP Laptop 15, AMD Ryzen 3 7320U",
          totalOrders: 22,
          rating: 2.5,
          like: 18,
          comment: 22,
          share: 15,
          download: 10,
      },
  ];
    
    res.status(201).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






module.exports = router;