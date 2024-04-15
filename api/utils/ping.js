export async function pingMyself() {
    try {
        const response = await fetch('https://cartrader-api.onrender.com/api/user/test');
        if (!response.ok) {
            throw new Error('Ошибка HTTP: ' + response.status);
        }
        console.log('Запрос прошел успешно:', response.status);
        console.log('===============================');
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error.message);
    }
}
