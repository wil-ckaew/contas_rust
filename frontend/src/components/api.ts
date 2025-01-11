export async function fetchReminders() {
    try {
        const response = await fetch("http://localhost:8080/accounts/pending_reminders");
        const data = await response.json();

        if (data.status === "success") {
            return data.reminders;
        } else {
            console.error("Erro ao buscar lembretes:", data.message);
            return [];
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        return [];
    }
}
