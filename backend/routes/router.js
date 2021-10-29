import express from "express";
// import jwt from "jsonwebtoken";
import { UrlShortRegister } from "./model/register.js";
import { UrlModel } from "./model/urlmodel.js";
import bcrypt from "bcrypt";
import sendgridTransport from "nodemailer-sendgrid-transport";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        // process.env.api_key
        api_key: process.env.key
    }
}));

router.get("/n", (req, res) =>
{
    res.send("Node Started");
});

router.get("/", async (req, res) =>
{
    await UrlModel.find()
        .then((re) => res.send(re))
        .catch((err) => res.send(err))
});


router.post("/signin", async (req, res) =>
{
    try
    {
        const { email, password } = req.body;
        if (!email || !password)
        {
            res.status(400).json({ message: "All Feild Required" });
        };

        const userlogin = await UrlShortRegister.findOne({ email: email });
        if (userlogin)
        {
            const isMatch = await bcrypt.compare(password, userlogin.password)
            if (!isMatch)
            {
                return res.status(400).json({ message: "Invalid Credentials" });
            } else if (isMatch)
            {
                console.log(email, password)
                return res.status(200).json({ message: "Login Successfully" })
            }
        }
        else
        {
            res.status(400).json({ message: "User Not exist" })
        }
    } catch (error)
    {
        // return 
        return res.status(400).json({ message: "Something went Wrong" })
    }


});

router.post("/signup", async (req, res) =>
{
    try
    {
        const { username, email, password } = req.body;
        console.log(email)
        const salt = await bcrypt.genSalt(12);
        if (!username || !email || !password) return res.status(400).json({ message: "All Feild Required" });
        const UserExist = await UrlShortRegister.findOne({ email });
        if (UserExist) return res.status(400).json({ message: "User Already Present" });
        const hashpassword = await bcrypt.hash(password, salt);
        const User = new UrlShortRegister({
            username,
            email,
            password: hashpassword,
        })
        await User.save()
            .then((res) => res.json({ mesaage: "Register Success" }))
            .catch((err) => res.json({ mesaage: err.message }));
    } catch (error)
    {
        res.status(400).json({ message: "Something went Wrong" });
    }
});

router.post("/resetpassword", async (req, res) =>
{
    const { email } = req.body;
    console.log(email)
    crypto.randomBytes(32, (err, buffer) =>
    {
        if (err)
        {
            console.log(err);
        }
        const token = buffer.toString("hex");
        UrlShortRegister.findOne({ email: req.body.email })
            .then(user =>
            {
                if (!user)
                {
                    return res.status(422).json({ message: "User doesn't exist with this email" });
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) =>
                {
                    transporter.sendMail({
                        to: user.email,
                        from: "resetpass233@gmail.com",
                        subject: "Password Reset",
                        html: `<p>You requested to Password Reset</p>
                                <h2>Click on this <a href="https://urls-shorteners.herokuapp.com/reset/${token}">link</a> to Reset Password</h2>`
                    })
                    res.json({ message: "Check Your Email" });
                });
            });
    });
    console.log(email);
});

router.post("/newpassword", async (req, res) =>
{
    const { newPassword, token } = req.body;
    const sentToken = token;
    // console.log("139", newPassword, sentToken);
    UrlModel.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user =>
        {
            if (!user)
            {
                return res.status(400).json({ error: "Token Expired" });
            }
            bcrypt.hash(newPassword, 12)
                .then(hashPassword =>
                {
                    user.password = hashPassword
                    user.resetToken = undefined
                    user.expireToken = undefined
                    user.save().then((saveduser) =>
                    {
                        res.json({ message: "Password Updated SuccessFully" })
                    });
                });
        }).catch((error) => console.log(error.message));
});

router.post("/shortUrl", async (req, res) =>
{
    try
    {
        const { text } = req.body;
        console.log(text);
        const urlExist = await UrlModel.findOne({ text });
        // if (urlExist) return res.status(400).json({ message: "Url Already Exist" });
        if (!text || (text === null)) return res.status(400).json({ message: "Please Enter text" });
        const userUrl = new UrlModel({
            LongUrl: text,
            // ShortUrl: `http://localhost:3000/${shortId.generate()}`
        })
        userUrl.save()


    } catch (error)
    {
        console.log(error)
    }
});


export const route = router;