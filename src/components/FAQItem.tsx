export function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index?: number;
}) {
  return (
    <details className="group border-b border-ink/15">
      <summary className="flex items-start justify-between gap-6 py-6">
        <span className="flex items-baseline gap-4">
          {typeof index === 'number' && (
            <span className="font-mono text-[10px] text-ochre">{String(index + 1).padStart(2, '0')}</span>
          )}
          <span className="font-display text-xl leading-snug text-ink sm:text-[22px]">{question}</span>
        </span>
        <span className="relative mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center">
          <span className="absolute h-px w-4 bg-ink" aria-hidden="true" />
          <span
            className="absolute h-4 w-px bg-ink transition-transform duration-300 group-open:rotate-90 group-open:opacity-0"
            aria-hidden="true"
          />
        </span>
      </summary>
      <div className="pb-7 pl-0 sm:pl-8">
        <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft">{answer}</p>
      </div>
    </details>
  );
}
