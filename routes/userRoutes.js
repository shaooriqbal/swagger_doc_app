const express = require('express');
const controller = require('../controllers/userController');
const router = express.Router();
const multer = require('multer');
const auth = require('../middlewares/auth');
const { registerValidator, loginValidator } = require('../validators/userValidators');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

/**
 * @swagger
 * /allUsers:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all app users.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of all app users
 *         content:
 *           application/json:
 *             example:
 *               message: Success
 *               data: 
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: 123456
 *                       username:
 *                         type: string
 *                         example: john_doe
 *       401:
 *         description: Unauthorized
 */
 
router.get('/allUsers', auth, controller.getAllUsers);

/**
 * @swagger
 * /aUser/:id:
 *   get:
 *     summary: Get a specific user
 *     description: Return a app user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a app user
 *         content:
 *           application/json:
 *             example:
 *               message: Success
 *               data: 
 *                   type: Object
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: 123456
 *                       username:
 *                         type: string
 *                         example: john_doe
 *       401:
 *         description: Unauthorized
 */
router.get('/aUser/:id', auth, controller.getSingleUser);
/**
 * @swagger
 * /deleteAuser/:id:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a app user using its Id.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/deleteAuser/:id', auth, controller.deleteSingleUser);
/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Create a new user
 *     description: Endpoint to create a new user in the app.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User created successfully
 *               data: createdUserData
 *       400:
 *         description: Invalid data entered
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid data entered
 *       401:
 *         description: Unauthorized
 */
router.post('/createUser', auth, controller.createUser);
/**
 * @swagger
 * /updateUser/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Endpoint to update a user's information by ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: updated_john_doe
 *               email:
 *                 type: string
 *                 example: updated_john@example.com
 *             required:
 *               - username
 *               - email
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User updated successfully
 *               data: updatedUserData
 *       400:
 *         description: Invalid data entered
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid data entered
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 */
router.put('/updateUser/:id', auth, controller.updateUser);

router.post('/uploadProfile', auth, upload.single('profile'), controller.uploadProfile);

router.get('/allFiles', auth, controller.getAllFiles);

router.post('/register', registerValidator, controller.register);

router.post('/login', loginValidator, controller.login);

router.post('/userRight', auth, controller.creatUserRight);

router.get('/getRights', auth, controller.getUsersRight);

module.exports = router;
