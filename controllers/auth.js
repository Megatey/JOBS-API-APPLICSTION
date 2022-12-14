const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')



const register = async (req, res) => {
    try {
        const user = await User.create({...req.body})
        const token = await user.createJwT()
        res.status(StatusCodes.CREATED).json({status: 'Success', username: user.name, token})
    } catch (error) {
        console.log(error, 'something occured')
        res.status(StatusCodes.BAD_REQUEST).json({msg: 'Internal Error'})
    }
}


const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json('Please Provide email and password')
        return;
    }

    const user = await User.findOne({email})
    if(!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({error: true, msg: 'Invalid Credentials'})
        return;
    }
    
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        res.status(StatusCodes.UNAUTHORIZED).json({error: true, msg: 'Invalid Credentials'})
        return;
    }
    const token = await user.createJwT()
    res.status(StatusCodes.OK).json({status: 'Success', username: user.name, token})
}

module.exports = {register, login}