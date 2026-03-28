import { useEffect } from "react";
import {authService} from "../services/AuthService.ts";

export default function MainPage() {
    useEffect(() => {
        if (!authService.isAuthenticated()) {
            location.replace("/register")
        }
    }, []);
    function quit() {
        localStorage.setItem("accessToken", "")
        location.replace("/login")
    }
    return (
        <>
            <aside className="bg-white p-5 float-left w-1/5 h-[100vh] border-gray-300 border-r-2 font items-center justify-center relative">
                <p className="absolute bottom-5">{JSON.parse(localStorage.getItem("user") as string).first_name} {JSON.parse(localStorage.getItem("user") as string).last_name}</p>
                <button className="absolute bottom-5 right-5 bg-red-500 text-white p-3 rounded-lg hover:cursor-pointer active:bg-red-600" onClick={quit}>Выйти</button>
            </aside>
            <main className="bg-blue-100 w-4/5 h-[100vh] float-right font p-5">
                <h1 className="font text-5xl">Hello!</h1>
            </main>
        </>
    )
}