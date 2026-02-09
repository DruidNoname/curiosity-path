'use client';

import React from 'react';
// import {useRouter} from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}
const Recipe: React.FC<Props> = ({ params }) => {
    // const router = useRouter();
    const { slug } = React.use(params);

    return(
        <div>
            { slug } Здесь нет запроса.
        </div>
    );
};

export default Recipe;