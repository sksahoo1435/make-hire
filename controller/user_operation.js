const users = require('../model/userSchema');

//filter by using workArea

exports.getUsersByFilter = async (req, res) => {

    try {
        const { workArea } = req.query;
        const pageSize = parseInt(req.query.pageSize);
        const page = parseInt(req.query.page);

        if (pageSize <= 0 || page <= 0) {
            return res.status(400).json({ message: 'Invalid page size or page number' });
        }

        if (!workArea) {
            return res.status(400).json({ message: 'Work area is required' });
        }

        const workAreaArray = Array.isArray(workArea) ? workArea : [workArea];

        const usersFiltered = await users.find({ role: 'employee', workArea: { $in: workAreaArray } });

        const usersFilteredwithPagination = await users.find({ role: 'employee', workArea: { $in: workAreaArray } })
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .exec();

        const totalusersFilter = usersFiltered.length;

        res.status(200).json({ users: usersFilteredwithPagination, total: totalusersFilter });
    } catch (error) {
        console.error('Error filtering users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

//get user by using user name

exports.getUsersBySearching = async (req, res) => {
    try {
        const { query } = req.query;
        const pageSize = parseInt(req.query.pageSize);
        const page = parseInt(req.query.page);

        if (pageSize <= 0 || page <= 0) {
            return res.status(400).json({ message: 'Invalid page size or page number' });
        }

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const total = await users.countDocuments({ role: 'employee', name: { $regex: new RegExp(query, 'i') } });

        const usersFoundWithPagination = await users.find({ role: 'employee', name: { $regex: new RegExp(query, 'i') } })
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .exec();

        res.status(200).json({ users: usersFoundWithPagination, totalPage: total });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//sort by using work experience
exports.getUsersBySorting = async (req, res) => {
    try {
        const sortBy = req.query.sortBy || 'workExperience';
        const sortOrder = req.query.sortOrder || 'asc';
        const pageSize = parseInt(req.query.pageSize);
        const page = parseInt(req.query.page);

        if (!['asc', 'desc'].includes(sortOrder)) {
            return res.status(400).json({ message: 'Invalid sort order. Use "asc" or "desc".' });
        }

        const total = await users.countDocuments({ role: 'employee' });

        const usersSorted = await users.find({ role: 'employee' }).sort({ [sortBy]: sortOrder }).skip(pageSize * (page - 1)).limit(pageSize).exec();

        res.status(200).json({ users: usersSorted, totalPage: total });
    } catch (error) {
        console.error('Error sorting users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}