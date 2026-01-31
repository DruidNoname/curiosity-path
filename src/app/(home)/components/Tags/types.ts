export interface GraphQLTag {
    id: string;
    count: number;
    link: string;
    name: string;
    slug: string;
    __typename?: string;
}

export interface GraphQLTagsResponse {
    tags: {
        nodes: GraphQLTag[];
        __typename?: string;
    };
}
