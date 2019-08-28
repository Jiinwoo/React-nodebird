const express =require('express');
const db = require('../models')
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const {isLoggedIn} =require('./middleware');
//  api/user/
router.get('/',isLoggedIn,async (req,res)=>{
    
    const fullUser = await db.User.findOne({
        where:{
            id:req.user.id
        },
        include :[{
            model: db.Post,
            as:'Posts',
            attribute:['id'],
        },{
            model:db.User,
            as:'Followings',
            attribute:['id'],
        },{
            model:db.User,
            as:'Followers',
            attribute:['id'],
        }],
        attribute:['id','nickname','userId']
    })
    return res.json(fullUser);
});
router.post('/',async (req,res,next)=>{//회원가입 /api/user/
    try{
        const exUser = await db.User.findOne({
            where : {
                userId : req.body.userId,
            },
        })
        if(exUser){
            return res.status(403).send('이미 사용중인 아이디입니다.'); //  send는 문자열
        }
        const hashedPassword = await bcrypt.hash(req.body.password,12); //salt 는 10 ~13사이
        const newUser = await db.User.create({
            nickname: req.body.nickname,
            userId : req.body.userId,
            password : hashedPassword,
        });
        console.log(newUser);

        return res.status(200).json(newUser);// json 데이터를 보냄
    }catch(e){
        console.error(e);
        //  return res.status(403).send(e);
        return next(e);
    }
});
router.get('/:id',async (req,res,next)=>{ //남의 정보 가져오는 것 ex) /api/user/3
    try{
        
        const user = await db.User.findOne({
            where : {
                id : parseInt(req.params.id,10)
            },
            include :[{
                model : db.Post,
                as : 'Posts',
                attribute : ['id'],
            },{
                model : db.User,
                as : 'Followings',
                attribute : ['id'],
            },{
                model : db.User,
                as : 'Followers',
                attribute : ['id'],
            }],
            attributes : ['id','nickname'],
        });

        const jsonUser = user.toJSON();
        jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length  : 0;
        jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
        jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
        res.json(jsonUser);
    }catch(e){
        console.log(e);
        next(e);
    }
});
router.post('/logout',(req,res)=>{
    req.logout();
    req.session.destory();
    res.send('logout 성공');
});
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',(err,user,info)=>{
        
        if(err){
            console.log(err);
            return next(err);
        }
        if(info){
            return res.status(401).send(info.reason);
        }
        return req.login(user,async (loginErr)=>{
            if(loginErr){
                return next(loginErr);
            }
            const fullUser = await db.User.findOne({
                where : {id:user.id},
                include : [{
                    model: db.Post,
                    as:'Posts',
                    attribute:['id'],
                },{
                    model:db.User,
                    as:'Followings',
                    attribute:['id'],
                },{
                    model:db.User,
                    as:'Followers',
                    attribute:['id'],
                }],
                attribute:['id','nickname','userId'],
            });
            
            
            return res.json(fullUser);
        });
    })(req,res,next);
    
});
router.get('/:id/follow',(req,res)=>{

})
router.post('/:id/follow',(req,res)=>{
    
})
router.delete('/:id/follower',(req,res)=>{
    
})
router.get('/:id/posts',async (req,res,next)=>{
    try{
        const posts = await db.Post.findAll({
            where : {
                UserId : parseInt(req.params.id),
                RetweetId : null,
            },
            include :[{
                model : db.User,
                attribute : ['id','nickname'],
            },{
                model :db.Image,
            }],
        });
        res.json(posts);
    }catch(e){
        console.error(e);
        next(e);
    }
})

module.exports = router;