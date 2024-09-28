import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router
const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // To track loading state
    const [error, setError] = useState(null); // To track any error

    useEffect(() => {
        fetch('http://localhost:4000/users')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>; // Show loading message while fetching data
    }

    if (error) {
        return <p>Error: {error}</p>; // Show error message
    }

    return (
        <div>
            <h1>Users List</h1>
            <Link to="/add-user">
                <button>Add User</button>
            </Link>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>
                                <Link to={`/user/${user._id}`}>{user.username}</Link>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.roleDetails.map((role) => role.name).join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersList;