let nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER || "your_mailtrap_user",
        pass: process.env.MAILTRAP_PASS || "your_mailtrap_pass",
    },
});
module.exports = {
    sendMail: async function (to, url) {
        await transporter.sendMail({
            from: '"admin@" <admin@nnptud.com>',
            to: to,
            subject: "mail reset passwrod",
            text: "lick vo day de doi passs",
            html: "lick vo <a href=" + url + ">day</a> de doi passs",
        });
    },
    sendPasswordMail: async function (to, username, password) {
        await transporter.sendMail({
            from: '"admin@" <admin@nnptud.com>',
            to: to,
            subject: "Tài khoản của bạn đã được tạo",
            text: `Tài khoản của bạn đã được tạo.\nUsername: ${username}\nPassword: ${password}\nVui lòng đăng nhập và đổi password ngay.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #2c3e50; text-align: center;">Tài khoản của bạn đã được tạo</h2>
                    <p>Xin chào <strong>${username}</strong>,</p>
                    <p>Tài khoản của bạn đã được tạo thành công. Dưới đây là thông tin đăng nhập của bạn:</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Username</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${username}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Password</td>
                            <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace; background: #f9f9f9;">${password}</td>
                        </tr>
                    </table>
                    <p style="color: #e74c3c; font-weight: bold;">Vui lòng đăng nhập và đổi password ngay lập tức!</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #7f8c8d; font-size: 12px; text-align: center;">Email được gửi tự động từ hệ thống NNPTUD. Vui lòng không reply email này.</p>
                </div>
            `,
        });
    }
}