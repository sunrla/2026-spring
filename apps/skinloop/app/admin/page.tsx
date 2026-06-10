import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';

const commonConcerns = [
  { label: '건조감', value: 68 },
  { label: '민감도', value: 54 },
  { label: '붉어짐', value: 41 },
  { label: '유분감', value: 37 },
  { label: '트러블 경향', value: 32 },
];

const cautionTags = [
  { label: 'fragrance-related', value: 46 },
  { label: 'exfoliating acid', value: 39 },
  { label: 'potential irritation caution', value: 28 },
  { label: 'preservative', value: 21 },
];

const categories = [
  { label: '세럼/앰플', value: 34 },
  { label: '보습제', value: 29 },
  { label: '선케어', value: 18 },
  { label: '클렌저', value: 14 },
  { label: '토너/미스트', value: 11 },
];

const insightCards = [
  {
    title: '민감도 높은 사용자군',
    body: '향 관련 태그와 자극 가능성 주의 태그가 함께 나타나는 제품 조합을 더 세분화해 볼 가치가 있습니다.',
  },
  {
    title: '보습 루틴 관심',
    body: '건조감 관심도가 높아 보습 제품의 사용 빈도와 주간 피부 로그 변화를 함께 보여주는 기능이 유용할 수 있습니다.',
  },
  {
    title: '선케어 등록 기회',
    body: '선케어 등록 비중이 낮아 아침 루틴 체크리스트에서 선케어 입력을 자연스럽게 유도할 수 있습니다.',
  },
];

function BarList({ items }: { items: Array<{ label: string; value: number }> }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[128px_1fr_44px] items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">{item.label}</span>
          <div className="h-3 rounded-md bg-slate-100">
            <div className="h-full rounded-md bg-loop-leaf" style={{ width: `${item.value}%` }} />
          </div>
          <span className="text-right text-sm font-black text-loop-ink">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminInsightsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Brand insights"
        title="브랜드/관리자 인사이트"
        description="실제 사용자 데이터가 아닌 mock 집계 데이터입니다. 제품 기획과 데모 발표를 위한 샘플 화면입니다."
      >
        <Badge tone="blue">Mock aggregated data</Badge>
      </SectionHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-black text-loop-ink">가장 많은 피부 고민</h2>
          <div className="mt-5">
            <BarList items={commonConcerns} />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-loop-ink">자주 보이는 주의 태그</h2>
          <div className="mt-5">
            <BarList items={cautionTags} />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-loop-ink">많이 등록한 카테고리</h2>
          <div className="mt-5">
            <BarList items={categories} />
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-loop-ink">샘플 비즈니스 인사이트</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {insightCards.map((insight) => (
            <Card key={insight.title}>
              <h3 className="text-lg font-bold text-loop-ink">{insight.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{insight.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
