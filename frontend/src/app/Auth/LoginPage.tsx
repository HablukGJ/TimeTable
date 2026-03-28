import { useState } from 'react';
import { authService } from "../../services/AuthService.ts";

export default function LoginView() {
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const [userData, setUserData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!userData.username || !userData.password) {
            setError("Заполните все поля");
            return;
        }

        setIsLoading(true);

        try {
            const resp = await authService.login(userData);

            if (resp.access) {
                window.location.replace("/");
            } else {
                throw new Error("Неверные данные");
            }
        } catch (err) {
            console.error(err);
            setError("Неверное имя пользователя или пароль");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">

                {/* Заголовок */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Вход в аккаунт</h1>
                    <p className="text-sm text-gray-500 mt-2">Введите свои данные для продолжения</p>
                </div>

                {/* Сообщение об ошибке */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center animate-fade-in">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Имя пользователя */}
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

                    {/* Пароль */}
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
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                {/* Подвал формы */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Нет аккаунта?{' '}
                        <a
                            href="/register"
                            onClick={(e) => { e.preventDefault(); window.location.replace('/register'); }}
                            className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors"
                        >
                            Зарегистрироваться
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}