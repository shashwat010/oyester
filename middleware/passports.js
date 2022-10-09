const User = require('../models/User');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports =async function(passport){
    passport.use(
        new JwtStrategy(
            {
                secretOrKey:"shashwat!",
                jwtFromRequest : ExtractJwt.fromHeader('authorization')
            },
            async function(jwt_payload,next){
                try{
                    let user = await User.findOne({email:jwt_payload.user.email});
                    if(user){ 
                        return next(null,user);
                    }
                    else{
                        return next(null,false);
                    }
                }
                catch(error){
                    return next(error,false);
                }  
            }
        )
    )
}