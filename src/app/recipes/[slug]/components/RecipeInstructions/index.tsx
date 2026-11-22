import React from "react";
import { Box, Typography } from "@mui/material";
import { ImageBordered } from "@/components/Images";
import { Recipe } from "@/features/recipes/types";
import WpHtml from "@/ui/WpHtml";

interface RecipeInstructionsProps {
    recipe: Recipe | undefined;
}

const RecipeInstructions: React.FC<RecipeInstructionsProps> = React.memo(({ recipe }) => {
    const instructionsFlat = React.useMemo(() => recipe?.instructions_flat || [], [recipe]);

    const imageUrls = React.useMemo(
        () => instructionsFlat.map(step => step?.image_url).filter(Boolean) as string[],
        [instructionsFlat]
    );

    if (instructionsFlat.length === 0) {
        return null;
    }

    return (
        <>
            <Typography variant="h4">
                Приготовление:
            </Typography>
            {/* Текст шага приходит из WP Recipe Maker готовым HTML — очищает и мемоизирует
                его WpHtml, у каждого шага свой кеш. */}
            {instructionsFlat.map((step, index) => (
                <Box key={`instruction_step_${index}`}>
                    <WpHtml html={step?.text} />
                </Box>
            ))}
            {imageUrls.length > 0 && (
                <>
                    <Typography variant="h4">
                        Изображения:
                    </Typography>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start', mb: 2}}>
                        {/* Ключ — весь адрес: хвосты вида «-300x200.jpg» у картинок WP совпадают.
                            Индекс добавлен на случай одной картинки в двух шагах; список статичный. */}
                        {imageUrls.map((imgLink, index) => (
                            <ImageBordered
                                src={imgLink}
                                // Подписей к картинкам шагов WP Recipe Maker не отдаёт, а шаги
                                // описаны текстом выше; выдумывать «Фото 1» — шум для скринридера.
                                alt=""
                                key={`${imgLink}_${index}`}
                                sx={{ maxWidth: "350px" }}
                            />
                        ))}
                    </Box>
                </>
            )}
        </>
    );
});

RecipeInstructions.displayName = "RecipeInstructions";

export default RecipeInstructions;
