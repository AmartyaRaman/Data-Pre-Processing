import { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../dbConnection.ts'
import { users } from '../models/user.model.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Hash function for password
const hashPassword = async (password: string, salt: number) => {
  return await bcrypt.hash(password, salt);
}

// Register a user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      const error: any = new Error('User with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password, 10);
    
    // Create the user
    const [newUser] = await db.insert(users).values({name, email, password: hashedPassword}).returning({
      name: users.name,
      email: users.email
    })

    const token = jwt.sign(newUser, process.env.JWT_SECRET);
    res.cookie('token', token).status(202).json({message: "Successfully Registered the User", user: newUser});    
    
  } catch (error) {
    console.log("Error in register function in auth controller", error);
    next(error);
  }
}

// Login a user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {  

    // Extract the credentials
    const { email, password } = req.body;

    // Verify 
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1); 

    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error: any = new Error('Password does not match');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(user, process.env.JWT_SECRET);
    res.cookie('token', token).status(202).json({message: "Successfully Logged In User", user: {
      name: user.name,
      email: user.email
    }});

  } catch (error) {
    console.log("Error in login function in auth controller", error);
    next(error);
  }
}

// Logout a user
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token').status(200).json({message: "Successfully Logged Out User"});
  } catch (error) {
    console.log("Error in logout function in auth controller", error);
    next(error);
  }
}