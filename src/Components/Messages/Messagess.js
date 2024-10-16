import { useEffect, useRef } from "react";
import useGetMessages from "../../User/UserGetMessage";
import MessageSkeleton from "../Skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../User/UserListMessage";

const Messages = () => {
    const { messages, loading } = useGetMessages();
    useListenMessages();
    const lastMessageRef = useRef();

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

            {!loading && Array.isArray(messages) && messages.length > 0 ? (
                messages.map((message) => (
                    <div key={message._id} ref={lastMessageRef}>
                        <Message message={message} />
                    </div>
                ))
            ) : (
                <p className='text-center'>Send a message to start the conversation</p>
            )}
        </div>
    );
};

export default Messages;
