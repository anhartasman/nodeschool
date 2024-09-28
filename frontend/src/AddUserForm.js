import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after form submission
import { TextField, Button, Grid, Paper, Typography, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const AddUserForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]); // To store selected roles
    const [availableRoles, setAvailableRoles] = useState([]); // To store available roles from API
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // To navigate after submission

    // Fetch available roles from API (or define them statically for now)
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:4000/roles'); // Assuming roles API
                if (!response.ok) {
                    throw new Error('Failed to fetch roles');
                }
                const rolesData = await response.json();
                setAvailableRoles(rolesData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRoles();
    }, []);

    // Handle checkbox change for roles
    const handleRoleChange = (event) => {
        const roleId = event.target.value;
        setRoles((prevRoles) =>
            event.target.checked ? [...prevRoles, roleId] : prevRoles.filter((role) => role !== roleId)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { username, email, roles };

        try {
            const response = await fetch('http://localhost:4000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Error adding user');
            }

            // On success, navigate to the user list page
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '40px auto' }}>
            <Typography variant="h5" align="center" gutterBottom>
                Add New User
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
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default AddUserForm;
