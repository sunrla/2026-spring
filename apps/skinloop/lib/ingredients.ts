import { ingredientRules } from '@/data/ingredientRules';
import type { IngredientTag, IngredientTagExplanation, ParsedIngredient, Product } from '@/types/skinloop';

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
  return findRulesForIngredient(name).map((rule) => rule.tag);
}

export function getIngredientTagExplanations(text: string): IngredientTagExplanation[] {
  const matches = new Map<IngredientTag, Set<string>>();

  parseIngredientText(text).forEach((ingredient) => {
    findRulesForIngredient(ingredient.name).forEach((rule) => {
      const current = matches.get(rule.tag) ?? new Set<string>();
      current.add(ingredient.name);
      matches.set(rule.tag, current);
    });
  });

  return ingredientRules
    .filter((rule) => matches.has(rule.tag))
    .map((rule) => ({
      tag: rule.tag,
      labelKo: rule.labelKo,
      shortDescriptionKo: rule.shortDescriptionKo,
      routineMeaningKo: rule.routineMeaningKo,
      cautionLevel: rule.cautionLevel,
      evidenceStatus: rule.evidenceStatus,
      sourceLabel: rule.sourceLabel,
      disclaimerKo: rule.disclaimerKo,
      matchedIngredients: Array.from(matches.get(rule.tag) ?? []),
    }));
}

function findRulesForIngredient(name: string) {
  const normalized = name.toLowerCase();

  return ingredientRules
    .filter((rule) => rule.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())));
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
