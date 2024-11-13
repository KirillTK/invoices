import { NextResponse } from 'next/server';
import { CurrencyService } from '~/server/routes/currencies/currencies.route';


export async function GET() {
  const currencies = await CurrencyService.getCurrencies();
  
  return NextResponse.json(currencies);
}