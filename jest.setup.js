import { TextEncoder, TextDecoder } from 'util';
import { TransformStream } from 'stream/web';
import { BroadcastChannel } from 'worker_threads';
import '@testing-library/jest-dom/extend-expect';
import 'cross-fetch/polyfill';
// test환경에 없는 브라우저 api를 전역객체로 설정
// msw2.0 & jest 연동중 발생
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.TransformStream = TransformStream;
global.BroadcastChannel = BroadcastChannel;

// lodash-es mock (ESM incompatible with Jest)
jest.mock('lodash-es', () => ({
  flatMap: (arr, fn) => (arr || []).flatMap(fn || ((x) => x)),
  debounce: (fn) => fn,
  throttle: (fn) => fn,
}));

// firebase mock (ESM incompatible with Jest)
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));
jest.mock('firebase/firestore/lite', () => ({
  doc: jest.fn(),
  getDocs: jest.fn(),
  collection: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
  getFirestore: jest.fn(() => ({})),
}));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(function () {}),
}));
jest.mock('@/firebase', () => ({ database: {}, auth: {}, googleProvider: {} }));

// next/router mock
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {
      query: '테스트검색',
    },
  }),
}));

// intersection observer mock
window.IntersectionObserver = jest.fn(function () {
  this.observe = jest.fn();
  this.unobserve = jest.fn();
  this.disconnect = jest.fn();
});
