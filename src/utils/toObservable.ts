import { from, of } from 'rxjs';

export default function(data: any) {
  let t;
  try {
    t = from(data);
  } catch (e) {
    t = of(data);
  }
  return t;
}
