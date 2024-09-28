import React, { useEffect, useState } from 'react';

const AddUserForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]); // All available roles
    const [selectedRoles, setSelectedRoles] = useState([]); // Selected roles

    // Fetch roles from the server when the component mounts
    useEffect(() => {
        fetch('http://localhost:4000/roles') // Assuming you have a route to fetch roles
            .then((response) => response.json())
            .then((data) => setRoles(data))
            .catch((error) => console.error('Error fetching roles:', error));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const userData = {
            username,
            email,
            roles: selectedRoles // Use selected roles
        };

        // Post the user data to your API
        fetch('http://localhost:4000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Optionally, redirect or update the UI
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleRoleChange = (event) => {
        const options = event.target.options;
        const value = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setSelectedRoles(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Email:</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Roles:</label>
                <select multiple value={selectedRoles} onChange={handleRoleChange} required>
                    {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Add User</button>
        </form>
    );
};

export default AddUserForm;
