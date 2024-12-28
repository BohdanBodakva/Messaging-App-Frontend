import './App.css';
import {Routes, Route, Navigate} from "react-router-dom";
import {useState} from "react";
import Layout from "./components/Layout/Layout";
import Login from "./components/Login/Login";
import Chats from "./components/Chats/Chats";
import Profile from "./components/Profile/Profile";
import {LanguageProvider} from "./providers/translations/LanguageProvider";

function App() {


    const [currentUser, setCurrentUser] = useState(null)

    return (
        <Layout>
            <LanguageProvider>
                <Routes>
                    <Route index element={<Chats currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
                    <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                    {/*<Route path="/profile" element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} />} />*/}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </LanguageProvider>
        </Layout>
    );
}

export default App;
