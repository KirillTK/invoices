import { NextResponse } from 'next/server';
import { CurrencyService } from '~/server/api/currencies';


export async function GET() {
  const currencies = await CurrencyService.getCurrencies();
  
  return NextResponse.json(currencies);
}