// app/about/queryClient.tsx
'use client'
import React, {useEffect} from "react";
import { WP_REST_API_Post } from 'wp-types';
import PostPreview from "@/components/PostPreview";

export default function AboutPage() {
    const [data, setData] =  React.useState<WP_REST_API_Post[] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    useEffect(() => {
        // ПРЯМОЙ URL - без использования конфига
        fetch('http://localhost:8000/wp-json/wp/v2/posts?per_page=3')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <p>Постов: {data?.length || 0}</p>
            {data?.map((post: WP_REST_API_Post) => (
                <PostPreview post={post} key={post.id}/>
            ))}
        </div>
    );
}