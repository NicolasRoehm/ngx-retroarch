// Angular modules
import { Injectable } from '@angular/core';

/**
 * Responsive Components: a Solution to the Container Queries Problem
 * https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/
 *
 * Until https://caniuse.com/css-container-queries
 */
@Injectable()
export class ContainerQueryHelper
{
  // Default breakpoints that should apply to all observed
  // elements that don't define their own custom breakpoints.
  private static defaultBreakpoints = {
    sm : 384,
    md : 576,
    lg : 768,
    xl : 960,
  };

  public static watchResize() : void
  {
    // Only run if ResizeObserver is supported.
    if (!('ResizeObserver' in self))
      return;

    // Create a single ResizeObserver instance to handle all
    // container elements. The instance is created with a callback,
    // which is invoked as soon as an element is observed as well
    // as any time that element's size changes.
    const ro = new ResizeObserver((entries : ResizeObserverEntry[]) =>
    {
      entries.forEach((entry) =>
      {
        // If breakpoints are defined on the observed element,
        // use them. Otherwise use the defaults.
        const breakpoints = (entry.target as HTMLElement).dataset.breakpoints ?
            JSON.parse((entry.target as HTMLElement).dataset.breakpoints) :
            this.defaultBreakpoints;

        // Update the matching breakpoints on the observed element.
        Object.keys(breakpoints).forEach((breakpoint) =>
        {
          const minWidth = breakpoints[breakpoint];
          if (entry.contentRect.width >= minWidth)
            entry.target.classList.add(breakpoint);
          else
            entry.target.classList.remove(breakpoint);
        });
      });
    });

    // Find all elements with the `data-observe-resizes` attribute
    // and start observing them.
    const elements = document.querySelectorAll('[data-observe-resizes]');
    for (let element, i = 0; element = elements[i]; i++)
      ro.observe(element);
  }
}
