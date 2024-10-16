import { Group } from "../models/groupchat.models";

export const GroupChat=async (req, res) => {
    const { name, members } = req.body;
    const group = new Group({ name, members });
    await group.save();
    res.json(group);
}