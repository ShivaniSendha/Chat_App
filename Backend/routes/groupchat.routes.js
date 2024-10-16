
import express from "express";

import { GroupChat } from "../controllers/GroupChat.controller.js";

const router = express.Router();
router.post('/groups', GroupChat);
