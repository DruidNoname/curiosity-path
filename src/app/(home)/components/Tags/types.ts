export interface GraphQLTag {
    id: string;
    link: string;
    name: string;
    slug: string;
    count: number;
}

export interface GraphQLTagsResponse {
    tags: {
        nodes: GraphQLTag[];
    };
}
