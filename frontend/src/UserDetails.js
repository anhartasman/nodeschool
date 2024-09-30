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
        return <p style={styles.loading}>Loading user details...</p>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>{user.username}</h1>
                <p style={styles.info}><strong>Email:</strong> {user.email}</p>
                <p style={styles.info}><strong>Roles:</strong> {user.roleDetails.map((role) => role.name).join(', ')}</p>
            </div>
        </div>
    );
};

// Define styles
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
    },
    card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    info: {
        fontSize: '16px',
        margin: '10px 0',
        color: '#555',
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#888',
    },
};

export default UserDetails;
