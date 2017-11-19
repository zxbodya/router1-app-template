import { ScrollManager } from './ScrollManager';

const sm = new ScrollManager();

export function scrollAfterRendered(routingResult) {
  // side effects after state was rendered
  const locationSource = routingResult.location.source;
  const locationHash = routingResult.location.hash;

  // case when scrolling was implicitly disabled in state params
  if (routingResult.location.state.noscroll) return;
  // should scroll only on this location sources
  if (locationSource === 'push' || locationSource === 'replace') {
    let target;
    if (locationHash !== '') {
      target = document.getElementById(locationHash);
    }

    if (target) {
      sm.scrollToElement(target, false);
    } else {
      sm.scrollTo(0, 0, false);
    }
  }
}

export function onHashChange({ hash, source }) {
  sm.cancelScrollAnimation();
  if (source !== 'push' && source !== 'replace') return;
  sm.scrollToAnchor(hash, true);
}
