import nodemailer from "nodemailer"



const sendEmail = async (to, subject, html, attachments = []) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.pass
        }
    })
    const mailOptions = await transporter.sendMail({
        from: `"Dola"<${process.env.email}>`,
        to: to,
        subject: subject,
        html: html,
        attachments
    })

    return true

}

export default sendEmail