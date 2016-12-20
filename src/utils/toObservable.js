import { Observable } from 'rxjs';
import { isPromise } from 'rxjs/util/isPromise';
import { isFunction } from 'rxjs/util/isFunction';

const isObservable = v => isFunction(v.subscribe);

export default function (data) {
  if (isObservable(data)) return data;
  if (isPromise(data)) return Observable.fromPromise(data);
  return Observable.of(data);
}
