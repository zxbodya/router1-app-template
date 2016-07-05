import raf from 'raf';
import { Observable } from 'rx';

/*eslint-disable */
const easeInOutQuad = (t, b, c, d) => {
  // t: current time, b: beginning value, c: change in value, d: duration
  // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
/*eslint-enable */

export class ScrollManager {
  constructor(options = {}) {
    this.scrollAnimationDispose = null;
    this.easing = options.easing || easeInOutQuad;
    this.duration = options.duration || 400;
  }

  cancelScrollAnimation() {
    if (this.scrollAnimationDispose) {
      this.scrollAnimationDispose.dispose();
    }
  }

  animateScroll(left, top) {
    const startTime = Date.now();
    const startTop = window.pageYOffset;
    const startLeft = window.pageXOffset;

    let cancel = false;

    return Observable.create((observer) => {
      console.log('create');
      let id;
      const animate = () => {
        console.log('step');
        if (cancel) return;
        const elapsed = Date.now() - startTime;
        if (this.duration <= elapsed) {
          window.scrollTo(left, top);
          observer.onCompleted();
        } else {
          window.scrollTo(
            this.easing(elapsed, startLeft, left - startLeft, this.duration),
            this.easing(elapsed, startTop, top - startTop, this.duration)
          );
          id = raf(animate);
        }
      };

      animate();
      return () => {
        cancel = true;
        raf.cancel(id);
      };
    });
  }

  scrollTo(top, left, animate) {
    if (animate) {
      this.scrollAnimationDispose = this.animateScroll(left, top)
        .takeUntil(Observable.fromEvent(window, 'wheel'))
        .subscribe();
    } else {
      setTimeout(() => {
        window.scrollTo(left, top);
      });
    }
  }

  scrollToElement(target, animate) {
    this.scrollTo(
      window.pageXOffset + target.getBoundingClientRect().left,
      window.pageYOffset + target.getBoundingClientRect().top,
      animate
    );
  }

  scrollToAnchor(anchor, animate) {
    const target = document.getElementById(anchor.substr(1));
    if (target) {
      this.scrollToElement(target, animate);
      return true;
    }
    return false;
  }
}
