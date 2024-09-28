import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UsersList from './UsersList';
import UserDetails from './UserDetails';
import AddUserForm from './AddUserForm'; // Adjust the path as needed

const theme = createTheme(); // You can customize this theme if needed

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<UsersList />} />
                    <Route path="/user/:id" element={<UserDetails />} />
                    <Route path="/add-user" element={<AddUserForm />} /> {/* Route for the Add User Form */}
                  </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
