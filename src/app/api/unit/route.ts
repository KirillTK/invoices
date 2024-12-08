

import { NextResponse } from 'next/server';
import { UnitsService } from "~/server/routes/units/units.route";

export async function GET() {
  const units = await UnitsService.getUnits();
  return NextResponse.json(units);
}
