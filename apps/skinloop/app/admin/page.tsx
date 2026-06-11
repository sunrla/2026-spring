'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ingredientRules, tagKoreanLabels } from '@/data/ingredientRules';
import { collectTagsFromProducts, getIngredientTagExplanations } from '@/lib/ingredients';
import { productCategoryOptions } from '@/lib/options';
import { readLocal, storageKeys } from '@/lib/storage';
import type { IngredientTag, Product, ProductCategory, SkinProfile, WeeklyLog } from '@/types/skinloop';

type BarItem = {
  label: string;
  value: number;
  helper?: string;
};

type TagInsight = {
  tag: IngredientTag;
  businessMeaning: string;
  safeCopy: string;
};

const sampleConcernSignals: BarItem[] = [
  { label: '건조감', value: 68 },
  { label: '민감도', value: 54 },
  { label: '붉어짐', value: 41 },
  { label: '유분감', value: 37 },
  { label: '트러블 경향', value: 32 },
];

const sampleProducts: Product[] = [
  {
    id: 'admin-sample-toner',
    name: 'Demo Lab 진정 토너',
    brand: 'Demo Lab',
    category: 'toner',
    ingredientText: 'Water, Glycerin, Panthenol, Fragrance, Limonene, Phenoxyethanol',
    frequency: '매일 1회',
    createdAt: '2026-06-01T00:00:00.000Z',
    dataSource: 'sample',
    verificationStatus: 'needs-user-review',
  },
  {
    id: 'admin-sample-cream',
    name: 'SkinLoop 장벽 수분 크림',
    brand: 'SkinLoop Lab',
    category: 'moisturizer',
    ingredientText: 'Water, Glycerin, Ceramide NP, Squalane, Sodium Benzoate',
    frequency: '매일 1회',
    createdAt: '2026-06-02T00:00:00.000Z',
    dataSource: 'sample',
    verificationStatus: 'needs-user-review',
  },
  {
    id: 'admin-sample-serum',
    name: 'Routine Lab 각질 케어 세럼',
    brand: 'Routine Lab',
    category: 'serum',
    ingredientText: 'Water, Glycerin, Salicylic Acid, Niacinamide, Phenoxyethanol',
    frequency: '주 2회',
    createdAt: '2026-06-03T00:00:00.000Z',
    dataSource: 'sample',
    verificationStatus: 'needs-user-review',
  },
  {
    id: 'admin-sample-sunscreen',
    name: 'Routine Lab 선케어 젤',
    brand: 'Routine Lab',
    category: 'sunscreen',
    ingredientText: 'Water, Glycerin, Zinc Oxide, Titanium Dioxide, Phenoxyethanol',
    frequency: '매일 1회',
    createdAt: '2026-06-04T00:00:00.000Z',
    dataSource: 'sample',
    verificationStatus: 'needs-user-review',
  },
  {
    id: 'admin-sample-cleanser',
    name: 'Sample Brand 약산성 클렌저',
    brand: 'Sample Brand',
    category: 'cleanser',
    ingredientText: 'Water, Glycerin, Sodium Benzoate, Fragrance, Limonene',
    frequency: '매일 1회',
    createdAt: '2026-06-05T00:00:00.000Z',
    dataSource: 'sample',
    verificationStatus: 'needs-user-review',
  },
];

const sampleLogs: WeeklyLog[] = [
  {
    id: 'admin-sample-log-1',
    createdAt: '2026-05-14T00:00:00.000Z',
    drynessScore: 4,
    oilinessScore: 3,
    rednessScore: 4,
    irritationScore: 4,
    breakoutCount: 3,
    sleepHours: 6,
    stressScore: 4,
    memo: '샘플 집계 기준 기록',
  },
  {
    id: 'admin-sample-log-2',
    createdAt: '2026-05-21T00:00:00.000Z',
    drynessScore: 4,
    oilinessScore: 3,
    rednessScore: 3,
    irritationScore: 3,
    breakoutCount: 2,
    sleepHours: 6.5,
    stressScore: 3,
    memo: '샘플 집계 기준 기록',
  },
  {
    id: 'admin-sample-log-3',
    createdAt: '2026-05-28T00:00:00.000Z',
    drynessScore: 3,
    oilinessScore: 3,
    rednessScore: 3,
    irritationScore: 3,
    breakoutCount: 1,
    sleepHours: 7,
    stressScore: 3,
    memo: '샘플 집계 기준 기록',
  },
  {
    id: 'admin-sample-log-4',
    createdAt: '2026-06-04T00:00:00.000Z',
    drynessScore: 3,
    oilinessScore: 3,
    rednessScore: 2,
    irritationScore: 2,
    breakoutCount: 1,
    sleepHours: 7.5,
    stressScore: 2,
    memo: '샘플 집계 기준 기록',
  },
];

const categoryOrder: ProductCategory[] = ['toner', 'moisturizer', 'serum', 'sunscreen', 'cleanser'];

const tagInsights: TagInsight[] = [
  {
    tag: 'fragrance-related',
    businessMeaning:
      '향 관련 태그가 자주 감지되면, 민감도 기록이 높은 고객에게는 단계적 도입 안내 문구를 제공할 수 있습니다.',
    safeCopy: '제품 적합성을 단정하지 않고 사용 빈도와 체감 기록을 함께 확인하도록 안내합니다.',
  },
  {
    tag: 'exfoliating-acid',
    businessMeaning:
      '각질 케어 산 성분 태그는 사용 요일, 빈도, 다른 제품과의 중복 여부를 설명하는 콘텐츠 기회가 됩니다.',
    safeCopy: '여러 제품을 한 번에 바꾸기보다 루틴 관찰 기준을 제안하는 참고 정보로 표현합니다.',
  },
  {
    tag: 'moisturizing',
    businessMeaning:
      '보습 관련 태그가 많으면 보습/장벽 루틴 콘텐츠, 샘플 세트, 사용 순서 안내를 연결하기 좋습니다.',
    safeCopy: '피부 상태를 확정하지 않고 건조감 기록과 함께 비교할 수 있는 제품 제안 보조 정보입니다.',
  },
  {
    tag: 'preservative',
    businessMeaning:
      '보존 성분 태그는 제품 설명에서 성분 역할을 쉽게 풀어주는 교육형 상세페이지 소재가 될 수 있습니다.',
    safeCopy: '성분 역할을 단순 분류한 MVP 룰이며 안전성 판단이나 개인별 결론이 아닙니다.',
  },
  {
    tag: 'sunscreen',
    businessMeaning:
      '선케어 태그나 카테고리가 낮게 보이면 아침 루틴 체크리스트와 선케어 샘플 신청 CTA를 연결할 수 있습니다.',
    safeCopy: '생활 루틴 기록을 돕는 참고 안내이며 의학적 진단이나 치료를 제공하지 않습니다.',
  },
];

const funnelSteps = [
  { label: '루틴 설문 시작', value: 100 },
  { label: '제품 등록', value: 78 },
  { label: '성분 태그 확인', value: 62 },
  { label: '루틴 추천 확인', value: 48 },
  { label: '샘플 신청 or 구매 CTA', value: 31 },
];

const brandActions = [
  {
    title: '샘플 신청 CTA 연결',
    body: '고객의 관심 카테고리와 성분 태그를 바탕으로 샘플 신청 버튼을 자연스럽게 배치합니다.',
  },
  {
    title: '제품 상세페이지에 루틴 참고 위젯 삽입',
    body: '제품 상세페이지에서 설문, 현재 제품, 성분 태그를 함께 보여주는 B2B2C 위젯으로 확장할 수 있습니다.',
  },
  {
    title: '향 관련 성분 주의 문구 자동 표시',
    body: '향 관련 태그가 있을 때 민감도 기록과 함께 단계적 도입 안내 문구를 보여줍니다.',
  },
  {
    title: '보습/장벽 루틴 콘텐츠 추천',
    body: '건조감 신호가 높은 고객에게 보습 루틴 가이드, 사용 순서, 샘플 구성을 제안할 수 있습니다.',
  },
  {
    title: '재구매 전 4주 로그 기반 리마인드',
    body: '최근 4주 기록을 바탕으로 루틴 유지 여부를 점검하는 리마인드 메시지를 설계할 수 있습니다.',
  },
];

const revenueModels = [
  {
    title: '브랜드용 SaaS 월 구독',
    body: '브랜드가 고객 루틴 인사이트 대시보드와 위젯 설정 기능을 사용하는 구독 모델입니다.',
  },
  {
    title: '추천 후 구매 전환 수수료',
    body: '루틴 참고 결과에서 제품 상세페이지나 커머스 CTA로 이동했을 때 연결 성과를 측정할 수 있습니다.',
  },
  {
    title: '샘플 신청 리드 수집',
    body: '동의 기반 샘플 신청 폼과 고객 관심 카테고리를 연결하는 B2B2C 리드 모델입니다.',
  },
  {
    title: '고객 루틴 인사이트 리포트',
    body: '성분 태그, 카테고리 수요, 반복 기록을 브랜드 기획팀이 읽기 쉬운 리포트로 제공합니다.',
  },
  {
    title: '제품 페이지 전환 개선 위젯',
    body: '제품 상세페이지에 루틴 관찰형 위젯을 삽입해 고객이 제품 정보를 더 쉽게 이해하도록 돕습니다.',
  },
];

export default function AdminInsightsPage() {
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<WeeklyLog[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProfile(readLocal<SkinProfile | null>(storageKeys.profile, null));
    setProducts(readLocal<Product[]>(storageKeys.products, []));
    setLogs(readLocal<WeeklyLog[]>(storageKeys.logs, []));
    setLoaded(true);
  }, []);

  const hasLocalInput = Boolean(profile) || products.length > 0 || logs.length > 0;
  const productsForView = products.length ? products : sampleProducts;
  const logsForView = logs.length ? logs : sampleLogs;
  const dataStatus = getDataStatus(profile, products, logs);
  const dataStatusTone = getDataStatusTone(dataStatus);
  const concernDataLabel = profile ? '로컬 입력 기반 참고 지표' : '샘플 집계 데이터';

  const concernSignals = useMemo(
    () => (profile ? buildConcernSignals(profile) : sampleConcernSignals),
    [profile],
  );
  const categorySignals = useMemo(() => buildCategorySignals(productsForView), [productsForView]);
  const tagCounts = useMemo(() => collectTagsFromProducts(productsForView), [productsForView]);
  const detectedTagCount = useMemo(
    () => getIngredientTagExplanations(productsForView.map((product) => product.ingredientText).join(', ')).length,
    [productsForView],
  );
  const irritationChange = getIrritationChange(logsForView);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Brand insights"
        title="브랜드/관리자 인사이트"
        description="로컬 입력과 데모 샘플을 활용해 고객 고민, 제품 카테고리 수요, 성분 태그 신호를 브랜드 관점으로 보여줍니다."
      >
        <Badge tone={dataStatusTone}>
          {hasLocalInput ? dataStatus : 'Sample fallback'}
        </Badge>
      </SectionHeader>

      <Card className="bg-loop-cloud">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge tone="green">B2B2C story</Badge>
            <h2 className="mt-3 text-2xl font-black text-loop-ink">개인 루틴 관찰에서 브랜드 전환 지원까지</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              SkinLoop은 개인 사용자에게는 루틴 관찰 도구이고, 브랜드에게는 고객 고민·성분 태그·루틴
              반응을 기반으로 제품 제안과 샘플 신청을 연결하는 B2B2C 위젯으로 확장될 수 있습니다.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-black text-loop-ink">데이터 사용 범위</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>이 화면은 MVP 데모용 집계 화면입니다.</li>
              <li>개인 식별 정보는 사용하지 않습니다.</li>
              <li>피부 질환의 진단이나 치료 목적이 아닙니다.</li>
              <li>실제 서비스에서는 동의, 삭제, 보관 기간, 개인정보 처리방침이 필요합니다.</li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <SummaryCard label="등록 사용자 프로필" value={profile ? '1' : '샘플'} tone={profile ? 'green' : 'blue'} />
        <SummaryCard label="등록 제품 수" value={`${productsForView.length}개`} tone={products.length ? 'green' : 'blue'} />
        <SummaryCard label="감지된 성분 태그 수" value={`${detectedTagCount}개`} tone={detectedTagCount ? 'green' : 'slate'} />
        <SummaryCard label="주간 로그 수" value={`${logsForView.length}개`} tone={logs.length ? 'green' : 'blue'} />
        <SummaryCard label="평균 자극감 변화" value={irritationChange} tone="amber" />
        <SummaryCard label="데이터 상태" value={dataStatus} tone={dataStatusTone} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <SectionTitle
            eyebrow={concernDataLabel}
            title="고객 피부 고민 인사이트"
            description="설문 입력값을 브랜드가 읽기 쉬운 관심 신호로 바꿔 보여줍니다."
          />
          <div className="mt-5">
            <BarList items={concernSignals} valueSuffix="%" />
          </div>
        </Card>

        <Card>
          <SectionTitle
            eyebrow={products.length ? '로컬 등록 제품 기준' : '샘플 집계 데이터'}
            title="제품/카테고리 수요 인사이트"
            description="등록 카테고리를 보면 어떤 제품 페이지, 샘플, 콘텐츠를 먼저 보여줄지 정할 수 있습니다."
          />
          <div className="mt-5">
            <BarList items={categorySignals} valueSuffix="%" />
          </div>
          <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
            예를 들어 보습제/크림 등록이 많으면 보습 루틴 콘텐츠와 샘플 신청 CTA를 제품 상세페이지에
            더 눈에 띄게 연결할 수 있습니다.
          </p>
        </Card>
      </section>

      <section>
        <Card>
          <SectionTitle
            eyebrow={products.length ? '감지 태그 기준' : '샘플 태그 기준'}
            title="성분 태그 리스크/기회 인사이트"
            description="성분 태그는 제품 제안 보조와 고객 안내 문구를 설계하는 참고 신호입니다."
          />
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {tagInsights.map((insight) => (
              <TagInsightCard key={insight.tag} insight={insight} count={tagCounts.get(insight.tag) ?? 0} />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <SectionTitle
            eyebrow="데모 퍼널 예시"
            title="전환 퍼널 mock"
            description="실제 통계가 아닌 발표용 예시입니다. 고객 여정의 연결 가능성을 보여줍니다."
          />
          <div className="mt-5 space-y-3">
            {funnelSteps.map((step, index) => (
              <div key={step.label} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-loop-ink">
                    {index + 1}. {step.label}
                  </span>
                  <span className="text-sm font-black text-loop-leaf">{step.value}%</span>
                </div>
                <div className="mt-2 h-3 rounded-md bg-white ring-1 ring-slate-200">
                  <div className="h-full rounded-md bg-loop-leaf" style={{ width: `${step.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle
            eyebrow="Brand actions"
            title="브랜드 액션 제안"
            description="루틴 관찰 데이터를 제품 상세페이지, 샘플 신청, 콘텐츠 추천으로 연결하는 아이디어입니다."
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {brandActions.map((action) => (
              <MiniCard key={action.title} title={action.title} body={action.body} />
            ))}
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <SectionTitle
            eyebrow="Business model"
            title="수익 모델 카드"
            description="숫자는 넣지 않은 개념형 모델입니다. MVP 이후 사업 확장 방향을 설명하는 용도입니다."
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {revenueModels.map((model) => (
              <MiniCard key={model.title} title={model.title} body={model.body} />
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <h2 className="text-xl font-black text-loop-ink">해석 가이드</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          이 화면의 모든 값은 로컬 입력 또는 데모 샘플을 바탕으로 한 참고 지표입니다. 제품 적합성을
          확정하지 않으며, 실제 서비스에서는 사용자 동의와 개인정보 보호 설계가 먼저 필요합니다.
          {!loaded ? ' 데이터를 불러오는 중입니다.' : ''}
        </p>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'green' | 'amber' | 'rose' | 'blue' | 'slate';
}) {
  return (
    <Card>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <div className="mt-3">
        <Badge tone={tone}>{value}</Badge>
      </div>
    </Card>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <Badge tone="slate">{eyebrow}</Badge>
      <h2 className="mt-3 text-xl font-black text-loop-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function BarList({ items, valueSuffix }: { items: BarItem[]; valueSuffix: string }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="grid grid-cols-[128px_1fr_52px] items-center gap-3">
            <span className="text-sm font-semibold text-slate-600">{item.label}</span>
            <div className="h-3 rounded-md bg-slate-100">
              <div className="h-full rounded-md bg-loop-leaf" style={{ width: `${Math.min(100, item.value)}%` }} />
            </div>
            <span className="text-right text-sm font-black text-loop-ink">
              {item.value}
              {valueSuffix}
            </span>
          </div>
          {item.helper ? <p className="mt-1 pl-0 text-xs font-semibold text-slate-500 sm:pl-32">{item.helper}</p> : null}
        </div>
      ))}
    </div>
  );
}

function TagInsightCard({ insight, count }: { insight: TagInsight; count: number }) {
  const rule = ingredientRules.find((item) => item.tag === insight.tag);

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-black text-loop-ink">{tagKoreanLabels[insight.tag]}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">{insight.tag}</p>
        </div>
        <Badge tone={count ? 'amber' : 'slate'}>{count}개</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{insight.businessMeaning}</p>
      <p className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-slate-600">{insight.safeCopy}</p>
      {rule ? <p className="mt-3 text-xs font-semibold text-slate-500">출처: {rule.sourceLabel}</p> : null}
    </article>
  );
}

function MiniCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-base font-black text-loop-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}

function buildConcernSignals(profile: SkinProfile): BarItem[] {
  return [
    { label: '건조감', value: profile.dryness * 20, helper: `${profile.dryness}/5 입력` },
    { label: '민감도', value: profile.sensitivity * 20, helper: `${profile.sensitivity}/5 입력` },
    { label: '붉어짐', value: profile.redness * 20, helper: `${profile.redness}/5 입력` },
    { label: '유분감', value: profile.oiliness * 20, helper: `${profile.oiliness}/5 입력` },
    { label: '트러블 경향', value: profile.breakouts * 20, helper: `${profile.breakouts}/5 입력` },
  ];
}

function buildCategorySignals(products: Product[]): BarItem[] {
  const counts = new Map<ProductCategory, number>();
  products.forEach((product) => {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  });

  const maxCount = Math.max(1, ...Array.from(counts.values()));

  return categoryOrder.map((category) => {
    const label = productCategoryOptions.find((option) => option.value === category)?.label ?? category;
    const count = counts.get(category) ?? 0;

    return {
      label,
      value: Math.round((count / maxCount) * 100),
      helper: `${count}개 등록`,
    };
  });
}

function getIrritationChange(logs: WeeklyLog[]) {
  if (logs.length < 2) return '기록 필요';

  const sortedLogs = [...logs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const first = sortedLogs[0].irritationScore;
  const last = sortedLogs[sortedLogs.length - 1].irritationScore;

  if (last < first) return `${first} → ${last} 감소`;
  if (last > first) return `${first} → ${last} 증가`;
  return `${first} → ${last} 유지`;
}

function getDataStatus(profile: SkinProfile | null, products: Product[], logs: WeeklyLog[]) {
  const hasLocalInput = Boolean(profile) || products.length > 0 || logs.length > 0;
  const hasCompleteLocalInput = Boolean(profile) && products.length > 0 && logs.length > 0;
  const hasSeededDemo =
    profile?.mainGoal === 'barrierCalm' ||
    products.some((product) => product.id.startsWith('demo-product')) ||
    logs.some((log) => log.id.startsWith('demo-log'));

  if (hasSeededDemo) return '로컬 데모';
  if (hasCompleteLocalInput) return '사용자 입력 기준';
  if (hasLocalInput) return '부분 입력 + 샘플 보완';
  return '샘플 집계 데이터';
}

function getDataStatusTone(status: string): 'green' | 'amber' | 'blue' {
  if (status === '로컬 데모' || status === '사용자 입력 기준') return 'green';
  if (status === '부분 입력 + 샘플 보완') return 'amber';
  return 'blue';
}
