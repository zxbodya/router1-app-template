import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { isPromise } from 'rxjs/util/isPromise';
import { isFunction } from 'rxjs/util/isFunction';

const isObservable = v => isFunction(v.subscribe);

export default function(data) {
  if (isObservable(data)) return data;
  if (isPromise(data)) return fromPromise(data);
  return of(data);
}
