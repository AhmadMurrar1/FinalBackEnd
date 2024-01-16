import User from "../model/userSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function userRegister(req, res, next) {
    const { username, email, password } = req.body;
    try {
        // Check if required fields are missing
        if (!username || !email || !password) {
            res.status(400);
            throw new Error('Email, password and username required');
        }

        // Check if a user with the same username or email exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            res.status(409);
            throw new Error('A user with the same username or email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ email, password: hashedPassword, username,listOfGames: [] });
        res.status(201).send(newUser);
    } catch (error) {
        next(error);
    }
}



export async function userLogin(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(401);
            throw new Error('All fields are required');
        }

        const existingUser = await User.findOne({ username });

        if (!existingUser) {
            res.status(401);
            throw new Error('User not found.');
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password);

        if (comparePassword) {
            const token = jwt.sign({
                id: existingUser._id,
                username: existingUser.username,
                role: existingUser.role,
            },
            process.env.SECRET,
            {
                expiresIn: '15m',
            });

            // Set the token as an HTTP-only cookie
            res.cookie('authToken', token, { maxAge: 90000000, httpOnly: true });

            // Send the user ID along with the token in the response
            res.status(200).json({ token, userId: existingUser._id });
        } else {
            res.status(401);
            res.send('Username or password is incorrect.');
        }
    } catch (error) {
        next(error);
    }
}


export const userProfile = async (req, res, next) => {
    try {
        // Check if user data is attached to the request object (set by isAuth middleware)
        if (!req.user) {
            res.status(401);
            throw new Error('User not authenticated');
        }

        // Fetch user details from req.user
        const { _id, username, email, role } = req.user;

        // Send the user profile data as a response
        res.json({
            id: _id,
            username,
            email,
            role,
        });
    } catch (error) {
        next(error);
    }
};
// ----------------------------------------------------------------
export async function findAllUsers(req, res, next) {
    try {
        // Retrieve all users from the database
        const allUsers = await User.find();

        // Send the array of users as a response
        res.status(200).json(allUsers);
    } catch (error) {
        next(error);
    }
}


export async function findUserById(req, res, next) {
    const userId = req.params.id; 
    try {
        // Find a user by their ID in the database
        const user = await User.findById(userId);

        // Check if the user was not found
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Send the user object as a response
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}


export async function deleteUser(req, res, next) {
    const userId = req.params.id; 
    try {
        // Find the user by ID and delete
        const result = await User.deleteOne({ _id: userId });

        // Check if the user was not found
        if (result.deletedCount === 0) {
            res.status(404);
            throw new Error('User not found');
        }

        // Send a success message as a response
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
}


export async function updateUser(req, res, next) {
    const userId = req.params.id; 
    const { username, email, password,cash,credits,listOfGames } = req.body;
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user was not found
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        if(cash){
            user.cash = cash;
        }
        if(credits){
            user.credits=credits;
        }
        // Update user properties if provided in the request body
        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if(listOfGames) {
            user.listOfGames = listOfGames;
        }
        // Validate and save the updated user
        await user.validate();
        await user.save();

        // Send the updated user as a response
        res.status(200).json(user);
    } catch (error) {
        // Handle validation errors separately
        if (error.name === 'ValidationError') {
            res.status(400);
            next(new Error(error.message));
        } else {
            next(error);
        }
    }
}

export async function depositUser(req, res, next) {
    const userId = req.params.id; 
    const { amount } = req.body;
    
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user was not found
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Validate the deposit amount
        if (!amount || isNaN(amount) || amount <= 0) {
            res.status(400);
            throw new Error('Invalid deposit amount');
        }

        // Update the user's credits by depositing the specified amount
        user.credits += parseFloat(amount);
        
        // Validate and save the updated user
        await user.validate();
        await user.save();

        // Send the updated user as a response
        res.status(200).json(user);
    } catch (error) {
        // Handle validation errors separately
        if (error.name === 'ValidationError') {
            res.status(400);
            next(new Error(error.message));
        } else {
            next(error);
        }
    }
}

export const userLogout = (req, res) => {
    try {
      // Clear the authentication-related data (cookie, session, etc.)
      res.clearCookie('authToken'); // Clear the auth cookie
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout failed:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };