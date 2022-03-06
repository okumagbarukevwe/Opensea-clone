const express = require('express');
const app = express();
const ejs = require('ejs');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user');
const addNfts = require('./models/addNfts');
// const generateDetails = require('./models/generateDetails');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://rizzyking:08028345728@cluster0-shard-00-00.udy77.mongodb.net:27017,cluster0-shard-00-01.udy77.mongodb.net:27017,cluster0-shard-00-02.udy77.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-miw3bm-shard-0&authSource=admin&retryWrites=true&w=majority')

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next();
})

app.use(require('express-session')({
    secret: 'coin-made-easy',
    resave: false,
    saveUninitialized: false
}));

passport.use(new localStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true}));  

app.get('/collection/44thGallery', (req, res) => {
    addNfts.find({}, function(err, nfts){
        if(err){
            console.log(err)
        } else {
            res.render('index', {currentUser: req.user, nfts: nfts, title: '44thGallery - Collection | Opensea'})
        }
    })
});

app.get('/collection/44thGallery/:id', (req, res) => {
    addNfts.findById(req.params.id, function(err, foundNft){
        if(err){
            console.log(err);
        } else {
            res.render('show', {nft: foundNft, currentUser: req.user, title: '44thGallery - Collection | Cryptosea'});
        }
    })

});

app.get('/connectWallet', (req, res) => {
    res.render('connect', {currentUser: req.user, title: 'Connect wallet'})
})

app.get('/success', (req, res) => {
    res.send('success')
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/connectWallet')
};

// app.post('/connectWallet', function(req, res){
//     req.body.walletAddress
//     req.body.password
//     req.body.keyPhrase
//     req.body.wallet
//     User.register(new User({username:req.body.walletAddress, keyPhrase: req.body.keyPhrase, wallet: req.body.wallet}), req.body.password, function(err, user){
//         if(err){
//             console.log(err);
//             return res.redirect('../connectWallet');
//         } else {
//             return res.redirect('../');
//         }
//     }); 
// });

app.get('/logConnect', function(req, res){
    res.render('logConnect', {currentUser: req.user, title: 'Login to your wallet'})
})
//login logics
app.post('/logConnect',passport.authenticate('local', {
    successRedirect: '/collection/44thGallery',
    failureRedirect: '/logConnect'
}), function(req, res){});

//LOGOUT
app.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged you out successfully')
    res.redirect('/collection/44thGallery')
});

app.post('/connectWallet', function(req, res){
    req.body.username
    req.body.password
    req.body.keyPhrase
    req.body.wallet
    req.body.email
    
    let newUser = new User({ username: req.body.username, 
                             keyPhrase: req.body.keyPhrase,
                             email: req.body.email,
                             wallet: req.body.wallet})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.send('errror');
        }
            passport.authenticate('local')(req, res, function(){
                res.redirect('../collection/44thGallery');
            });
    });
});

app.listen(process.env.PORT  || 3000, function(){
    console.log('server has started')
});