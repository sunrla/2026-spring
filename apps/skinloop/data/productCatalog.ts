import type { ProductCategory } from '@/types/skinloop';

export type CatalogProduct = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  ingredientText: string;
  searchKeywords?: string[];
  sourceType: 'sample';
  sourceLabel: '데모 샘플 데이터';
  confidenceLabel: '사용자 확인 필요';
};

const moisturizerKeywords = ['크림', '수분크림', '보습크림', '보습제', 'moisturizer', 'cream'];
const tonerKeywords = ['토너', '미스트', 'toner'];
const serumKeywords = ['세럼', '앰플', 'serum', 'ampoule'];
const sunscreenKeywords = ['선크림', '선케어', '자외선', 'sunscreen', 'sun care'];
const cleanserKeywords = ['클렌저', '세안', 'cleanser'];
const maskKeywords = ['마스크', '팩', 'mask'];

export const productCatalog: CatalogProduct[] = [
  {
    id: 'sample-barrier-cream',
    name: 'SkinLoop 장벽 수분 크림',
    brand: 'SkinLoop Lab',
    category: 'moisturizer',
    ingredientText: 'Water, Glycerin, Panthenol, Ceramide NP, Squalane, Phenoxyethanol',
    searchKeywords: ['장벽', '수분', ...moisturizerKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-calm-toner',
    name: 'Demo Lab 진정 토너',
    brand: 'Demo Lab',
    category: 'toner',
    ingredientText: 'Water, Glycerin, Panthenol, Hyaluronic Acid, Phenoxyethanol',
    searchKeywords: ['진정', ...tonerKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-suncare-gel',
    name: 'Routine Lab 선케어 젤',
    brand: 'Routine Lab',
    category: 'sunscreen',
    ingredientText: 'Water, Glycerin, Zinc Oxide, Titanium Dioxide, Phenoxyethanol',
    searchKeywords: ['젤', ...sunscreenKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-low-ph-cleanser',
    name: 'Sample Brand 약산성 클렌저',
    brand: 'Sample Brand',
    category: 'cleanser',
    ingredientText: 'Water, Glycerin, Sodium Benzoate, Fragrance, Limonene',
    searchKeywords: ['약산성', ...cleanserKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-niacinamide-serum',
    name: 'Loop Routine 나이아신아마이드 세럼',
    brand: 'Loop Routine',
    category: 'serum',
    ingredientText: 'Water, Niacinamide, Glycerin, Panthenol, Phenoxyethanol',
    searchKeywords: ['나이아신아마이드', ...serumKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-aha-pha-pad',
    name: 'Demo Care 결 케어 패드',
    brand: 'Demo Care',
    category: 'toner',
    ingredientText: 'Water, Glycolic Acid, Lactic Acid, Glycerin, Phenoxyethanol',
    searchKeywords: ['패드', '결 케어', '각질', 'aha', 'pha', ...tonerKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-bha-gel',
    name: 'Sample Loop BHA 젤',
    brand: 'Sample Loop',
    category: 'serum',
    ingredientText: 'Water, Salicylic Acid, Glycerin, Panthenol, Sodium Benzoate',
    searchKeywords: ['젤', 'bha', '각질', ...serumKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-fragrance-lotion',
    name: 'Demo Scent 라이트 로션',
    brand: 'Demo Scent',
    category: 'moisturizer',
    ingredientText: 'Water, Glycerin, Squalane, Fragrance, Linalool, Limonene, Phenoxyethanol',
    searchKeywords: ['로션', '향', ...moisturizerKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-ceramide-mask',
    name: 'Routine Lab 세라마이드 마스크',
    brand: 'Routine Lab',
    category: 'mask',
    ingredientText: 'Water, Glycerin, Ceramide NP, Panthenol, Hyaluronic Acid, Phenoxyethanol',
    searchKeywords: ['세라마이드', '보습', ...maskKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-mineral-sun-cream',
    name: 'SkinLoop 미네랄 선크림',
    brand: 'SkinLoop Lab',
    category: 'sunscreen',
    ingredientText: 'Water, Zinc Oxide, Titanium Dioxide, Glycerin, Panthenol, Phenoxyethanol',
    searchKeywords: ['미네랄', '크림', ...sunscreenKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-retinol-night-serum',
    name: 'Demo Night 리뉴 세럼',
    brand: 'Demo Night',
    category: 'serum',
    ingredientText: 'Water, Glycerin, Retinol, Panthenol, Phenoxyethanol',
    searchKeywords: ['리뉴', '레티놀', 'night', ...serumKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
  {
    id: 'sample-simple-cream',
    name: 'Sample Plain 보습 크림',
    brand: 'Sample Plain',
    category: 'moisturizer',
    ingredientText: 'Water, Glycerin, Ceramide NP, Squalane, Sodium Benzoate',
    searchKeywords: ['심플', '보습', ...moisturizerKeywords],
    sourceType: 'sample',
    sourceLabel: '데모 샘플 데이터',
    confidenceLabel: '사용자 확인 필요',
  },
];
