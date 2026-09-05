import React from "react";
import { Box, Typography } from "@mui/material";
import { ImageBordered } from "@/components/Images";
import { Recipe } from "@/features/recipes/types";
import { getCleanEntry } from "@/helpers/wp-html";

interface RecipeInstructionsProps {
    recipe: Recipe | undefined;
}

const RecipeInstructions: React.FC<RecipeInstructionsProps> = React.memo(({ recipe }) => {
    const instructionsFlat = React.useMemo(() => recipe?.instructions_flat || [], [recipe]);

    // Текст шага приходит из WP Recipe Maker готовым HTML и уходит в dangerouslySetInnerHTML —
    // санитизация обязательна. getCleanEntry дорогой, а хук нельзя звать внутри .map,
    // поэтому чистим весь список разом и мемоизируем.
    const steps = React.useMemo(
        () => instructionsFlat.map(step => getCleanEntry(step?.text || '')),
        [instructionsFlat]
    );

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
            {steps.map((step, index) => (
                <Box key={`instruction_step_${index}`}>
                    <div dangerouslySetInnerHTML={{ __html: step }} />
                </Box>
            ))}
            {imageUrls.length > 0 && (
                <>
                    <Typography variant="h4">
                        Изображения:
                    </Typography>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start', mb: 2}}>
                        {imageUrls.map((imgLink) => (
                            <ImageBordered
                                src={imgLink}
                                key={imgLink.slice(-8, -1)}
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
