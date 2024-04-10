const express = require('express');
const multer = require('multer');
const userController = require('../controller/user');

const router = express.Router();

// Define storage configuration for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use original filename
    }
});

// Initialize Multer with storage configuration
const upload = multer({ storage: storage });

router.post('/profile-image/:id', upload.single('image'), userController.uploadUserImage);
router.post('/profile-image-update/:id', upload.single('image'),userController.updateProfilePicture);
router.get('/employee', userController.getAllUserEmployee);
router.get('/employer', userController.getAllUserEmployer);
router.get('/employee/:id', userController.getUserEmployee);
router.get('/employer/:id', userController.getUserEmployer);
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser);

module.exports = router;
