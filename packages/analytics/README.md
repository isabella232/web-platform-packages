## `@hashicorp/platform-analytics`

Utilities for collecting analytics from our applications.

### `usePageviewAnalytics({ siteId?: string, includedDomains?: string })`

Sets up pageviews to be tracked by listening to router events, currently done with [Fathom](https://usefathom.com). Needs two environment variables to be set:

- `NEXT_PUBLIC_FATHOM_SITE_ID` - The site ID for the application in Fathom
- `NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS` - A space-separated list of domains that are eligible for tracking.

Alternatively, you can pass in an options object with `siteId` and `includedDomains`:

```js
usePageviewAnalytics({
  siteId: '1234',
  includedDomains: 'example.com example2.com',
})
```
