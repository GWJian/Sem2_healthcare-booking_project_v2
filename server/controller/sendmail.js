const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { GMAIL_EMAIL, GMAIL_PASSWORD } = process.env;

/** send mail with tesing account */
const signup = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let message = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(200).json({
        message: "Signup successfull",
        info: info,
        previewUrl: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((err) => {
      return res.status(400).json("Error: " + err);
    });

  //   res.status(200).json("Signup successfull");
};

/** send mail with real gmail account */
const getbill = (req, res) => {
  const { userEmail } = req.body;

  let config = {
    host: "smtp.gmail.com",
    auth: {
      user: GMAIL_EMAIL,
      pass: GMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "E-Healthcare",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      name: "John Appleseed", //customer name
      intro: "Your bill is generated", //intro
      table: {
        data: [
          {
            item: "Medicine",
            description: "Painkiller",
            price: "$9.99",
          },
          {
            item: "Doctor Fee",
            description: "Consultation",
            price: "$39.99",
          },
        ],
      },
      outro: "Thank you for using our service",
    },
  };

  let mail = mailGenerator.generate(response);

  let message = {
    from: GMAIL_EMAIL, // sender address
    to: userEmail, // customer email
    subject: "Your Bill", // Subject line
    html: mail, // html body
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json({
        message: "receive email",
      });
    })
    .catch((err) => {
      return res.status(400).json({ err });
    });
};

/** send mail with real gmail account*/
// check backend status,if

module.exports = {
  signup,
  getbill,
};

//https://www.youtube.com/watch?v=lBRnLXwjLw0&ab_channel=DailyTuition
