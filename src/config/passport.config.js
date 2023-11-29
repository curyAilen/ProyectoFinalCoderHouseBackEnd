import passport from "passport";
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/users.models.js';


const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.0da512594bd7c0ae',
            clientSecret: '2b3ab89959b7d510303e5a54cb3b9c03760b5d14',
            callbackURL: 'http://localhost:8080/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)

            try {
                const user = await userModel.findOne({email: profile._json.email})
                if(user) {
                    console.log('Usuario existente')
                    return done(null, user)
                }

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: '',
                }
                const result = await userModel.create(newUser)

                return done(null, result)
            } catch (error) {
                return done('Error al loguearse' + error)
            }
        }
    ))
    
  

     passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport

