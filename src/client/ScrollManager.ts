type EasingFunction = (t: number, b: number, c: number, d: number) => number;

const easeInOutQuad: EasingFunction = (t, b, c, d) => {
  // t: current time, b: beginning value, c: change in value, d: duration
  // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

const noop = () => undefined;

export class ScrollManager {
  public cancelScrollAnimation: () => void;
  private readonly easing: EasingFunction;
  private readonly duration: number;
  private cancel: boolean = false;
  constructor(options: { easing?: EasingFunction; duration?: number } = {}) {
    this.cancelScrollAnimation = noop;
    this.easing = options.easing || easeInOutQuad;
    this.duration = options.duration || 400;
  }

  public animateScroll(left: number, top: number, done: () => void) {
    this.cancelScrollAnimation();

    const startTime = Date.now();
    const startTop = window.pageYOffset;
    const startLeft = window.pageXOffset;

    this.cancel = false;

    let id: number;
    const animate = () => {
      if (this.cancel) {
        return;
      }
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
        id = window.requestAnimationFrame(animate);
      }
    };

    animate();

    this.cancelScrollAnimation = () => {
      this.cancel = true;
      window.cancelAnimationFrame(id);
      this.cancelScrollAnimation = noop;
      done();
    };
  }

  public scrollTo(left: number, top: number, animate?: boolean) {
    this.cancelScrollAnimation();
    if (animate) {
      const onWheelListener = () => this.cancelScrollAnimation();
      window.addEventListener('wheel', onWheelListener);
      this.animateScroll(left, top, () => {
        window.removeEventListener('wheel', onWheelListener);
      });
    } else {
      window.requestAnimationFrame(() => {
        window.scrollTo(left, top);
      });
    }
  }

  public scrollToElement(target: Element, animate?: boolean) {
    this.cancelScrollAnimation();
    if (!target.ownerDocument || !target.ownerDocument.documentElement) {
      return;
    }
    const documentElement = target.ownerDocument.documentElement;
    const boundingClientRect = target.getBoundingClientRect();
    this.scrollTo(
      window.pageXOffset + boundingClientRect.left - documentElement.clientLeft,
      window.pageYOffset + boundingClientRect.top - documentElement.clientTop,
      animate
    );
  }

  public scrollToAnchor(anchor: string, animate?: boolean) {
    const target = document.getElementById(anchor);
    if (target) {
      this.scrollToElement(target, animate);
      return true;
    }
    this.cancelScrollAnimation();
    return false;
  }
}
