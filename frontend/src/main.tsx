import "./main.css"
import { createRoot } from "react-dom/client";
import {Routes, Route, BrowserRouter} from "react-router-dom";

import RegisterPage from "./app/Auth/RegisterPage.tsx";
import LoginView from "./app/Auth/LoginPage.tsx";
import MainPage from "./app/MainPage.tsx";

createRoot(document.getElementById('root')!).render(
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/register' element={<RegisterPage />}></Route>
                <Route path='/login' element={<LoginView />}></Route>
                <Route path='/' element={<MainPage />}></Route>
            </Routes>
        </BrowserRouter>
    </>
)