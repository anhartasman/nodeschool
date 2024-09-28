import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UsersList from './UsersList';
import UserDetails from './UserDetails';
import AddUserForm from './AddUserForm'; // Adjust the path as needed

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UsersList />} />
                <Route path="/user/:id" element={<UserDetails />} />
                <Route path="/add-user" element={<AddUserForm />} /> {/* Route for the Add User Form */}
              </Routes>
        </Router>
    );
}

export default App;
