const express =require('express');
const db = require('../models');

const router =express.Router();

router.get('/:tag',async (req,res,next)=>{
    try{
        const posts = await db.Post.findAll({
            include : [{
                model : db.Hashtag,
                where : {content : decodeURIComponent(req.params.tag)},
            },{
                model : db.User,
                
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

module.exports  = router