const express = require('express');
const bodyParser = require('body-parser');
const express_handlbars = require('express-handlebars');
const path = require('path')
const nodemailer = require('nodemailer');

// instantiate Express App
const app = express();

// View Engine Setup
app.engine('handlebars', express_handlbars());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Set Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')))

// respond to GET Route Site Root
app.get('/', (req, res)=>{
    res.render('contact')
})

// Post Route Upon Submition
app.post('/send', (req, res)=>{
    const email = `
        <h4>New Email from Customer!</h4>
        <h6>Contact Details</h6>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Subject: ${req.body.subject}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <h6>Message</h6>
        <p>${req.body.message}</p>
    `;

    // 1 .  Nodemailer instatiation
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'kudzmurefu@gmail.com',
               pass: 'computer999'
           }
    });

    // 2. Email Config
    const mailOptions = {
        from: 'kudzmurefu@email.com', // sender address
        to: req.body.email, // list of receivers
        subject: req.body.subject, // Subject line
        html: email// plain text body
    };

    // 3. Send Email
    transporter.sendMail(mailOptions, function (err, info) {
        if(err){
            console.log(err)
        }
        else{
            const f_name = req.body.name.split(" ")[0]
            res.render(`success`, {firstname: f_name})
            console.log(info);
        }
    });


})

// Listen on Port 3000
app.listen(3000, ()=>{
    console.log("Email server Started...")
})