import * as React from "react";
import {QueryClientContext} from "@/lib/query/context";
import type {QueryClient} from "@tanstack/query-core";

export type QueryClientProviderProps = {
    client: QueryClient
    children?: React.ReactNode
}
export const QueryClientProvider = ({
                                        client,
                                        children,
                                    }: QueryClientProviderProps): React.JSX.Element => {
    React.useEffect(() => {
        client.mount()
        return () => {
            client.unmount()
        }
    }, [client])

    return (
        <QueryClientContext.Provider value={client}>
            {children}
        </QueryClientContext.Provider>
    )
}