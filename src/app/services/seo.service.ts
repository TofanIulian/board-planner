import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

/**
 * Search engine optimisation service
 *
 * This service creates a standard twitter card dar works fine for most link preview bots
 * Check open graph documentation for metatags: https://ogp.me/
 */
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private title: Title, private meta: Meta, private router: Router) {}

  generateTags({ title = '', description = '', image = '' }) {
    // The title comes form a firestore document so we don't know it until we actually query the doc.
    this.title.setTitle(title);

    this.meta.addTags([
      // Open Graph
      { name: 'og:url', content: `https://board-planner.web.app${this.router.url}` },
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },
      { name: 'og:image', content: image },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@fireship_dev' },
    ]);
  }
}
