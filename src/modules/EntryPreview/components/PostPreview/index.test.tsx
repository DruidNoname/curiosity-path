import React from 'react';
import { render, screen } from '@testing-library/react';
import { PostPreview } from './index';

const base = {
    entryId: 1,
    entrySlug: '/les',
    entryTitle: 'Лес',
    entryPreview: '<p>Анонс</p>',
    searchWords: ['лесу'],
};

describe('PostPreview', () => {
    it('показывает фрагменты от сервера вместо анонса', () => {
        render(
            <PostPreview
                {...base}
                searchSnippets={{snippets: [[{text: 'по ', match: false}, {text: 'лесу', match: true}]], rest: 2}}
            />,
        );
        expect(screen.getByText('лесу')).toBeInTheDocument();
        expect(screen.getByText(/и ещё 2 места в записи/)).toBeInTheDocument();
        expect(screen.queryByText('Анонс')).not.toBeInTheDocument();
    });

    it('без фрагментов от сервера показывает анонс', () => {
        render(<PostPreview {...base} searchSnippets={{snippets: [], rest: 0}} />);
        expect(screen.getByText('Анонс')).toBeInTheDocument();
    });
});
