const express = require('express')
const mongoose = require('mongoose')
const expressSession = require('express-session');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')

//mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser:true})
mongoose.connect('mongodb+srv://asafDB:VAOQfdcah78CW5uV@cluster0.hsitn.mongodb.net/my_database?retryWrites=true&w=majority', {useNewUrlParser: true});
const app = new express()
const ejs = require('ejs')
app.set('view engine','ejs')
app.use(express.static('public'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSession({
    secret: 'keyboad cat'
}))


const fileUpload = require('express-fileupload')
app.use(fileUpload())

const validateMiddleWare = require("./middleware/validationMiddleware");
const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')
const flash = require('connect-flash');

app.listen(4000, ()=>{
    console.log('App listerning on port 4000')
})

global.loggedIn = null;

app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
});

app.use(flash());

app.use('/posts/store',validateMiddleWare) 
app.get('/', homeController)
app.get('/post/:id', getPostController)
app.post('/posts/store', authMiddleware, storePostController)
app.get('/posts/new', authMiddleware, newPostController)
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/auth/logout', logoutController)
app.use((req,res) =>res.render('notfound'));