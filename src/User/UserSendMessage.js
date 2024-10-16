import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "./UserConversation";
import { useAuthContext } from "../Context/AuthContext";
import axios from "axios";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { authUser } = useAuthContext(); // 
    console.log('selectedID',selectedConversation._id);
    
    useEffect(() => {
        axios.get(`http://localhost:5000/api/messages/${selectedConversation._id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                const data = response.data;
                console.log('Fetched messages:', data);

                if (!Array.isArray(data)) {
                    throw new Error("Expected an array of messages");
                }
                setMessages(data);
            })
            .catch((error) => {
                toast.error(error.message);
            })
    }, [ loading])

    const sendMessage = async (message) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/messages/send/${selectedConversation._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ message }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages((prevMessages) => [...prevMessages, data]);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

console.log('sendMessage',messages);

    return { sendMessage, loading };
};

export default useSendMessage;
