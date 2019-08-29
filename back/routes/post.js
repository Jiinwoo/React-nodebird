const express = require('express')
const router = express.Router();
const db = require('../models');
const multer = require('multer');
const path =require('path');
const {isLoggedIn} =require('./middleware');

const upload = multer({
    storage : multer.diskStorage({
        destination(req,file,done){
            done(null,'uploads');
        },
        filename(req,file,done){
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname,ext); //정진우.png ext===.png ,basename===정진우
            done(null,basename+ new Date().valueOf()+ext);
        }
    }),
    limits : {fileSize :20 * 1024 * 1024},
}); 
router.post('/',upload.none(),isLoggedIn,async (req,res,next)=>{
    try{
        const hashtags = req.body.content.match(/#[^\s]+/g);
        const newPost = await db.Post.create({
            content : req.body.content,//   ex) 안녕하세요 #구독 #좋아요
            UserId: req.user.id,
        });
        if(hashtags){
            const result = await Promise.all(hashtags.map(tag=>db.Hashtag.findOrCreate({//   없으면 넣고 있으면 아무거도안함
                where:{content:tag.slice(1).toLowerCase()}
                })));
                console.log(result);
            await newPost.addHashtags(result.map(r=>r[0]));
        }
        if(req.body.image){//   이미지 주소를 여러개 올리면 image :[주소1,주소2]
            if(Array.isArray(req.body.image)){
                const images = await Promise.all(req.body.image.map((image)=>{
                    return db.Image.create({src:image});
                }));
                await newPost.addImages(images);
            }else{//    이미지 한개면 image :
                const image = await db.Image.create({ src:req.body.image});
                await newPost.addImage(image);
            }
        }
        //const User =await newPost.getUser();
        //newPost.User = User;
        //res.json(newPost);
        const fullPost = await db.Post.findOne({
            where: {id:newPost.id},
            include :[{
                model:db.User,
            },{
                model :db.Image,
            }],
        });
        console.log(fullPost.toJSON());
        return res.json(fullPost.toJSON());
    }catch(e){
        console.error(e);
        next(e);
    }
})
router.post('/images',upload.array('image'),(req,res)=>{
    console.log(req.files);
    res.json(req.files.map(v=>v.filename));
})
router.get('/:id/comments',async (req,res,next)=>{
    try{
        const post = await db.Post.findOne({ where : {id : req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const comments = await db.Comment.findAll({
            where  : {
                postId : req.params.id,
            },
            order : [['createdAt','ASC']],
            include : [{
                model : db.User,
                attributes : ['id','nickname'],
            }],
        });
        return res.json(comments);
    }catch(e){
        console.error(e);
        return next(e);
    }
})
router.post('/:id/comment',isLoggedIn,async (req,res,next)=>{
    try{
        
        const post = await db.Post.findOne({where : {id : req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const newComment = await db.Comment.create({
            PostId : post.id,
            UserId : req.user.id,
            content : req.body.content,
        });
        await post.addComment(newComment.id);
        const comment = await db.Comment.findOne({
            where : {
                id : newComment.id,
            },
            include : [{
                model : db.User,
                attributes : ['id','nickname'],
            }],
        });
        return res.json(comment);
    }catch(e){
        console.error(e);
        return next(e);
    }
})

router.post('/:id/like',isLoggedIn,async(req,res,next)=>{
    try{
        
        const post = await db.Post.findOne({
            where : {
                id : req.params.id
            }
        });
        
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.addLiker(req.user.id);
        
        res.json({userId : req.user.id})
    }catch(e){
        console.error(e);
        next(e);
    }
});
 
router.delete('/:id/like',isLoggedIn,async(req,res,next)=>{
    try{
        const post = await db.Post.findOne({
            where : {
                id : req.params.id
            }
        });
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.removeLiker(req.user.id);
        
        res.json({userId : req.user.id})
    }catch(e){
        console.error(e);
        next(e);
    }
})

router.post('/:id/retweet',isLoggedIn ,async(req,res,next)=>{
    try{
        const post = await db.Post.findOne({
            where : {id : req.params.id},
            include :[{
                model : db.Post,
                as : 'Retweet',
            }]
        });
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        if(req.user.id === post.UserId || post.Retweet && post.Retweet.UserId ===req.user.id){
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await db.Post.findOne({
            where : {
                UserId : req.user.id,
                RetweetId : retweetTargetId,
            }
        })
        if(exPost){
            return res.status(403).send('이미 리트윗 했습니다.');
        }
        const retweet = await db.Post.create({
            UserId : req.user.id,
            RetweetId : retweetTargetId,
            content : 'retweet',
        })
        const retweetWithPrevPost = await db.Post.findOne({
            where : { id :retweet.id},
            include : [{
                model : db.User, 
                attributes : ['id','nickname']
            },{
                model : db.Post,
                as : 'Retweet',
                include :[{
                    model : db.User,
                    attributes : ['id','nickname']
                },{
                    model : db.Image,
                }]
            }]
        })
        res.json(retweetWithPrevPost);
    }catch(e){
        console.error(e);
    }
})
module.exports = router;