const users = require('../model/userSchema');

// this create user now not required due to i make it in the time of signup

// exports.createUser = async (req, res) => {

//     try {
//         const { name, role, email, password } = req.body;
//         const existedUser = await users.findOne({ email });

//         if (existedUser) {
//             return res.status(400).json({ message: 'User with this email already exists' });
//         }
//         const newUser = new users({
//             name,
//             role,
//             email,
//             password
//         })

//         // Save the user to the database
//         await newUser.save();
//         res.status(201).json({ message: 'User Created successfully', user: newUser });

//     } catch (err) {
//         console.error('Error creating user:', err);
//         res.status(500).json({ message: 'Internal server error' });
//     }


// }

//http://localhost:8080/user/employee?pageSize=2&page=1

exports.getAllUserEmployee = async (req, res) => {

    try {
        const pageSize = parseInt(req.query.pageSize);
        const page = parseInt(req.query.page);

        if (pageSize <= 0 || page <= 0) {
            return res.status(400).json({ message: 'Invalid page size or page number' });
        }

        const allUser = await users.find({ role: 'employee' })
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .exec();

        const totalUser = await users.countDocuments({ role: 'employee' });

        res.status(200).json({ users: allUser, total: totalUser });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.getAllUserEmployer = async (req, res) => {

    try {
        const pageSize = parseInt(req.query.pageSize);
        const page = parseInt(req.query.page);

        if (pageSize <= 0 || page <= 0) {
            return res.status(400).json({ message: 'Invalid page size or page number' });
        }

        const allUser = await users.find({ role: 'employer' })
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .exec();

        const totalUser = await users.countDocuments({ role: 'employer' });

        res.status(200).json({ users: allUser, total: totalUser });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getUserEmployee = async (req, res) => {
    try {
        let id = req.params.id
        const user = await users.findOne({ _id: id, role: 'employee' });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.getUserEmployer = async (req, res) => {
    try {
        let id = req.params.id
        const user = await users.findOne({ _id: id, role: 'employer' });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await users.findOneAndDelete({ _id: id });

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(202).json({ message: 'User deleted successfully', user: result });

    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const doc = await users.findOneAndUpdate({ _id: id }, req.body, { new: true })
        res.status(202).json({ message: 'Updated successfully', user: doc });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.uploadUserImage = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file; // Access uploaded file information
        
        if (!file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Update user's profile image path in the database
        const updatedUser = await users.findOneAndUpdate(
            { _id: id },
            { image: file.path }, // Assuming 'file.path' contains the path to the uploaded image
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User image updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.updateProfilePicture = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;
    
        if (!file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const updatedUser = await users.findOneAndUpdate(
            { _id: id },
            { image: file.path },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile picture updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};