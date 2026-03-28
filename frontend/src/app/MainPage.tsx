// import { useEffect } from "react";
// import {authService} from "../services/AuthService.ts";
//
// export default function MainPage() {
//     useEffect(() => {
//         if (!authService.isAuthenticated()) {
//             location.replace("/register")
//         }
//     }, []);
//     function quit() {
//         localStorage.setItem("accessToken", "")
//         location.replace("/login")
//     }
//     return (
//         <>
//             <aside className="bg-white p-5 float-left w-1/5 h-[100vh] border-gray-300 border-r-2 font items-center justify-center relative">
//                 <p className="absolute bottom-5">{JSON.parse(localStorage.getItem("user") as string).first_name} {JSON.parse(localStorage.getItem("user") as string).last_name}</p>
//                 <button className="absolute bottom-5 right-5 bg-red-500 text-white p-3 rounded-lg hover:cursor-pointer active:bg-red-600" onClick={quit}>Выйти</button>
//             </aside>
//             <main className="bg-blue-100 w-4/5 h-[100vh] float-right font p-5">
//                 <h1 className="font text-5xl">Hello!</h1>
//             </main>
//         </>
//     )
// }

import { useState, useEffect } from 'react';
import { authService } from "../services/AuthService.ts";

// Тип для данных пользователя (можно вынести в отдельный файл типов)
interface UserProfile {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
}

export default function HomePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Получение данных пользователя при загрузке
        const fetchUser = async () => {
            try {
                const userData = await authService.getProfile();
                setUser(userData);
            } catch (err) {
                console.error("Не удалось загрузить профиль", err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        authService.logout();
        window.location.replace("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* HEADER */}
            <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Логотип / Название */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                </div>
                                <span className="font-semibold text-lg text-gray-900 tracking-tight">EduSchedule</span>
                            </div>
                        </div>

                        {/* Навигация и Профиль */}
                        <div className="flex items-center gap-4">
                            {/* Кнопка "Мои занятия" */}
                            <a
                                href="/schedule"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Мои занятия
                            </a>

                            {/* Разделитель */}
                            <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

                            {/* Профиль и Выход */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
                                        {user?.first_name?.[0] || 'U'}
                                    </div>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>

                                {/* Выпадающее меню */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-sm font-medium text-gray-900">{user?.username || 'Пользователь'}</p>
                                            <p className="text-xs text-gray-500">{user?.email || ''}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                            </svg>
                                            Выйти
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Приветствие */}
                <div className="mb-10">
                    <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                        Добро пожаловать, {user?.first_name || 'Гость'}!
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Система управления расписанием образовательного учреждения
                    </p>
                </div>

                {/* Информационная карточка */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">О платформе</h2>
                            <p className="text-gray-600 leading-relaxed">
                                EduSchedule — это современная система расписания, разработанная для удобства учеников и преподавателей.
                                Здесь вы можете просматривать актуальное расписание занятий, получать уведомления об изменениях
                                и управлять своим учебным процессом в одном месте.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Быстрые действия (Карточки) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Карточка 1 */}
                    <a href="/schedule" className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Моё расписание</h3>
                        <p className="text-sm text-gray-500">Просмотр занятий на неделю</p>
                    </a>

                    {/* Карточка 2 */}
                    <a href="/grades" className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Успеваемость</h3>
                        <p className="text-sm text-gray-500">Оценки и прогресс</p>
                    </a>

                    {/* Карточка 3 */}
                    <a href="/profile" className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Профиль</h3>
                        <p className="text-sm text-gray-500">Настройки аккаунта</p>
                    </a>

                </div>
            </main>
        </div>
    );
}