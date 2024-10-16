import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useConversation from "./UserConversation";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        if (selectedConversation?._id) {
            setLoading(true); // Start loading

            axios.get(`http://localhost:5000/api/messages/${selectedConversation._id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token
                },
            })
                .then((response) => {
                    const data = response.data;
                    console.log('Fetched messages:', data); // Debugging log

                    if (!Array.isArray(data)) {
                        throw new Error("Expected an array of messages"); // Throw error if not an array
                    }
                    setMessages(data); // Set messages if it's an array
                })
                .catch((error) => {
                    toast.error(error.message); // Display error message
                })
                .finally(() => {
                    setLoading(false); // Stop loading
                });
        }
    }, [selectedConversation?._id, setMessages]);

    return { messages, loading };
};

export default useGetMessages;
