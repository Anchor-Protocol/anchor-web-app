import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';

export interface TransactionHistorySectionProps {
  className?: string;
}

export function TransactionHistorySection({
  className,
}: TransactionHistorySectionProps) {
  return (
    <Section className={className}>
      <h2>TRANSACTION HISTORY</h2>

      <ul>
        {Array.from({ length: 20 }, (_, i) => (
          <li key={'listitem' + i}>
            <div className="amount">
              <s>+200 UST</s>
            </div>
            <div className="detail">
              <span>Deposit from terra1...52wpvt</span>
              <time>16:53 12 Oct 2020</time>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
