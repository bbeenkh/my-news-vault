import { TGNewsArticle, TNewsItem } from '@/types';

export const mockGNewsArticle: TGNewsArticle = {
  title: 'scrapped-newsId',
  description: 'test',
  content: 'test content',
  url: 'https://example.com/news/scrapped-newsId',
  image: 'https://img.example.com/test.jpg',
  publishedAt: '2021-08-01T00:00:00Z',
  source: {
    name: 'test',
    url: 'https://example.com',
  },
};

export const mockNewsItem: TNewsItem[] = [
  {
    newsId: 'https://example.com/news/scrapped-newsId',
    datePublished: '2021-08-01',
    description: 'test',
    providerIcon: 'https://www.google.com/s2/favicons?domain=https://example.com&sz=64',
    providerName: 'test',
    thumbnail: 'https://img.example.com/test.jpg',
    title: 'scrapped-newsId',
    isScrapped: false,
    url: 'https://example.com/news/scrapped-newsId',
    searchQuery: 'test-query',
  },
  {
    newsId: 'https://example.com/news/not-scrapped-newsId',
    datePublished: '2021-08-01',
    description: 'test',
    providerIcon: 'test',
    providerName: 'test',
    thumbnail: 'test',
    title: 'not-scrapped-newsId',
    isScrapped: false,
    url: 'https://example.com/news/not-scrapped-newsId',
    searchQuery: 'test-query',
  },
];

export const mockScrappedNewsItem: TNewsItem[] = [
  {
    newsId: 'https://example.com/news/scrapped-newsId',
    datePublished: '2021-08-01',
    description: 'test',
    providerIcon: 'https://www.google.com/s2/favicons?domain=https://example.com&sz=64',
    providerName: 'test',
    thumbnail: 'https://img.example.com/test.jpg',
    title: 'scrapped-newsId',
    isScrapped: true,
    url: 'https://example.com/news/scrapped-newsId',
    searchQuery: 'test-query',
  },
  {
    newsId: 'https://example.com/news/not-scrapped-newsId2',
    datePublished: '2021-08-01',
    description: 'test',
    providerIcon: 'test',
    providerName: 'test',
    thumbnail: 'test',
    title: 'not-scrapped-newsId2',
    isScrapped: true,
    url: 'https://example.com/news/not-scrapped-newsId2',
    searchQuery: 'test-query',
  },
];

export const mockPageProps = {
  query: 'query for test',
  userInfo: {
    setUserInfo: () => {},
    isSignin: false,
    userInfo: null,
  },
};
