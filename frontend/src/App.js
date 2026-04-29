import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Groups from "./pages/Groups";
import Favorites from "./pages/Favorites";

function PrivateRoute({children}){
  return localStorage.getItem("token") ? children : <Navigate to="/" />;
}

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/contacts" element={<PrivateRoute><Contacts/></PrivateRoute>} />
        <Route path="/groups" element={<PrivateRoute><Groups/></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><Favorites/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;