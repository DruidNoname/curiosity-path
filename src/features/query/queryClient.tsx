import { QueryClient } from '@tanstack/react-query';

/**
 * Создаёт новый QueryClient.
 *
 * Раньше здесь стоял `cache()` из react. Это серверный API: в RSC он мемоизирует
 * вызов на время запроса, но в клиентском дереве (а провайдер живёт именно там)
 * не делает ничего, и клиент рисковал пересоздаваться на каждом рендере — вместе
 * со всем кешем запросов.
 *
 * Хранение экземпляра — задача вызывающего. В клиентских компонентах это
 * `useState` с ленивым инициализатором, чтобы клиент создавался ровно один раз
 * на монтирование: `const [queryClient] = useState(makeQueryClient)`.
 */
export const makeQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 минута
            refetchOnWindowFocus: false,
        },
    },
});

export default makeQueryClient;
