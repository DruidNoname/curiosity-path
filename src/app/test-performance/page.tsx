export default function PerformanceTest() {
    console.log('Страница рендерится');
    return (
        <div>
            <h1>Тест производительности</h1>
            <p>Эта страница не использует GraphQL</p>
            <p>Время генерации: {new Date().toISOString()}</p>
        </div>
    );
}