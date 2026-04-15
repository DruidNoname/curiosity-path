import React from "react";
import { Box, Typography } from "@mui/material";
import { ImageBordered } from "@/components/Images";
import { Recipe } from "@/features/recipes/types";

interface RecipeInstructionsProps {
    recipe: Recipe;
}

const RecipeInstructions: React.FC<RecipeInstructionsProps> = React.memo(({ recipe }) => {
    const instructionsFlat = recipe?.instructions_flat || [];

    if (instructionsFlat.length === 0) {
        return null;
    }

    const imageUrls = instructionsFlat
        .map((step) => step?.image_url)
        .filter(Boolean) as string[];

    return (
        <>
            <Typography variant="h4">
                Приготовление:
            </Typography>
            {instructionsFlat.map((step, index) => (
                <Box key={`instruction_step_${index}`}>
                    <div dangerouslySetInnerHTML={{ __html: step.text || "" }} />
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
