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
    req.session.destroy();
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
router.get('/:id/followings',isLoggedIn, async (req,res,next)=>{
    try{
        const user = await db.User.findOne({
            where : { id: parseInt(req.params.id,10) || (req.user && req.user.id) || 0,},
            
        })
        const followers = await user.getFollowings({
            attributes : ['id','nickname'],
            limit : parseInt(req.query.limit,10),
            offset : parseInt(req.query.offset,10),
        })
        res.json(followers);
    }catch(e){
        console.error(e);
        next(e);
    }
})
router.get('/:id/followers',isLoggedIn,async (req,res,next)=>{
    try{
        const user = await db.User.findOne({
            where : { id: parseInt(req.params.id,10) || (req.user && req.user.id) || 0,},
            
        })
        const followers = await user.getFollowers({
            attributes : ['id','nickname'],
            limit : parseInt(req.query.limit,10),
            offset : parseInt(req.query.offset,10),
        })
        res.json(followers);
    }catch(e){
        console.error(e);
        next(e);
    }
})
router.delete('/:id/follower',isLoggedIn,async (req,res,next)=>{
    try{
        const me = await db.User.findOne({
            where : {id : req.user.id},
        })
        await me.removeFollower(req.params.id);
        res.send(req.params.id);
    }catch(e){
        console.error(e);
        next(e);
    }
})
router.post('/:id/follow',isLoggedIn,async (req,res,next)=>{
    try{
        const me = await db.User.findOne({
            where : { id : req.user.id},
        });
        await me.addFollowing(req.params.id);
        res.send(req.params.id);
    }catch(e){
        console.error(e);
        next(e);
    }
})
router.delete('/:id/follow',isLoggedIn,async (req,res,next)=>{
    try{
        const me = await db.User.findOne({
            where : {id :req.user.id},
        })
        await me.removeFollowing(req.params.id);
        res.send(req.params.id);
    }catch(e){
        console.error(e);
        next(e);
    }
})

router.get('/:id/posts',async (req,res,next)=>{
    try{
        let where ={};
        if(parseInt(req.query.lastId,10)){
            where = {
                id : {
                    [db.Sequelize.Op.lt] : parseInt(req.query.lastId,10)
                }
                
            }
        }
        const posts = await db.Post.findAll({
            where : {
                ...where,
                UserId : parseInt(req.params.id,10) || (req.user && req.user.id) || 0,
                RetweetId : null,
            },
            include :[{
                model : db.User,
                attribute : ['id','nickname'],
            },{
                model :db.Image,
            },{
                model :db.User,
                through : 'Like',
                as : 'Likers',
                attributes : ['id']
            }],
            limit : parseInt(req.query.limit,10),
        });
        res.json(posts);
    }catch(e){
        console.error(e);
        next(e);
    }
})
router.patch('/nickname',isLoggedIn,async(req,res,next)=>{
    try{
        await db.User.update({
            nickname : req.body.nickname,
        },{
            where : {id : req.user.id}
        })
        res.send(req.body.nickname)
    }catch(e){
        console.error(e);
        next(e);
    }
})
module.exports = router;