import axios from "axios";

export interface Room {
    id: number;
    number: string;
    name?: string;
    capacity?: number;
    building?: string;
}


export interface Event {
    id: number;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
    user_id: number;
    created_at?: string;
    updated_at?: string;
    room: string;
    time: string;
    date: string;
    name: string;
    roomData: Room;
    _group: string;
}

class EventService {
    public baseUrl = "http://127.0.0.1:8000";

    // Вспомогательный метод для получения заголовков с токеном
    private getAuthHeaders() {
        const token = localStorage.getItem("accessToken");
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        };
    }

    // Получить все мероприятия пользователя
    async getEvents(): Promise<Event[]> {
        try {
            const resp = await axios.get(`${this.baseUrl}/api/events`, this.getAuthHeaders());
            console.log(resp);
            return resp.data;
        } catch (error) {
            console.error("Ошибка при получении мероприятий:", error);
            throw error;
        }
    }
    async getRoomByID(id: number) {
        try {
            const resp = await axios.get(`${this.baseUrl}/api/rooms/${id}`, this.getAuthHeaders());
            console.log(resp.data);
            return resp.data;
        } catch (error) {
            console.log(error);
        }
    }
    async getGroupByID(id: number) {
        try {
            const resp = await axios.get(`${this.baseUrl}/api/teams/${id}`, this.getAuthHeaders());
            console.log(resp.data);
            return resp.data.name;
        } catch (error) {
            console.log(error);
        }
    }
}

export const eventService = new EventService();