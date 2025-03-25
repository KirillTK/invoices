import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/components/card/card';
import { CURRENCY } from '~/shared/constants/currency.const';
import { FormatterUtils } from '~/shared/utils/formatter';


export interface StatisticCardProps {
  title: string;
  value: number;
  change: number;
  currency?: CURRENCY;
}

export function StatisticCard({ title, value, change, currency = CURRENCY.USD }: StatisticCardProps) {
  const formattedValue = FormatterUtils.fromNumberToMoney(value, currency);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">
          {formattedValue}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from previous period
        </p>
      </CardContent>
    </Card>
  );
}
