import { Observable } from 'rx';
import toObservable from './toObservable';

describe('toObservable', () => {
  it('wraps object', done => {
    toObservable({ a: 1 })
      .forEach(v => {
        expect(v).toEqual({ a: 1 });
        done();
      });
  });

  it('wraps promise', done => {
    toObservable(new Promise(r => r({ a: 1 })))
      .forEach(v => {
        expect(v).toEqual({ a: 1 });
        done();
      });
  });

  it('wraps observable', done => {
    toObservable(Observable.return({ a: 1 }))
      .forEach(v => {
        expect(v).toEqual({ a: 1 });
        done();
      });
  });
});
