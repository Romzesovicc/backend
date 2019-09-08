import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mailer.user, // generated ethereal user
    pass: config.mailer.pass, // generated ethereal password
  }
});

export const sendEmail = (data = { from: '', name: '', text: '', subject: '' }) => {
  return transporter.sendMail({
    from: `"${data.name} 👻" <${config.mailer.user}>`, // sender address
    to: config.mailer.user, // list of receivers
    subject: data.subject, // Subject line
    text: `
      От: ${data.from},
      ${data.text}
    `, // plain text body
  });
};