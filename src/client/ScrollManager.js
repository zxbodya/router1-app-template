import raf from 'raf';

/* eslint-disable */
const easeInOutQuad = (t, b, c, d) => {
  // t: current time, b: beginning value, c: change in value, d: duration
  // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
/* eslint-enable */

const noop = () => {};

export class ScrollManager {
  constructor(options = {}) {
    this.cancelScrollAnimation = noop;
    this.easing = options.easing || easeInOutQuad;
    this.duration = options.duration || 400;
  }

  animateScroll(left, top, done) {
    this.cancelScrollAnimation();

    const startTime = Date.now();
    const startTop = window.pageYOffset;
    const startLeft = window.pageXOffset;

    this.cancel = false;

    let id;
    const animate = () => {
      if (this.cancel) return;
      const elapsed = Date.now() - startTime;
      if (this.duration <= elapsed) {
        window.scrollTo(left, top);
        this.cancelScrollAnimation = noop;
        done();
      } else {
        window.scrollTo(
          this.easing(elapsed, startLeft, left - startLeft, this.duration),
          this.easing(elapsed, startTop, top - startTop, this.duration)
        );
        id = raf(animate);
      }
    };

    animate();

    this.cancelScrollAnimation = () => {
      this.cancel = true;
      raf.cancel(id);
      this.cancelScrollAnimation = noop;
      done();
    };
  }

  scrollTo(left, top, animate) {
    if (animate) {
      const onWheelListener = () => this.cancelScrollAnimation();
      window.addEventListener('wheel', onWheelListener);
      this.animateScroll(left, top, () => {
        window.removeEventListener('wheel', onWheelListener);
      });
    } else {
      this.cancelScrollAnimation();
      raf(() => {
        window.scrollTo(left, top);
      });
    }
  }

  scrollToElement(target, animate) {
    const documentElement = target.ownerDocument.documentElement;
    const boundingClientRect = target.getBoundingClientRect();
    this.scrollTo(
      window.pageXOffset + boundingClientRect.left - documentElement.clientLeft,
      window.pageYOffset + boundingClientRect.top - documentElement.clientTop,
      animate
    );
  }

  scrollToAnchor(anchor, animate) {
    const target = document.getElementById(anchor);
    if (target) {
      this.scrollToElement(target, animate);
      return true;
    }
    this.cancelScrollAnimation();
    return false;
  }
}
