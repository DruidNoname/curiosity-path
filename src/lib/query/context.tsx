import * as React from "react";
import type {QueryClient} from "@tanstack/query-core";

export const QueryClientContext = React.createContext<QueryClient | undefined>(
    undefined,
)

export const useQueryClient = (queryClient?: QueryClient) => {
    const client = React.useContext(QueryClientContext)

    if (queryClient) {
        return queryClient
    }

    if (!client) {
        throw new Error('No QueryClient set, use QueryClientProvider to set one')
    }

    return client
}