const User = require('../models/user');
const File = require('../models/file');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Right = require('../models/userRights');

const uploadProfile = async (req, res, next) => {
    try {   
        const uploadedFile = req.file;
        console.log(uploadedFile);
        const { v4: uuidv4 } = require('uuid');
        const randomId = uuidv4();
        const file = new File({
            fileName: uploadedFile.filename,
            size: uploadedFile.size,
            mime: uploadedFile.mimetype
        });
        await file.save();
        res.json({
            message: 'File uploaded successfully',
            file: {
                filename: uploadedFile.filename,
                size: uploadedFile.size,
                mimetype: uploadedFile.mimetype
            }
        });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllUsers = async (req, res) => {
    await User.find().
        then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log('--error--');
            console.log(err);
        });
};

const getSingleUser = async (req, res) => {
    await User.findById(req.params.id).
        then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log(err);
        });
};

const deleteSingleUser = async (req, res) => {
    var id = req.params.id;
    await User.findByIdAndDelete(id).
        then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log(err);
        });
};

const createUser = async (req, res) => {

    const user = new User(req.body);
    await user.save().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, req.body).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
};

const getAllFiles = async (req, res) => {
    await File.find().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
};

const register = async (req, res) => {
    try {
        const { name, age, gender, password } = req.body;
        const existingUser = await User.findOne({ name: name });
        if (existingUser) {
            return res.status(400).json({ message: 'user with this name already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            name: name,
            age: age,
            gender: gender,
            password: hashedPassword
        });

        const token = jwt.sign({ name: result.name, id: result._id }, 'thisissecretkey');
        res.status(201).json({ user: result, token: token });

    } catch
    (error) {
        res.status(500).json({ message: "Internal server error..." });
    }
}

const login = async (req, res) => {

    try {
        const { name, password } = req.body;
        const existingUser = await User.findOne({ name: name });
        if (!existingUser) {
            return res.status(404).json({ message: 'user with this name not exists' });
        }
        const matchingPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchingPassword) {
            return res.status(400).json({ message: 'user or password incorrect' });
        }
        const userWithoutPassword = {
            _id: existingUser._id,
            name: existingUser.name,
            age: existingUser.age,
            gender: existingUser.gender
        };
        const token = await jwt.sign({ name: existingUser.name, id: existingUser._id }, 'thisissecretkey');
        res.status(200).json({
            user: userWithoutPassword,
            message: "Login successfully",
            token: token
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error..." });
    }
};

const creatUserRight = async (req, res) => {

    try {
        const { name, user_id } = req.body;
        const result = await Right.create({
            name: name,
            user_id: user_id
        });
        res.status(201).json({ user: result });

    } catch
    (error) {
        res.status(500).json({ message: "Internal server error..." });
    }
};

const getUsersRight = async (req, res) => {
    try {

        const rights = await Right.find()
            .populate({ path: 'user_id', select: 'name' })
            .exec();
        res.send(rights);

    } catch (e) { console.log(e); }

};

module.exports = {
    getSingleUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteSingleUser,
    uploadProfile,
    getAllFiles,
    register,
    login,
    creatUserRight,
    getUsersRight
}