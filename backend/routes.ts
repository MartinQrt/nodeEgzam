import express from "express";
import jwt from "jsonwebtoken";

import { AccountsModel } from "./models/accounts";
import { BillsModel } from "./models/bills";
import { GroupModel, GroupsModel } from "./models/groups";

import { UserModel } from "./models/users";
import { isLoggedIn } from "./utils/isLoggedin";
import { comparePassword, hashPassword } from "./utils/passwordUtils";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, fullName } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || typeof fullName !== 'string') {
        return res.status(400).send({ error: "Bad request" }).end();
    }

    if (!email || !password || !fullName) {
        return res.status(400).send('Required fields are missing').end();
    }

    const hashedPass = await hashPassword(password);

    const existingUser = await UserModel.findOne({email});

    if (existingUser) {
        return res.status(400).send('User already exists').end();
    }

    const user = new UserModel({
        email,
        password: hashedPass,
        full_name: fullName,
        reg_timestamp: new Date().getTime()
    });

    const savedUser = await user.save();

    const response = {
        email: savedUser.email,
        fullName: savedUser.full_name,
        registrationTimestamp: savedUser.reg_timestamp, 
    }

    return res.send(response).end();
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).send({ error: "Bad request" }).end();
    }

    if (!email || !password) {
        return res.status(400).send('User name or password is missing').end();
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(400).send('Login failed').end();
    }

    const passwordMatches = await comparePassword(password, user.password);

    if (!passwordMatches) {
        return res.status(400).send('Passwords do not match').end();
    }

    const issuedAt = new Date().getTime();

    const userPayload = { 
        email, 
        issuedAt,
    };

    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const response = {
        accessToken: token,
        issuedAt
    };

    return res.send(response).end();
});

router.post('/groups', isLoggedIn, async (req, res) => {
    const { groupName } = req.body;

    if (typeof groupName !== "string") {
        return res.status(400).send({ error: "Bad request" }).end();
    }

    if (!groupName) {
        return res.status(400).send('Group name must be provided').end();
    }

    const group = new GroupsModel({
        name: groupName
    });

    const createdGroup: GroupModel = await group.save();

    return res.send({ groupName: createdGroup.name }).end();
});

router.get('/groups', async (req, res) => {
    const groups = await GroupsModel.find();
    return res.send(groups).end();
});

router.post('/accounts', isLoggedIn, async (req, res) => {
    const { groupId } = req.body;
    const { userId } = res.locals;

    if (typeof groupId !== 'string') {
        return res.status(400).send('Bad request').end();
    }

    if (!groupId) {
        return res.status(400).send('Group id must be present').end();
    }

    if (!userId) {
        return res.status(500).send('Internal server error').end();
    }

    const existingAccounts = await AccountsModel.find({
        group: groupId,
        user: userId,
    });

    if (existingAccounts.length > 0) {
        return res.status(400).send('User already assigned to group').end();
    }

    const account = new AccountsModel({
        group: groupId,
        user: userId,
    })

    const savedAccount = await account.save();

    return res.send(savedAccount).end();
});

router.get('/accounts', isLoggedIn, async (req, res) => {
    const { userId } = res.locals;

        if (!userId) {
        return res.status(500).send('Internal server error').end();
    }

    const accounts = await AccountsModel.find({ user: userId })
        .populate('group');


    return res.send(accounts.map(account => account.group));
});

router.get('/bills/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    if (!groupId) {
        return res.status(400).send('Bad request').end();
    }

    const bills = await BillsModel.find({ group: groupId });

    return res.send(bills).end();
});

router.post('/bills', async (req, res) => {
    const { groupId, amount, description } = req.body;

    if (typeof groupId !== 'string' || typeof amount !== 'string' || typeof description !== 'string') {
        return res.status(400).send('Bad request').end();
    }

    if (!groupId || !amount || !description) {
        return res.status(400).send('Amount, description and group id must be present').end();
    }

    const bill = new BillsModel({
        amount,
        group: groupId,
        description
    });

    const savedBill = await bill.save();
    
    return res.send(savedBill).end();
});

export { router };