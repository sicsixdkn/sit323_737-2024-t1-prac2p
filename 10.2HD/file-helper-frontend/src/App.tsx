import './App.css'
import {Container, CssBaseline} from "@mui/material";
import LoginForm from "./components/LoginForm.tsx";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from "./components/Navbar.tsx";
import RegisterForm from "./components/RegisterForm.tsx";
import UserContext from "./contexts/UserContext.tsx";
import {useState} from "react";
import {IUser} from "./types/types.ts";
import PdfConcat from "./components/PdfConcat.tsx";
import TokenValidator from "./components/TokenValidator.tsx";
import ImageConverter from "./components/ImageConverter.tsx";

function App() {
    const [user, setUser] = useState<IUser | null>(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            <CssBaseline>
                <BrowserRouter>
                    <Navbar/>
                    <Container>
                        <TokenValidator/>
                        <Routes>
                            <Route path="/" element={<Navigate to="/pdfconcat"/>}/>
                            <Route path="/login" element={<LoginForm/>}/>
                            <Route path="/register" element={<RegisterForm/>}/>
                            <Route path="/pdfconcat" element={<PdfConcat/>}/>
                            <Route path="/imageconverter" element={<ImageConverter/>}/>
                        </Routes>
                    </Container>
                </BrowserRouter>
            </CssBaseline>
        </UserContext.Provider>
    )
}

export default App
