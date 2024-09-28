import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserDetails = () => {
    const { id } = useParams(); // Get the user ID from the route
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4000/users/${id}`)
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch((error) => console.error('Error fetching user:', error));
    }, [id]);

    if (!user) {
        return <p>Loading user details...</p>;
    }

    return (
        <div>
            <h1>{user.username}</h1>
            <p>Email: {user.email}</p>
            <p>Roles: {user.roleDetails.map((role) => role.name).join(', ')}</p>
        </div>
    );
};

export default UserDetails;
