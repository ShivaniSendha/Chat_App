import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

import toast from "react-hot-toast";
import useConversation from "../../User/UserConversation";
import useGetConversations from "../../User/UserGetConversations";

const SearchInput = () => {
    const [search, setSearch] = useState("");
    const { setSelectedConversation } = useConversation();
    const { conversations } = useGetConversations();

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedSearch = search.trim();
        if (!trimmedSearch) return;
        if (trimmedSearch.length < 3) {
            return toast.error("Search term must be at least 3 characters long");
        }

        const conversation = conversations.find((c) => c.fullName && c.fullName.toLowerCase().includes(trimmedSearch.toLowerCase()));
        console.log('conversation', conversations);
        if (conversation) {
            setSelectedConversation(conversation);
            setSearch("");  // Clear search input after success
        } else {
            toast.error("No such user found!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
            <input
                type='text'
                placeholder='Search…'
                className='input input-bordered rounded-full'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
                <IoSearchSharp className='w-6 h-6 outline-none' />
            </button>
        </form>
    );
};

export default SearchInput;
