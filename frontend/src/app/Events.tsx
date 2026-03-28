import { useState, useEffect } from 'react';
import { eventService, type Event } from "../services/EventService.ts";
import { authService } from "../services/AuthService.ts";

interface UserProfile {
    username: string;
    first_name: string;
    last_name: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await authService.getProfile();
                setUser(userData);

                const eventsData = await eventService.getEvents();

                // Получаем информацию об аудиториях для всех событий
                const eventsWithRooms = await Promise.all(
                    eventsData.map(async (event) => {
                        if (event.room && event._group) {
                            try {
                                const roomData = await eventService.getRoomByID(Number(event.room));
                                const groupData = await eventService.getGroupByID(Number(event._group));
                                return { ...event, roomData: roomData, _group: groupData };
                            } catch (e) {
                                console.error(`Не удалось получить аудиторию ${event.room}`);
                                return { ...event, roomData: null, _group: null };
                            }
                        }
                        return { ...event, roomData: null, _group: null };
                    })
                );

                setEvents(eventsWithRooms);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить мероприятия");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Проверка: прошла ли дата события
    const isEventPast = (dateString: string, timeString?: string) => {
        const eventDate = new Date(dateString);

        // Если есть время, добавляем его к дате
        if (timeString) {
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            eventDate.setHours(hours, minutes, seconds || 0);
        }

        const now = new Date();
        return eventDate < now;
    };

    // Форматирование даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Форматирование времени
    const formatTime = (timeString: string) => {
        return timeString.substring(0, 5); // "16:00:00" -> "16:00"
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
                    <div className="text-gray-400 text-sm">Загрузка мероприятий...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* HEADER */}
            <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <span className="font-semibold text-lg text-gray-900">EduSchedule</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <a
                                href="/"
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                На главную
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Заголовок страницы */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Мои мероприятия</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {user?.first_name ? `Расписание для ${user.first_name} ${user.last_name}` : 'Ваше расписание'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {error}
                    </div>
                )}

                {/* Список мероприятий */}
                {events.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Нет запланированных мероприятий</h3>
                        <p className="text-gray-500 text-sm">На данный момент у вас нет мероприятий в расписании</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => {
                            const isPast = isEventPast(event.date || event.start_time, event.time);
                            const isCompleted = isPast;

                            return (
                                <div
                                    key={event.id}
                                    className={`bg-white rounded-2xl shadow-sm border p-6 transition-all duration-200
                    ${isCompleted
                                        ? 'border-gray-100 bg-gray-50 opacity-75'
                                        : 'border-gray-100 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                        {/* Основная информация */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                          ${isCompleted
                                                    ? 'bg-gray-200'
                                                    : 'bg-blue-50'
                                                }`}
                                                >
                                                    <svg className={`w-6 h-6
                            ${isCompleted
                                                        ? 'text-gray-500'
                                                        : 'text-blue-600'
                                                    }`}
                                                         fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className={`text-lg font-semibold mb-2
                            ${isCompleted
                                                        ? 'text-gray-500 line-through'
                                                        : 'text-gray-900'
                                                    }`}
                                                    >
                                                        {event.name || event.title}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1.5">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <span className={isCompleted ? 'text-gray-400' : 'text-gray-600'}>
                                {formatDate(event.date || event.start_time)}
                              </span>
                                                        </div>

                                                        <div className="flex items-center gap-1.5">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                            <span className={isCompleted ? 'text-gray-400' : 'text-gray-600'}>
                                {formatTime(event.time || event.start_time)}
                              </span>
                                                        </div>

                                                        {event.roomData && (
                                                            <div className="flex items-center gap-1.5">
                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                                                </svg>
                                                                <span>
                {event.roomData.building && `${event.roomData.building}, `}
                                                                    Ауд. {event.roomData.number}
                                                                    {event.roomData.capacity && ` (${event.roomData.capacity} мест)`}
              </span>
                                                            </div>
                                                        )}
                                                        {event._group && (
                                                            <div className="flex items-center gap-1.5">
                                                                <span>{event._group}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Индикатор статуса */}
                                        <div className="flex-shrink-0">
                                            {isCompleted ? (
                                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    Завершено
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Запланировано
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Итого */}
                {events.length > 0 && (
                    <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500">
            <span>
              Всего: <span className="font-medium text-gray-900">{events.length}</span>
            </span>
                        <span>
              Завершено: <span className="font-medium text-gray-900">{events.filter(e => isEventPast(e.date || e.start_time, e.time)).length}</span>
            </span>
                        <span>
              Запланировано: <span className="font-medium text-gray-900">{events.filter(e => !isEventPast(e.date || e.start_time, e.time)).length}</span>
            </span>
                    </div>
                )}
            </main>
        </div>
    );
}