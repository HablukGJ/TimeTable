import { useState } from "react";
import { authService } from "../../services/AuthService.ts";

export default function LoginView() {
    const [error, setError] = useState("");
    const [userData, setUserData] = useState({
        username: '',
        password: ''
    })
    function handleSubmit() {
        if (userData.username && userData.password) {
            try {
                const resp = authService.login(userData);
                resp.then((data) => {
                    try {
                        if (data.access) {
                            location.replace('/')
                        }
                    } catch (error) {
                        console.log(error);
                        setError("Неверное имя пользователя или пароль")
                    }
                })
            } catch (error) {
                console.log(error);
                setError("Ошибка сервера! Попробуйте позже")
            }
        } else {
            setError("Заполните все поля")
        }
    }
    return (
        <main className="w-full h-[100vh] bg-blue-100 flex items-center justify-center font">
            <div className="bg-white w-1/5 rounded-2xl p-13">
                <h1 className="text-4xl text-center font-bold mb-5">Вход</h1>
                <label>Имя пользователя</label>
                <input type="text" className="w-full bg-gray-100 rounded-lg p-3 outline-none mb-3"
                       value={userData.username} onChange={(e) => setUserData({...userData, username:e.target.value})}/>
                <label>Пароль</label>
                <input type="text" className="w-full bg-gray-100 rounded-lg p-3 outline-none mb-3"
                       value={userData.password} onChange={(e) => setUserData({...userData, password:e.target.value})}/>
                <p className='text-gray-400'>*Все поля обязательны к заполнению</p>
                {error != "" ? <button className="bg-red-500 text-white p-3 rounded-[10px] w-full hover:cursor-pointer active:bg-red-600 mt-10"
                                       onClick={handleSubmit}>{error}</button> : <button
                    className="bg-blue-500 p-3 rounded-[10px] text-white mt-10 w-full hover:cursor-pointer active:bg-blue-600"
                    onClick={handleSubmit}>Войти</button>
                }
                <h1 className="text-center text-blue-400 mt-2 hover:cursor-pointer" onClick={() => {location.replace("/register")}}>Нет аккаунта? Зарегистрироваться</h1>
            </div>
        </main>
    )
}