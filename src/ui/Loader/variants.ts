export const LOADER_VARIANTS = ['atom', 'bicycle', 'crutch'] as const;

export type LoaderVariant = typeof LOADER_VARIANTS[number];

export const pickLoaderVariant = (random: () => number = Math.random): LoaderVariant => {
  const index = Math.min(Math.floor(random() * LOADER_VARIANTS.length), LOADER_VARIANTS.length - 1);
  return LOADER_VARIANTS[index];
};
