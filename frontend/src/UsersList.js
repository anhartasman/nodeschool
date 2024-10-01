import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false); // State for modal
    const [selectedUser, setSelectedUser] = useState(null); // To store the user to be deleted

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleClickOpen = (user) => {
        setSelectedUser(user); // Set the user to be deleted
        setOpen(true); // Open the modal
    };

    const handleClose = () => {
        setOpen(false); // Close the modal
        setSelectedUser(null); // Clear the selected user
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/users/${selectedUser._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Filter out the deleted user from the list
            setUsers(users.filter((user) => user._id !== selectedUser._id));

            // Close the modal
            handleClose();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                Error: {error}
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: '24px' }}>
            <Typography variant="h4" gutterBottom align="center">
                Users List
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Link to="/add-user">
                    <Button variant="contained" color="primary">
                        Add User
                    </Button>
                </Link>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Roles</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Link to={`/user/${user._id}`}>{user.username}</Link>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.roleDetails.map((role) => role.name).join(', ')}</TableCell>
                                <TableCell>
                                    <Link to={`/edit-user/${user._id}`}>
                                        <Button variant="contained" color="secondary" style={{ marginRight: '8px' }}>
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button variant="contained" color="error" onClick={() => handleClickOpen(user)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirmation Modal */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the user "{selectedUser?.username}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersList;
