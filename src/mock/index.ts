import { TGNewsAPIRes, TNewsItem } from '@/types';

export const mockGNewsRes: TGNewsAPIRes = {
  totalArticles: 3,
  articles: [
    {
      title: '#MOCK TEST',
      description:
        "As the days get shorter and the nights chillier, it's a great time to stock up for winter.",
      content: 'Full article content here...',
      url: 'https://finance.yahoo.com/news/17-walmart-items-retirees-stock-130152895.html',
      image: 'https://media.zenfs.com/en/gobankingrates_644/abc123.jpg',
      publishedAt: '2024-09-23T13:01:00Z',
      source: { name: 'Yahoo Finance', url: 'https://finance.yahoo.com' },
    },
    {
      title: 'Mental Health Minute: Local artists release song centered on emotional well-being',
      description: 'Local artists have released a new song focused on mental health awareness.',
      content: 'Full article content here...',
      url: 'https://www.msn.com/en-us/health/other/mental-health-minute/ar-AA1r8WM4',
      image: 'https://img-s-msn-com.example.com/tenant/amp/entityid/AA1r8WM4.img',
      publishedAt: '2024-09-23T12:30:00Z',
      source: { name: 'MSN', url: 'https://www.msn.com' },
    },
    {
      title: 'Tech Giants Report Record Profits in Q3 2024',
      description: 'Major technology companies have reported unprecedented profits this quarter.',
      content: 'Full article content here...',
      url: 'https://techcrunch.com/2024/09/23/tech-giants-q3-profits',
      image: 'https://techcrunch.com/wp-content/uploads/2024/09/tech-q3.jpg',
      publishedAt: '2024-09-23T11:00:00Z',
      source: { name: 'TechCrunch', url: 'https://techcrunch.com' },
    },
  ],
};

export const mockScarpNewsList: TNewsItem[] = [
  {
    newsId: 'https://finance.yahoo.com/news/17-walmart-items-retirees-stock-130152895.html',
    datePublished: '2024-09-23',
    description: "It's a great time to stock up for winter.",
    providerIcon:
      'https://www.google.com/s2/favicons?domain=https://finance.yahoo.com&sz=64',
    providerName: 'Yahoo Finance',
    thumbnail: 'https://media.zenfs.com/en/gobankingrates_644/abc123.jpg',
    title: '#MOCK TEST',
    isScrapped: true,
    url: 'https://finance.yahoo.com/news/17-walmart-items-retirees-stock-130152895.html',
    searchQuery: '',
  },
];
