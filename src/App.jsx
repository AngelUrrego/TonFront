import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TONTracker from "./components/TonTracker";
import UserTransactions from "./components/UserTransactions";
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TONTracker />} />
                <Route path="/transactions/:user" element={<UserTransactions />} />
            </Routes>
        </Router>
    );
};

export default App;
