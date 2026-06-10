import { ingredientRules } from '@/data/ingredientRules';
import type { IngredientTag, ParsedIngredient, Product } from '@/types/skinloop';

export function parseIngredientText(text: string): ParsedIngredient[] {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      tags: findTagsForIngredient(name),
    }));
}

export function findTagsForIngredient(name: string): IngredientTag[] {
  const normalized = name.toLowerCase();

  return ingredientRules
    .filter((rule) => rule.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())))
    .map((rule) => rule.tag);
}

export function collectTagsFromProducts(products: Product[]) {
  const counts = new Map<IngredientTag, number>();

  products.forEach((product) => {
    parseIngredientText(product.ingredientText).forEach((ingredient) => {
      ingredient.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });
  });

  return counts;
}
