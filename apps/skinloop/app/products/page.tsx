'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IngredientTagExplanation } from '@/components/IngredientTagExplanation';
import { Input } from '@/components/ui/Input';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Textarea } from '@/components/ui/Textarea';
import { tagLabels } from '@/data/ingredientRules';
import { productCatalog, type CatalogProduct } from '@/data/productCatalog';
import { getIngredientTagExplanations, parseIngredientText } from '@/lib/ingredients';
import { frequencyOptions, productCategoryOptions } from '@/lib/options';
import { makeId, readLocal, storageKeys, writeLocal } from '@/lib/storage';
import type {
  IngredientTag,
  Product,
  ProductCategory,
  ProductDataSource,
  ProductVerificationStatus,
} from '@/types/skinloop';

type ProductForm = Pick<Product, 'name' | 'brand' | 'category' | 'ingredientText' | 'frequency'> & {
  dataSource?: ProductDataSource;
  verificationStatus?: ProductVerificationStatus;
  catalogProductId?: string;
};

const defaultFrequency = frequencyOptions[1] ?? '매일 1회';

const emptyForm: ProductForm = {
  name: '',
  brand: '',
  category: 'serum',
  ingredientText: '',
  frequency: defaultFrequency,
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProducts(readLocal<Product[]>(storageKeys.products, []));
  }, []);

  const parsedIngredients = useMemo(() => parseIngredientText(form.ingredientText), [form.ingredientText]);
  const parsedTags = Array.from(new Set(parsedIngredients.flatMap((ingredient) => ingredient.tags)));
  const tagExplanations = useMemo(
    () => getIngredientTagExplanations(form.ingredientText),
    [form.ingredientText],
  );
  const canSave = form.name.trim() && form.brand.trim() && form.ingredientText.trim();

  const catalogMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return productCatalog
      .filter((product) => {
        const categoryLabel = getCategoryLabel(product.category);
        return [
          product.name,
          product.brand,
          product.category,
          categoryLabel,
          product.ingredientText,
          ...(product.searchKeywords ?? []),
        ].some((value) =>
          value.toLowerCase().includes(query),
        );
      })
      .slice(0, 5);
  }, [searchQuery]);

  const autofillProduct = (product: CatalogProduct) => {
    setForm((current) => ({
      ...current,
      name: product.name,
      brand: product.brand,
      category: product.category,
      ingredientText: product.ingredientText,
      frequency: current.frequency || defaultFrequency,
      dataSource: 'sample',
      verificationStatus: 'needs-user-review',
      catalogProductId: product.id,
    }));
  };

  const saveProduct = () => {
    if (!canSave) return;

    const isAutofilled = form.dataSource === 'sample' && Boolean(form.catalogProductId);
    const nextProduct: Product = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      ingredientText: form.ingredientText.trim(),
      frequency: form.frequency || defaultFrequency,
      dataSource: isAutofilled ? 'sample' : 'manual',
      verificationStatus: isAutofilled ? 'needs-user-review' : 'user-entered',
      catalogProductId: isAutofilled ? form.catalogProductId : undefined,
      id: makeId('product'),
      createdAt: new Date().toISOString(),
    };

    const nextProducts = [nextProduct, ...products];
    setProducts(nextProducts);
    writeLocal(storageKeys.products, nextProducts);
    setForm(emptyForm);
    setSearchQuery('');
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
        description="제품명을 검색해 데모 샘플 데이터를 자동 입력하거나, 실제 제품 정보를 직접 입력할 수 있습니다."
      />

      <Card>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Input
              label="제품 검색"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="제품명을 검색해 자동 입력하기"
            />
            <p className="mt-2 text-sm font-semibold text-slate-500">
              예: 크림, 수분크림, 토너, 선크림, 클렌저
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              검색 결과가 없거나 실제 제품과 다르면 직접 입력할 수 있습니다.
            </p>
            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-900">
              자동 입력된 참고 정보입니다. 실제 전성분은 제품 포장 또는 공식 표시와 다를 수 있습니다.
            </p>
          </div>

          <div className="space-y-3">
            {searchQuery.trim() && catalogMatches.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                검색 결과가 없습니다. 다른 제품명, 브랜드명, 카테고리명으로 검색하거나 직접 입력할 수 있습니다.
              </div>
            ) : null}

            {catalogMatches.map((product) => (
              <CatalogResultCard key={product.id} product={product} onSelect={autofillProduct} />
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-loop-ink">제품 정보 입력</h2>
            <p className="text-sm leading-6 text-slate-600">
              이 기능은 제품 등록을 돕기 위한 것이며 적합성을 확정하지 않습니다. 모든 필드는 저장 전 수정할 수 있습니다.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <Input
              label="제품명"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="예: SkinLoop 장벽 수분 크림"
            />
            <Input
              label="브랜드"
              value={form.brand}
              onChange={(event) =>
                setForm((current) => ({ ...current, brand: event.target.value }))
              }
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
              onChange={(event) =>
                setForm((current) => ({ ...current, ingredientText: event.target.value }))
              }
              placeholder="예: Water, Glycerin, Panthenol, Ceramide NP, Phenoxyethanol"
            />
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">사용 빈도</span>
              <select
                value={form.frequency}
                onChange={(event) =>
                  setForm((current) => ({ ...current, frequency: event.target.value }))
                }
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

            <div className="mt-5">
              <p className="text-sm font-bold text-slate-700">성분 태그 설명</p>
              <div className="mt-3">
                <IngredientTagExplanation
                  explanations={tagExplanations}
                  emptyMessage="성분을 입력하면 어떤 성분이 어떤 태그를 만들었는지 설명 카드가 표시됩니다."
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone={form.dataSource === 'sample' ? 'blue' : 'slate'}>
                데이터 출처: {form.dataSource === 'sample' ? '데모 샘플' : '직접 입력 예정'}
              </Badge>
              <Badge tone={form.verificationStatus === 'needs-user-review' ? 'amber' : 'slate'}>
                확인 상태: {form.verificationStatus === 'needs-user-review' ? '사용자 확인 필요' : '사용자 입력 기준'}
              </Badge>
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
              const tags = getIngredientTags(product.ingredientText);

              return (
                <Card key={product.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">{product.brand}</p>
                      <h3 className="mt-1 text-lg font-bold text-loop-ink">{product.name}</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {getCategoryLabel(product.category)} · {product.frequency}
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

                  <div className="mt-4 grid gap-2 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
                    <span>데이터 출처: {getProductSourceLabel(product)}</span>
                    <span>확인 상태: {getProductVerificationLabel(product)}</span>
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

function CatalogResultCard({
  product,
  onSelect,
}: {
  product: CatalogProduct;
  onSelect: (product: CatalogProduct) => void;
}) {
  const tags = getIngredientTags(product.ingredientText);

  return (
    <article className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{product.brand}</p>
          <h3 className="mt-1 text-lg font-black text-loop-ink">{product.name}</h3>
          <p className="mt-2 text-sm text-slate-600">{getCategoryLabel(product.category)}</p>
        </div>
        <Button type="button" variant="secondary" onClick={() => onSelect(product)}>
          이 제품으로 자동 입력
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

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone="blue">{product.sourceLabel}</Badge>
        <Badge tone="amber">{product.confidenceLabel}</Badge>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-amber-900">
        실제 제품 전성분과 다를 수 있으므로 저장 전 확인이 필요합니다.
      </p>
    </article>
  );
}

function getIngredientTags(ingredientText: string) {
  return Array.from(new Set(parseIngredientText(ingredientText).flatMap((ingredient) => ingredient.tags)));
}

function getCategoryLabel(category: ProductCategory) {
  return productCategoryOptions.find((option) => option.value === category)?.label ?? category;
}

function getProductSourceLabel(product: Product) {
  return product.dataSource === 'sample' || product.catalogProductId ? '데모 샘플' : '직접 입력';
}

function getProductVerificationLabel(product: Product) {
  return product.verificationStatus === 'needs-user-review' || product.catalogProductId
    ? '사용자 확인 필요'
    : '사용자 입력 기준';
}
