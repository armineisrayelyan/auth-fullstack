import { useState } from 'react';
import api from "../api/axios.js";

export default function UserSearchModal({ onSelectUser }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const searchUsers = async (value) => {
        setQuery(value);

        if (!value) {
            setResults([]);
            return;
        }

        const res = await api.get(`/user/search?q=${value}`);
        setResults(res.data);
    };

    return (
        <div className="search-box">
            <input
                placeholder="Search users..."
                value={query}
                onChange={(e) => searchUsers(e.target.value)}
            />

            <div>
                {results.map(user => (
                    <div
                        key={user._id}
                        onClick={() => onSelectUser(user)}
                    >
                        {user.name}
                    </div>
                ))}
            </div>
        </div>
    );
}