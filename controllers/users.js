let userModel = require('../schemas/users')
let bcrypt = require('bcrypt')
let ExcelJS = require('exceljs')
let mailHandler = require('../utils/sendMailHandler')

function generateRandomPassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
module.exports = {
    CreateAnUser: async function (username, password, email, role, session,
        avatarUrl, fullName, status, loginCount
    ) {
        let newUser = new userModel({
            username: username,
            password: password,
            email: email,
            role: role,
            avatarUrl: avatarUrl,
            fullName: fullName,
            status: status,
            loginCount: loginCount
        })
        await newUser.save({session});
        return newUser;
    },
    QueryByUserNameAndPassword: async function (username, password) {
        let getUser = await userModel.findOne({ username: username });
        if (!getUser) {
            return false;
        }
        if (bcrypt.compareSync(password, getUser.password)) {
            return getUser;
        }
        return false;

    },
    FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted: false
        }).populate('role')
    }, FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted: false
        }).populate('role')
    },
    FindUserByEmail: async function (email) {
        return await userModel.findOne({
            email: email,
            isDeleted: false
        })
    },
    FindUserByToken: async function (token) {
        let user = await userModel.findOne({
            forgotpasswordToken: token,
            isDeleted: false
        })
        if (!user || user.forgotpasswordTokenExp < Date.now()) {
            return false
        }
        return user
    },

    importUsers: async function (filePath, roleId) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        const results = {
            success: [],
            failed: []
        };

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const username = row.getCell(1).value;
            const email = row.getCell(2).value;
            if (username && email) {
                rows.push({ username, email, rowNumber });
            }
        });

        for (const { username, email, rowNumber } of rows) {
            try {
                const existingUser = await userModel.findOne({
                    $or: [{ username }, { email }],
                    isDeleted: false
                });
                if (existingUser) {
                    results.failed.push({
                        row: rowNumber,
                        username,
                        email,
                        error: 'Username hoặc email đã tồn tại'
                    });
                    continue;
                }

                const password = generateRandomPassword(16);
                let newUser = new userModel({
                    username: username,
                    password: password,
                    email: email,
                    role: roleId,
                    status: true
                });
                await newUser.save();

                await mailHandler.sendPasswordMail(email, username, password);

                results.success.push({ row: rowNumber, username, email, password });
            } catch (err) {
                results.failed.push({
                    row: rowNumber,
                    username,
                    email,
                    error: err.message
                });
            }
        }

        return results;
    }
}