import passport from "passport";
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/users.models.js';

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy

const extractCookie = req => {
    return (req && req.cookies) ? req.cookies['cookieJWT'] : null
}

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
    
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { name, email } = req.body

        try {
            const user = await UserModel.findOne({ email })
            if (user) {
                console.log('User already exists')
                return done(null, false)
            }

            const newUser = {
                name,
                email,
                password: createHash(password),
                role: 'user',
                social: 'local'
            }
            const result = await UserModel.create(newUser)
            return done(null, result)

        } catch (error) {
            return done('[LOCAL] Error to register ' + error)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                console.log('User doesnt exist')
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch (error) {
            return done('[LOCAL] error to login ' + error)
        }
    })
    )
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: 'secretForJWT',
    }, (jwt_payload, done) => {
        console.log({ jwt_payload })
        done(null, jwt_payload.user)
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport

