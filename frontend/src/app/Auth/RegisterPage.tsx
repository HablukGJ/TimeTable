import { useState } from 'react';
import { authService } from "../../services/AuthService.ts";

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [userData, setUserData] = useState({
        username: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        email: '',
        role: 'student'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        // Очищаем ошибку при начале ввода
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // Проверка на заполненность
        const requiredFields = ['username', 'password', 'password2', 'first_name', 'last_name', 'email'];
        const isEmpty = requiredFields.some(field => !userData[field as keyof typeof userData]);

        if (isEmpty) {
            setError("Заполните все обязательные поля");
            return;
        }

        if (userData.password !== userData.password2) {
            setError("Пароли не совпадают");
            return;
        }

        setIsLoading(true);

        try {
            const resp = await authService.register(userData);

            if (resp.user) {
                window.location.replace("/login");
            } else {
                throw new Error("Не удалось создать пользователя");
            }
        } catch (err) {
            console.error(err);
            setError("Ошибка сервера. Попробуйте позже.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">

                {/* Заголовок */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Создать аккаунт</h1>
                    <p className="text-sm text-gray-500 mt-2">Заполните форму для регистрации</p>
                </div>

                {/* Сообщение об ошибке */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center animate-fade-in">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Имя и Фамилия в одну строку на больших экранах */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Имя</label>
                            <input
                                type="text"
                                name="first_name"
                                value={userData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
                                placeholder="Иван"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Фамилия</label>
                            <input
                                type="text"
                                name="last_name"
                                value={userData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
                                placeholder="Иванов"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
                            placeholder="example@mail.com"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Имя пользователя</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
                            placeholder="username"
                        />
                    </div>

                    {/* Пароли */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Пароль</label>
                            <input
                                type="password"
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Повторите пароль</label>
                            <input
                                type="password"
                                name="password2"
                                value={userData.password2}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Кнопка отправки */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-medium text-white shadow-md transition-all duration-200 
              ${isLoading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] hover:shadow-lg'
                        }`}
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                {/* Подвал формы */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Уже есть аккаунт?{' '}
                        <a
                            href="/login"
                            onClick={(e) => { e.preventDefault(); window.location.replace('/login'); }}
                            className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors"
                        >
                            Войти
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}