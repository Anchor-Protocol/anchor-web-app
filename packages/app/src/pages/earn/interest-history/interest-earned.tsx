import React from 'react'
import Amount from '../../../components/amount'

export enum InterestEarnedPeriod {
  TOTAL,
  YEAR,
  MONTH,
  WEEK,
  DAY
}

interface InterestEarnedProps {
  type: InterestEarnedPeriod,
  interestEarned: number,
}

const InterestEarned: React.FunctionComponent<InterestEarnedProps> = ({
  children,
}) => {
  return (
    <div>
      <header>
        <ul>
          <li>Total</li>
          <li>Year</li>
          <li>Month</li>
          <li>Week</li>
          <li>Day</li>
        </ul>
      </header>
      <article>
        <header>
          Interest Earned
        </header>
        <div>
          <Amount amount={1234569289} denom={"UST"}/>
          ~=
          <Amount amount={1234569} denom={"aUST"}/>
        </div>
      </article>
    </div>
  )
}

export default InterestEarned