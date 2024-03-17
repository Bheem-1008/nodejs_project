// modul 
const express = require('express');
const router = express.Router();
const reg = require('../modal/regesterSchema');
const contact = require('../modal/contact_Schema');
const add = require('../modal/add_Schema');
const conn = require('../db/config');
const foods =  require('../modal/food_item')

const cookieParser = require('cookie-parser');
const session = require('express-session');

const multer = require('multer')
router.use(express.static('upload'));
const { v4: uuidv4 } = require('uuid');

const chaf = require('../modal/chafSchema');




router.use(cookieParser());
router.use(
    session({
        key: "user_sid",
        secret: "domeranddonstuffs",
        resave: false,
        saveUninitialized: false,

    })
)


// *************************************** upload file
const storage = multer.diskStorage({
    destination: (rew, file, cb) => {
        cb(null, './upload');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
        //cb(null, uuidv4()+ '-' + Date.now() + Path2D.extname(file.originalname)) //Appending

    }
})
const filefilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

let upload = multer({ storage, filefilter })

// *************************************** upload file picture end


router.get('/readmore/:id', async (req, res) => {
    try {
        const userreadmore = await add.findById(req.params.id);
        res.render('food', { userreadmore: userreadmore });
    } catch (err) {
        console.log(err);
    }
})

router.get('/', async (req, res) => {
    try {
        const adddata = await add.find({});
        const chafdata = await chaf.find({});
        const foodData = await foods.find({});
        res.render('index', { adddata: adddata, chafdata: chafdata, foodData:foodData });
    } catch (err) {
        console.log(err)
    }
})



router.get('/aboutUs', (req, res) => {
    res.render('about');
})

// *********************************** CART 
router.get('/cart', (req, res) => {
    try {
        if (req.session.user && req.cookies.user_sid) {
            res.render('cart');
        } else {
            res.redirect('/')   
        }
    } catch (err) {
        console.log(err)
    }
})


// contact us  data send mongodb
router.get('/contactus', (req, res) => {
    res.render('contact_Us');
})
router.post('/contact', (req, res) => {
    let contactus = {
        Fullname: req.body.Fullname,
        A_email: req.body.A_email,
        Mobile: req.body.Mobile,
        S_email: req.body.S_email,
        msg: req.body.msg
    };
    let contpost = new contact(contactus);
    contpost.save().then(() =>
        res.json('contact successfully'))
        .catch(err => res.status(404).json("not found :" + err));

});
router.get('/view_contact', async (req, res) => {
    try {
        if (req.session.user && req.cookies.user_sid) {
            const contdata = await contact.find({})
            res.render('dashboard/view_contact', { contdata: contdata })
        }
        else {
            res.redirect('/')
        }
    } catch (err) {
        console.log(err)
    }
})
// delete buttom
router.get("/delete_3/:id", async (req, res) => {
    try {
        const moviedata = await contact.findByIdAndDelete(req.params.id);
        res.redirect('/view_contact')
    } catch (err) {
        console.log(err);
    }
});
router.get('/edit_3/:id', async (req, res) => {
    try {
        const editdata = await contact.findById(req.params.id);
        res.render('dashboard/edit_constact', { editdata: editdata })
    } catch (err) {
        console.log(err)
    }
});
router.post('/edit_3/:id', async (req, res) => {
    const itemId = req.params.id
    let contup = {
        Fullname: req.body.Fullname,
        A_email: req.body.A_email,
        Mobile: req.body.Mobile,
        S_email: req.body.S_email,
        msg: req.body.msg
    };
    try {
        const contdata = await contact.findByIdAndUpdate(itemId, contup, { new: true });
        if (!contdata) {
            res.status(404).json({ massage: 'item not fond' })
        }
        res.redirect('/view_contact')
    } catch (err) {
        res.status(500).json({ massage: 'server error' })

    }
})





//**************************************************** login 
router.post('/login', async (req, res) => {
    let email = req.body.email,
        password = req.body.password

    try {
        let user = await reg.findOne({ email: email }).exec();
        if (!user) {
            res.status(400).send({ massage: 'pleses coorect email' })
        }
        user.comparePassword(password, (error, match) => {
            if (!match) {
                res.json({ massage: 'pleses correct password' })
                // res.redirect('       /')
            }
            if (user.roll !== 1) {
                res.redirect('/');
            }
           
        })
        req.session.user = user
        res.redirect('/dashboard');


        
    } catch (error) {
        console.log(error)
    }
})



// register data send mongodb 1
router.get('/signup', (req, res) => {
    res.render('signup');
})
router.post('/register', (req, res) => {
    let register = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile
    };

    let regpost = new reg(register);
    regpost.save()
        .then(() =>
            res.json('register successfully'))
        .catch(err => res.status(404).json('error : ' + err));

});

// view product api
router.get('/view_registration', async (req, res) => {
    try {
        const regdata = await reg.find({});
        res.render('dashboard/view_registration', { regdata: regdata });
    } catch (err) {
        console.log(err)
    }
})
// delete buttom
router.get("/delete_2/:id", async (req, res) => {
    try {
        const moviedata = await reg.findByIdAndDelete(req.params.id);
        res.redirect('/view_registration')
    } catch (err) {
        console.log(err);
    }
})
router.get('/edit_2/:id', async (req, res) => {
    try {
        const update = await reg.findById(req.params.id);
        res.render('dashboard/edit_regster', { update: update })
    } catch (err) {
        console.log(err)
    }
})
router.post('/edit_2/:id', async (req, res) => {
    const itemId = req.params.id
    let regster = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile
    };
    try {
        const upreg = await reg.findByIdAndUpdate(itemId, regster, { new: true });
        if (!upreg) {
            res.status(404).json({ message: 'Item not found' });
        }
        res.redirect('/view_registration')
    } catch (err) {
        res.status(500).json({ massage: 'server error' })
    }
})

// main index project end 1




// paratha
router.get('/paratha', (req, res) => {
    res.render('paratha');
})
router.get('/paratha-Add', (req, res) => {
    res.render('paratha-Add');
})
router.get('/paratha-payment1', (req, res) => {
    res.render('paratha-payment1');
})
// paratha end


// *********************************************************************dashboard secction 
router.get('/dashboard', async (req, res) => {
    try {
        if (req.session.user && req.cookies.user_sid) {
            res.render('dashboard/index');
        }
        else {
            res.redirect('/')
        }
    } catch (err) {
        console.log(err)
    }
})
router.get('/category', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('dashboard/category');
    }
    else {
        res.redirect('/')
    }

})

// *************************************************************** Food item 

router.get('/food_item', async (req, res) => {
    try{
        if((req.session.user && req.cookies.user_sid)) {

            res.render('dashboard/food_item')
        }else{
            res.redirect('/')
        }
    }catch(err) {
        console.log(err )
    }
})
router.post('/itemfood', upload.single('photo'),  (req,res) => {
    const foodsave = {
        name: req.body.name,
        photo: req.file.filename
    };
    const addfood = new foods(foodsave);
    addfood.save().then(() => 
        res.redirect('/view_item')
    ).catch((err) => res.status(400).json('not fond'))
})

router.get('/view_item', async (req,res) => {
    try {
        if((req.session.user && req.cookies.user_sid)){

            let  foodData = await foods.find({});
            res.render('dashboard/view_item', {foodData:foodData})
        }else {
            res.redirect('/')
        }
    }catch(err) {
        console.log(err)
    }
})
router.get('/delete_5/:id',async (req,res) => {
    try{

        const del = await foods.findByIdAndDelete(req.params.id);
        res.redirect('/view_item')
    }catch(err) {
        console.log(err)
    }
})
router.get('/edit_5/:id' , async (req,res) => {

    try {
        const editfood=  await foods.findById(req.params.id) 
        res.render('dashboard/edit_food-item' , {editfood:editfood})
    }catch(err) {
        console.log(err)
    }
})
router.post('/edit_5/:id' , async (req,res) => {
    itemId = req.params.id
    const foodedit = {
        name: req.body.name,
        photo:req.body.photo
    }
    try {
        const updatef = await foods.findByIdAndUpdate(itemId , foodedit , {new :true})
        if(!updatef) {
            res.status(400).json({massage:"not fond"})
        }
        res.redirect('/view_item')
    }catch(err) {
        res.status(400).json({massage:"server error"})

    }
})
// *************************************************************** Food item  end






//  **************************************************** special chaf's 
router.get('/chaf', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('dashboard/chaf')
    } else {
        res.redirect('/')
    }
})
router.post('/addchaf', upload.single('picture'), (req, res) => {
    const chafadd = {
        chafname: req.body.chafname,
        experience: req.body.experience,
        picture: req.file.filename
    };

    let chafsa = new chaf(chafadd);
    chafsa.save().then(() => res.json('chaf add succsefully'))
        .catch((err) => res.status(400).json("error" + err));
})
router.get('/view_chaf', async (req, res) => {
    try {
        if (req.session.user && req.cookies.user_sid) {
            const chafdata = await chaf.find({})
            res.render('dashboard/view_chaf', { chafdata: chafdata })
        } else {
            res.redirect('/')
        }
    } catch (err) {
        console.log(err)
    }

})
router.get('/delete_4/:id', async (req, res) => {
    try {
        let move = await chaf.findByIdAndDelete(req.params.id)
        res.redirect('/view_chaf')
    } catch (err) {
        console.log(err)
    }
})
router.get('/edit_4/:id', async (req, res) => {
    try {
        const edit = await chaf.findById(req.params.id)
        res.render('dashboard/edit_chaf', { edit: edit })
    } catch (err) {
        console.log(err)
    }
})
router.post('/edit_4/:id', async (req, res) => {
    itemId = req.params.id;
    const editadd = {
        chafname: req.body.chafname,
        experience: req.body.experience,
        picture: req.body.picture
    }

    try {
        const edita = await chaf.findByIdAndUpdate(itemId, editadd, { new: true });
        if (!edita) {
            res.status(400).json({ massage: 'not found' })
        }
        res.redirect('/view_chaf')
    } catch (err) {
        res.status(500).json({ massage: 'server error' })
    }
})


//  ************************************************** dashboard secction  end

router.get('/food/:id', async (req, res) => {
    try {
        const movidata = await movischema.findById(req.params.id);
        res.redirect('bookshow', { movidata: movidata })
    } catch (err) {
        console.log(err)
    }
})

//  2
router.get('/add-product', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('dashboard/add-product');
    } else {
        res.redirect('/')
    }
})
router.post('/addfood', upload.single('image'), (req, res) => {
    let addfood = {
        productName: req.body.productName,
        ProductPrice: req.body.ProductPrice,
        discount: req.body.discount,
        rating: req.body.rating,
        Country: req.body.Country,
        image: req.file.filename
    };

    let addpost = new add(addfood);
    addpost.save().then(() => res.json('register successfully'))
        .catch(err => res.status(404).json('error : ' + err));

});
// view product api
router.get('/view_product', async (req, res) => {
    try {
        if (req.session.user && req.cookies.user_sid) {
            const adddata = await add.find({});
            res.render('dashboard/view_product', { adddata: adddata });
        }
        else {
            res.redirect('/')
        }
    } catch (err) {
        console.log(err)
    }
})

// delete buttom

router.get("/delete/:id", async (req, res) => {
    try {
        const moviedata = await add.findByIdAndDelete(req.params.id);
        res.redirect('/view_product')
    } catch (err) {
        console.log(err);
    }
})

// edit

router.get("/edit/:id", async (req, res) => {
    try {
        const useredit = await add.findById(req.params.id);
        res.render("dashboard/edit_product", { useredit: useredit });
    } catch (err) {
        console.log(err)
    }
})
router.post('/edit/:id', async (req, res) => {
    const itemId = req.params.id;
    const updatedDate = {
        productName: req.body.productName,
        ProductPrice: req.body.ProductPrice,
        discount: req.body.discount,
        rating: req.body.rating,
        Country: req.body.Country,
        image: req.file.filename
    };
    try {
        const updatedItem = await add.findByIdAndUpdate(itemId, updatedDate, { new: true });

        if (!updatedItem) {
            res.status(404).json({ message: 'Item not found' });
        }
        res.redirect('/view_product')
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
});


// 2 end


// logout

router.get('/Logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie("user_sid");
        res.redirect('/')
    } else {
    }
})


module.exports = router