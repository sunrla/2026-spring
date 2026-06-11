export type Rating = 1 | 2 | 3 | 4 | 5;

export type SkinGoal =
  | 'balance'
  | 'hydration'
  | 'calm'
  | 'texture'
  | 'routine';

export type SkinProfile = {
  dryness: Rating;
  oiliness: Rating;
  sensitivity: Rating;
  redness: Rating;
  breakouts: Rating;
  mainGoal: SkinGoal;
  updatedAt: string;
};

export type ProductCategory =
  | 'cleanser'
  | 'toner'
  | 'serum'
  | 'moisturizer'
  | 'sunscreen'
  | 'mask'
  | 'other';

export type ProductDataSource = 'sample' | 'manual';
export type ProductVerificationStatus = 'needs-user-review' | 'user-entered';

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  ingredientText: string;
  frequency: string;
  createdAt: string;
  dataSource?: ProductDataSource;
  verificationStatus?: ProductVerificationStatus;
  catalogProductId?: string;
};

export type IngredientTag =
  | 'fragrance-related'
  | 'exfoliating-acid'
  | 'moisturizing'
  | 'sunscreen'
  | 'preservative'
  | 'potential-irritation-caution';

export type IngredientCautionLevel = 'low' | 'medium' | 'caution';
export type IngredientEvidenceStatus = 'demo-rule';

export type ParsedIngredient = {
  name: string;
  tags: IngredientTag[];
};

export type IngredientTagExplanation = {
  tag: IngredientTag;
  labelKo: string;
  shortDescriptionKo: string;
  routineMeaningKo: string;
  cautionLevel: IngredientCautionLevel;
  evidenceStatus: IngredientEvidenceStatus;
  sourceLabel: 'MVP 데모 룰';
  disclaimerKo: string;
  matchedIngredients: string[];
};

export type WeeklyLog = {
  id: string;
  createdAt: string;
  drynessScore: Rating;
  oilinessScore: Rating;
  rednessScore: Rating;
  irritationScore: Rating;
  breakoutCount: number;
  sleepHours: number;
  stressScore: Rating;
  memo: string;
};

export type RiskLevel = 'Low' | 'Medium' | 'Caution';

export type RoutineRiskResult = {
  level: RiskLevel;
  summary: string;
  explanations: string[];
  cautionTags: IngredientTag[];
};

export type RecommendationStep = {
  title: string;
  description: string;
  reason: string;
  relatedSignals: string[];
};

export type RoutineRecommendation = {
  dataCompletenessScore: number;
  basisSummary: string[];
  morningRoutine: RecommendationStep[];
  eveningRoutine: RecommendationStep[];
  avoidList: RecommendationStep[];
  observationPlan: string[];
  reasonSummary: string;
  safetyNote: string;
  generatedAt: string;
};
