import { NextResponse } from 'next/server';

interface HealthCheckResponse {
  ok: boolean;
  message: string;
}

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const response: HealthCheckResponse = {
    ok: true,
    message: 'Household Profiler API is live'
  };
  
  return NextResponse.json(response);
}
