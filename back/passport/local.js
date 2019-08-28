const passport = require('passport');
const {Strategy:LocalStrategy}  =require('passport-local');
const bcrypt = require('bcrypt')
const db = require('../models')


module.exports = ()=>{
    passport.use(new LocalStrategy({
        usernameField:'userId',//프론트에서 req.body에 넣어주는, 필드명, 속성명임
        passwordField:'password',
    },async (userId,password,done)=>{
        try{
            const user =await db.User.findOne({
                where : {userId}
            })
            if(!user){//    done의 첫번째인자 (서버에러)두번째인자( 성공인수)세번째 인자(로직상에서 에러);
                return done(null,false,{reason:'존재하지 않는 사용자입니다!'});//  
            }
            const result =await bcrypt.compare(password,user.password);
            if(result){
                return done(null,user);
            }else{
                return done(null,false,{reason:'비밀번호가 틀립니다'});
            }
        }catch(e){
            console.error(e);
        }
    }))
    
}