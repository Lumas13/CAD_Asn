import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import AddItemPage from "./pages/AddItemPage";
import LoginPage from "./pages/LoginPage";
import ManageItemPage from "./pages/ManageItemPage"; 

function App() {
  const [user, setUser] = useState(null); 

  useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  const handleLogout = () => {
    setUser(null); 
    localStorage.removeItem("user");
  };

  return (
    <Router>
      {/* Header Section */}
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <img src="/logo-nyp.svg" alt="Logo" className="logo" />
          </Link>
          <nav>
            <ul>
              <li><Link to="/About">About Us</Link></li>
              {user && <li><Link to="/AddItem">Report Item</Link></li>}
              {user?.role === "staff" && <li><Link to="/ManageItems">Manage Items</Link></li>} 
            </ul>
          </nav>
        </div>
        <div className="navbar-right">
          <nav>
            <ul>
              {!user ? (
                <li><Link to="/Login">Login</Link></li>
              ) : (
                <>
                  <li className="user-info">
                    Welcome, {user.name}
                  </li>
                  <li>
                    <button className="logout-button" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/About" element={<AboutUsPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route
            path="/AddItem"
            element={user ? <AddItemPage user={user} /> : <Navigate to="/Login" replace />}
          />
          <Route path="/Login" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/ManageItems"
            element={user?.role === "staff" ? <ManageItemPage /> : <Navigate to="/Login" replace />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
