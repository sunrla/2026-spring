import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';

const featureCards = [
  {
    title: '설문 기반 루틴 맥락',
    body: '건조감, 유분감, 민감도, 붉어짐, 트러블 경향, 목표를 한 번에 정리합니다.',
  },
  {
    title: '성분 텍스트 파싱',
    body: '쉼표로 구분된 성분명을 태그로 바꿔 루틴에서 관찰할 포인트를 찾습니다.',
  },
  {
    title: '주간 기록과 변화 확인',
    body: '피부 느낌, 수면, 스트레스, 메모를 함께 저장해 루틴 실험 기록으로 남깁니다.',
  },
];

const steps = ['설문 저장', '제품 등록', '성분 태그 확인', '루틴 위험도 참고', '주간 기록'];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div className="flex flex-col justify-center">
          <Badge tone="green">School project MVP</Badge>
          <h1 className="mt-4 text-4xl font-black tracking-normal text-loop-ink sm:text-5xl">
            SkinLoop
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            SkinLoop는 현재 스킨케어 루틴을 기록하고, 제품 성분 태그와 주간 피부 로그를 함께 보며
            제품 핏을 참고할 수 있게 돕는 루틴 실험 플랫폼입니다.
          </p>
          <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-800">
            이 서비스는 의학적 진단이나 치료를 제공하지 않습니다.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/survey"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-loop-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              설문 시작하기
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-500"
            >
              제품 등록하기
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-loop-cloud p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-loop-leaf">Routine Loop</p>
              <p className="mt-1 text-xl font-bold text-loop-ink">이번 주 관찰 요약</p>
            </div>
            <Badge tone="blue">Mock</Badge>
          </div>
          <div className="mt-6 space-y-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-sm font-black text-loop-leaf ring-1 ring-slate-200">
                  {index + 1}
                </div>
                <div className="h-3 flex-1 rounded-md bg-white ring-1 ring-slate-200">
                  <div
                    className="h-full rounded-md bg-loop-leaf"
                    style={{ width: `${55 + index * 9}%` }}
                  />
                </div>
                <span className="w-28 text-sm font-semibold text-slate-700">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {['Low', 'Medium', 'Caution'].map((level) => (
              <div key={level} className="rounded-md border border-slate-200 bg-white p-3 text-center">
                <p className="text-xs font-semibold text-slate-500">Risk</p>
                <p className="mt-1 text-sm font-black text-loop-ink">{level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="MVP scope"
          title="로컬에서 먼저 검증하는 루틴 실험"
          description="현재 버전은 외부 API, 실제 AI 호출, 백엔드, 인증 없이 브라우저 localStorage에만 저장합니다."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title}>
              <h2 className="text-lg font-bold text-loop-ink">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
