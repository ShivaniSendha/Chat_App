import { useEffect, useState } from "react";
import useGetConversations from "../../User/UserGetConversations";

import Conversation from "./Conversation";
import toast from "react-hot-toast";

const Conversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                // Retrieve the token from local storage
                const token = localStorage.getItem("token"); // Assuming you store the token as 'token'

                const res = await fetch("http://localhost:5000/api/users", {
                    method: "GET", // Make sure to specify the method
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Add the token in the Authorization header
                    },
                });

                const data = await res.json();
                console.log("data", data);

                if (data.error) {
                    throw new Error(data.error);
                }

                setConversations(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return (
        <div className="py-2 flex flex-col overflow-auto">
            {conversations.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}

                    lastIdx={idx === conversations.length - 1}
                />
            ))}

            {loading && <span className="loading loading-spinner mx-auto"></span>}
        </div>
    );
};

export default Conversations;
