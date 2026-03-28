import { useState, useEffect } from 'react';
import { authService } from "../services/AuthService.ts";
import { eventService } from "../services/EventService.ts";

interface UserProfile {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: 'student' | 'teacher' | 'admin';
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    // Состояние для формы смены пароля
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        new_password_confirm: ''
    });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await authService.getProfile();
                setUser(userData);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить профиль");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
        eventService.getEvents()
    }, []);

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!passwordData.old_password || !passwordData.new_password || !passwordData.new_password_confirm) {
            setError("Заполните все поля");
            return;
        }

        if (passwordData.new_password !== passwordData.new_password_confirm) {
            setError("Новые пароли не совпадают");
            return;
        }

        if (passwordData.old_password === passwordData.new_password) {
            setError("Новый пароль должен отличаться от старого");
            return;
        }

        setIsPasswordLoading(true);

        try {
            await authService.changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });

            setSuccess("Пароль успешно изменён");
            setPasswordData({ old_password: '', new_password: '', new_password_confirm: '' });

            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Неверный старый пароль или ошибка сервера");
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
        if (success) setSuccess("");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
                    <div className="text-gray-400 text-sm">Загрузка профиля...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Заголовок страницы */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Профиль</h1>
                    <p className="text-sm text-gray-500 mt-1">Управление настройками аккаунта</p>
                </div>

                {/* Карточка личной информации */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Личная информация</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Имя</label>
                            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                                {user?.first_name || '—'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Фамилия</label>
                            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                                {user?.last_name || '—'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                                {user?.email || '—'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Телефон</label>
                            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                                {user?.phone || 'Не указан'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Имя пользователя</label>
                            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                                {user?.username || '—'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Роль</label>
                            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role === 'student' ? 'Ученик' : user?.role === 'teacher' ? 'Преподаватель' : 'Администратор'}
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Карточка смены пароля */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Изменить пароль</h2>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Старый пароль</label>
                            <input
                                type="password"
                                name="old_password"
                                value={passwordData.old_password}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200 text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Новый пароль</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={passwordData.new_password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200 text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Подтвердите новый пароль</label>
                                <input
                                    type="password"
                                    name="new_password_confirm"
                                    value={passwordData.new_password_confirm}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200 text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPasswordLoading}
                            className={`w-full py-3 px-4 rounded-xl text-sm font-medium text-white shadow-md transition-all duration-200 
                ${isPasswordLoading
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 active:scale-[0.98] hover:shadow-lg'
                            }`}
                        >
                            {isPasswordLoading ? 'Сохранение...' : 'Изменить пароль'}
                        </button>
                    </form>
                </div>

                {/* Кнопка назад */}
                <div className="mt-8 text-center">
                    <a
                        href="/"
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Вернуться на главную
                    </a>
                </div>
            </div>
        </div>
    );
}