import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Paper, Typography, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]); // Selected roles
    const [availableRoles, setAvailableRoles] = useState([]); // Roles from API
    const [error, setError] = useState(null);

    // Fetch user details and roles
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:4000/users/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const data = await response.json();
                setUsername(data.username);
                setEmail(data.email);
                setRoles(data.roleDetails.map((role) => role._id)); // Assuming roleDetails contains role IDs
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:4000/roles');
                if (!response.ok) {
                    throw new Error('Failed to fetch roles');
                }
                const rolesData = await response.json();
                setAvailableRoles(rolesData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
        fetchRoles();
    }, [id]);

    // Handle checkbox change for roles
    const handleRoleChange = (event) => {
        const roleId = event.target.value;
        setRoles((prevRoles) =>
            event.target.checked ? [...prevRoles, roleId] : prevRoles.filter((role) => role !== roleId)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedUserData = { username, email, roles };

        try {
            const response = await fetch(`http://localhost:4000/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
                throw new Error('Error updating user');
            }

            // Navigate to the users list page
            navigate('/users');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '40px auto' }}>
            <Typography variant="h5" align="center" gutterBottom>
                Edit User
            </Typography>

            {error && (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Username"
                            fullWidth
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            fullWidth
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="email"
                        />
                    </Grid>

                    {/* Roles as checkboxes */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Select Roles:</Typography>
                        <FormGroup row>
                            {availableRoles.map((role) => (
                                <FormControlLabel
                                    key={role._id}
                                    control={
                                        <Checkbox
                                            value={role._id}
                                            onChange={handleRoleChange}
                                            checked={roles.includes(role._id)}
                                        />
                                    }
                                    label={role.name}
                                />
                            ))}
                        </FormGroup>
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Save Changes
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default EditUser;
