import { focusManager } from 'react-query';

/**
 * change the behavior of refetch data after user's inactive
 *
 * the default react-query refetch strategy uses visibilitychange and focus events.
 * it make too many data fetching.
 * this patch will decrease the data fetching.
 *
 * @see https://caniuse.com/mdn-api_document_visibilitychange_event
 */
export function patchReactQueryFocusRefetching(
  refetchInactiveTime: number = 1000 * 60,
) {
  focusManager.setEventListener((handleFocus) => {
    let lastInvisibleTime = -1;

    function onVisibilityChange() {
      if (document.hidden) {
        lastInvisibleTime = Date.now();
      } else if (lastInvisibleTime > 0) {
        const t = Date.now() - lastInvisibleTime;
        if (t > refetchInactiveTime) {
          handleFocus(true);
        }
        lastInvisibleTime = -1;
      }
    }

    if (typeof window !== 'undefined' && window.addEventListener) {
      document.addEventListener('visibilitychange', onVisibilityChange, false);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });
}
