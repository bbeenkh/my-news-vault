import GNewsAPI from '@/api/GNewsAPI';
import { TGNewsAPIRes } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  const max = req.nextUrl.searchParams.get('max') ?? '10';
  const page = req.nextUrl.searchParams.get('page') ?? '1';

  if (!q) {
    return NextResponse.json({ message: 'query(q) is required' }, { status: 400 });
  }

  try {
    const res = await GNewsAPI.get<TGNewsAPIRes>('search', {
      params: { q, max, page },
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch news' }, { status: 500 });
  }
}
