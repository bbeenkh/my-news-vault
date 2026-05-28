import { mockGNewsRes, mockScarpNewsList } from '@/mock';
import { HttpResponse, http } from 'msw';

export const mswTestHandler = [
  http.get('https://jsonplaceholder.typicode.com/posts', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('_page')) || 1;
    const limit = Number(url.searchParams.get('_limit')) || 10;
    const mockPosts = generateMockPosts(page, limit);
    return HttpResponse.json(mockPosts, { status: 200 });
  }),
];

export default [
  // fetchGNews
  http.get('https://gnews.io/api/v4/search', () => {
    return HttpResponse.json(mockGNewsRes, { status: 200 });
  }),

  // fetchScrappedList
  http.get('/api/scrap', () => {
    return HttpResponse.json(mockScarpNewsList, { status: 200 });
  }),

  // scrapNews
  http.patch('/api/scrap', () => {
    return HttpResponse.json({ data: 'success from msw' }, { status: 201 });
  }),

  // unscrapNews
  http.delete('/api/scrap', () => {
    return HttpResponse.json({ data: 'success from msw' }, { status: 201 });
  }),
];

function generateMockPosts(page: number, limit = 10) {
  const startId = (page - 1) * limit + 1;
  return Array.from({ length: limit }, (_, index) => {
    const id = startId + index;
    return {
      userId: Math.ceil(id / 5),
      id,
      title: `Mock Title #${id}`,
      body: `This is the body of mock post #${id}. Lorem ipsum dolor sit amet.`,
    };
  });
}
