import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
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

    return { loading, conversations };
};
export default useGetConversations;