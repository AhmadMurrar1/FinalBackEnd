import jwt from 'jsonwebtoken';
import User from '../model/userSchema.js';
import "dotenv/config.js"
// check if the user is authenticated

export const isAuth = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.Authorization || req.headers.authorization;

        if (authHeader) {
            token = authHeader.split(' ')[1];
            console.log(`Token received: ${token}`);

            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    console.error(`Error verifying token: ${err.message}`);
                    return res.status(401).send('Unauthorized');
                }

                console.log(`Decoded token: ${JSON.stringify(decoded)}`);
                const { id } = decoded;

                User.findById(id)
                    .then(user => {
                        if (!user) {
                            console.error(`User not found with ID: ${id}`);
                            return res.status(404).send('User not found');
                        }

                        req.user = user;
                        next();
                    })
                    .catch(err => {
                        console.error(`Error finding user by ID: ${err.message}`);
                        return res.status(500).send('Internal Server Error');
                    });
            });
        } else {
            next();
        }
    } catch (error) {
        console.error(`Error in isAuth middleware: ${error.message}`);
        next(error);
    }
};

// ...

export const isAdmin =async (req,res,next)=>{
    try {
        const role = req.user?.role;
        if(role !== 'admin'){
            return res.status(403).send("You don't have permission")
        }
        next()
    } catch (error) {
        next(error)
    }
}