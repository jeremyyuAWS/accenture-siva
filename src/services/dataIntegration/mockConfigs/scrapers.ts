import { ScraperConfig } from '../types';

export const defaultScrapers: ScraperConfig[] = [
  {
    id: 'techcrunch-scraper',
    name: 'TechCrunch Scraper',
    targetUrl: 'https://techcrunch.com/category/fundings-exits/',
    selectors: {
      articles: 'article.post-block',
      title: '.post-block__title a',
      url: '.post-block__title a',
      date: 'time',
      content: '.post-block__content'
    },
    frequency: 'daily',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  {
    id: 'sec-filings-scraper',
    name: 'SEC Filings Scraper',
    targetUrl: 'https://www.sec.gov/edgar/search/',
    selectors: {
      filings: '.filing',
      companyName: '.company-name',
      filingType: '.filing-type',
      filingDate: '.filing-date',
      url: '.filing-link'
    },
    frequency: 'daily',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  {
    id: 'venturebeat-scraper',
    name: 'VentureBeat Scraper',
    targetUrl: 'https://venturebeat.com/category/funding/',
    selectors: {
      articles: 'article',
      title: 'h2 a',
      url: 'h2 a',
      date: 'time',
      content: '.article-content'
    },
    frequency: 'daily',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
];