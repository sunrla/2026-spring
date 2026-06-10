'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Textarea } from '@/components/ui/Textarea';
import { tagLabels } from '@/data/ingredientRules';
import { parseIngredientText } from '@/lib/ingredients';
import { frequencyOptions, productCategoryOptions } from '@/lib/options';
import { makeId, readLocal, storageKeys, writeLocal } from '@/lib/storage';
import type { IngredientTag, Product, ProductCategory } from '@/types/skinloop';

type ProductForm = Pick<Product, 'name' | 'brand' | 'category' | 'ingredientText' | 'frequency'>;

const emptyForm: ProductForm = {
  name: '',
  brand: '',
  category: 'serum',
  ingredientText: '',
  frequency: '매일 1회',
};

const tagTone: Record<IngredientTag, 'green' | 'amber' | 'rose' | 'blue' | 'slate'> = {
  'fragrance-related': 'amber',
  'exfoliating-acid': 'rose',
  moisturizing: 'green',
  sunscreen: 'blue',
  preservative: 'slate',
  'potential-irritation-caution': 'rose',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  useEffect(() => {
    setProducts(readLocal<Product[]>(storageKeys.products, []));
  }, []);

  const parsedIngredients = useMemo(() => parseIngredientText(form.ingredientText), [form.ingredientText]);
  const parsedTags = Array.from(new Set(parsedIngredients.flatMap((ingredient) => ingredient.tags)));
  const canSave = form.name.trim() && form.brand.trim() && form.ingredientText.trim();

  const saveProduct = () => {
    if (!canSave) return;

    const nextProduct: Product = {
      ...form,
      id: makeId('product'),
      createdAt: new Date().toISOString(),
    };
    const nextProducts = [nextProduct, ...products];
    setProducts(nextProducts);
    writeLocal(storageKeys.products, nextProducts);
    setForm(emptyForm);
  };

  const removeProduct = (id: string) => {
    const nextProducts = products.filter((product) => product.id !== id);
    setProducts(nextProducts);
    writeLocal(storageKeys.products, nextProducts);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Products"
        title="현재 사용 제품 등록"
        description="제품명, 브랜드, 카테고리, 전성분 텍스트, 사용 빈도를 저장합니다. 성분 텍스트는 쉼표 기준으로 간단히 나눕니다."
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="space-y-4">
            <Input
              label="제품명"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="예: 밸런싱 세럼"
            />
            <Input
              label="브랜드"
              value={form.brand}
              onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}
              placeholder="예: SkinLoop Lab"
            />
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">카테고리</span>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value as ProductCategory }))
                }
                className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition focus:border-loop-leaf focus:ring-4 focus:ring-loop-mint/50"
              >
                {productCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Textarea
              label="성분 텍스트"
              value={form.ingredientText}
              onChange={(event) => setForm((current) => ({ ...current, ingredientText: event.target.value }))}
              placeholder="예: 정제수, 글리세린, 판테놀, 향료, 페녹시에탄올"
            />
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">사용 빈도</span>
              <select
                value={form.frequency}
                onChange={(event) => setForm((current) => ({ ...current, frequency: event.target.value }))}
                className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition focus:border-loop-leaf focus:ring-4 focus:ring-loop-mint/50"
              >
                {frequencyOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-sm font-bold text-slate-700">파싱된 성분</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {parsedIngredients.length === 0 ? (
                <Badge>성분을 입력하면 태그가 표시됩니다</Badge>
              ) : (
                parsedIngredients.map((ingredient) => (
                  <Badge key={ingredient.name} tone={ingredient.tags.length ? 'green' : 'slate'}>
                    {ingredient.name}
                  </Badge>
                ))
              )}
            </div>

            <p className="mt-5 text-sm font-bold text-slate-700">감지된 mock 태그</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {parsedTags.length === 0 ? (
                <Badge>아직 감지된 태그 없음</Badge>
              ) : (
                parsedTags.map((tag) => (
                  <Badge key={tag} tone={tagTone[tag]}>
                    {tagLabels[tag]}
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
            <Button type="button" onClick={saveProduct} disabled={!canSave}>
              제품 저장
            </Button>
          </div>
        </Card>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-loop-ink">등록된 제품</h2>
          {products.length === 0 ? (
            <Card>
              <p className="text-sm leading-6 text-slate-600">아직 등록된 제품이 없습니다.</p>
            </Card>
          ) : (
            products.map((product) => {
              const tags = Array.from(
                new Set(parseIngredientText(product.ingredientText).flatMap((ingredient) => ingredient.tags)),
              );

              return (
                <Card key={product.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">{product.brand}</p>
                      <h3 className="mt-1 text-lg font-bold text-loop-ink">{product.name}</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {productCategoryOptions.find((option) => option.value === product.category)?.label} · {product.frequency}
                      </p>
                    </div>
                    <Button type="button" variant="quiet" onClick={() => removeProduct(product.id)}>
                      삭제
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.length === 0 ? (
                      <Badge>감지된 태그 없음</Badge>
                    ) : (
                      tags.map((tag) => (
                        <Badge key={tag} tone={tagTone[tag]}>
                          {tagLabels[tag]}
                        </Badge>
                      ))
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
