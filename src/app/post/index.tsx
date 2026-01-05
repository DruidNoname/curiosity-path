import React, {useEffect} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Container, Divider, Typography} from "@mui/material";
import {WP_REST_API_Post} from "wp-types";
import {router} from "next/client";

// type Props = {
//     id: string
// }
const Post: React.FC = () => {
    const [post, setPost] = React.useState<WP_REST_API_Post | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    useEffect(() => {
        // Получаем slug из URL (для Next.js useRouter)
        const slug = router.query.slug;
        // Или ID, если используете ID: router.query.id

        if (!slug) return;

        // Запрос одиночного поста по slug
        fetch(`http://localhost:8000/wp-json/wp/v2/posts?slug=${slug}`)
            .then(res => res.json())
            .then(data => {
                // API возвращает массив, берем первый элемент
                if (data && data.length > 0) {
                    setPost(data[0]);
                } else {
                    setError('Пост не найден');
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [router.query.slug]);

    return (
         <ErrorBoundary componentName={'Post'}>
             <Container maxWidth="lg">
                 <Box sx={{ mt: 4, mb: 2 }}>
                     <Typography
                         variant="h1"
                         component="h1"
                         sx={{
                             fontWeight: 'bold',
                             mb: 3
                         }}
                     >
                         {post?.title?.rendered || 'Загрузка...'}
                     </Typography>

                     <Divider sx={{ mb: 4 }} />

                     <Box sx={{ typography: 'body1' }}>
                         {post?.content?.rendered ? (
                             <div
                                 dangerouslySetInnerHTML={{
                                     __html: post.content.rendered
                                 }}
                             />
                         ) : (
                             <Typography>Загрузка контента...</Typography>
                         )}
                     </Box>
                 </Box>
             </Container>

         </ErrorBoundary>
    )
}

export default Post;
//     // const location = useLocation();
//
//     return (
//         <ErrorBoundary componentName={'Post'}>