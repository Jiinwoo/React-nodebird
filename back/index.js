const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession =require('express-session');
const dotenv = require('dotenv');
const passport =require('passport');

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();


app.use(morgan('dev'));
app.use('/',express.static('uploads'));
app.use(express.json());//  json형식의 본문 처리
app.use(express.urlencoded({extended:true}));// form 데이터 처리
app.use(cors({
    origin:true,
    credentials:true,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie : {
        httpOnly:true,
        secure :false,  //https 를 쓸 때 true
    },
    name:'rnbck'
}));
app.use(passport.initialize());
app.use(passport.session());//expressSession보다 밑에 있어야함 위의 세션을 사용함

app.use('/api/user',userAPIRouter);
app.use('/api/post',postAPIRouter);
app.use('/api/posts',postsAPIRouter);
app.use('/api/hashtag',hashtagAPIRouter);


app.listen(8080,()=>{
    console.log('server is running on localhost :8080');
})