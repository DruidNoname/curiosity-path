import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import {urls} from "@/config/urls";

const httpLink = createHttpLink({
    uri: urls.graphql,
});
export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});
