import { of } from 'rxjs/observable/of';
import toObservable from './toObservable';

describe('toObservable', () => {
  it('wraps object', done => {
    toObservable({ a: 1 })
      .subscribe(v => {
        expect(v).toEqual({ a: 1 });
        done();
      });
  });

  it('wraps promise', done => {
    toObservable(new Promise(r => r({ a: 1 })))
      .subscribe(v => {
        expect(v).toEqual({ a: 1 });
        done();
      });
  });

  it('wraps observable', done => {
    toObservable(of({ a: 1 }))
      .subscribe(v => {
        expect(v).toEqual({ a: 1 });
        done();
      });
  });
});
