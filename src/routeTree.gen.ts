/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as WatchlistRouteImport } from './routes/watchlist'
import { Route as TermsRouteImport } from './routes/terms'
import { Route as PrivacyRouteImport } from './routes/privacy'
import { Route as PriceChartRouteImport } from './routes/price-chart'
import { Route as AboutRouteImport } from './routes/about'
import { Route as IndexRouteImport } from './routes/index'
import { Route as CoinCompareRouteImport } from './routes/coin/compare'
import { Route as CoinCoinIdRouteImport } from './routes/coin/$coinId'

const WatchlistRoute = WatchlistRouteImport.update({
  id: '/watchlist',
  path: '/watchlist',
  getParentRoute: () => rootRouteImport,
} as any)
const TermsRoute = TermsRouteImport.update({
  id: '/terms',
  path: '/terms',
  getParentRoute: () => rootRouteImport,
} as any)
const PrivacyRoute = PrivacyRouteImport.update({
  id: '/privacy',
  path: '/privacy',
  getParentRoute: () => rootRouteImport,
} as any)
const PriceChartRoute = PriceChartRouteImport.update({
  id: '/price-chart',
  path: '/price-chart',
  getParentRoute: () => rootRouteImport,
} as any)
const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const CoinCompareRoute = CoinCompareRouteImport.update({
  id: '/coin/compare',
  path: '/coin/compare',
  getParentRoute: () => rootRouteImport,
} as any)
const CoinCoinIdRoute = CoinCoinIdRouteImport.update({
  id: '/coin/$coinId',
  path: '/coin/$coinId',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/price-chart': typeof PriceChartRoute
  '/privacy': typeof PrivacyRoute
  '/terms': typeof TermsRoute
  '/watchlist': typeof WatchlistRoute
  '/coin/$coinId': typeof CoinCoinIdRoute
  '/coin/compare': typeof CoinCompareRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/price-chart': typeof PriceChartRoute
  '/privacy': typeof PrivacyRoute
  '/terms': typeof TermsRoute
  '/watchlist': typeof WatchlistRoute
  '/coin/$coinId': typeof CoinCoinIdRoute
  '/coin/compare': typeof CoinCompareRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/price-chart': typeof PriceChartRoute
  '/privacy': typeof PrivacyRoute
  '/terms': typeof TermsRoute
  '/watchlist': typeof WatchlistRoute
  '/coin/$coinId': typeof CoinCoinIdRoute
  '/coin/compare': typeof CoinCompareRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/price-chart'
    | '/privacy'
    | '/terms'
    | '/watchlist'
    | '/coin/$coinId'
    | '/coin/compare'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/price-chart'
    | '/privacy'
    | '/terms'
    | '/watchlist'
    | '/coin/$coinId'
    | '/coin/compare'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/price-chart'
    | '/privacy'
    | '/terms'
    | '/watchlist'
    | '/coin/$coinId'
    | '/coin/compare'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  PriceChartRoute: typeof PriceChartRoute
  PrivacyRoute: typeof PrivacyRoute
  TermsRoute: typeof TermsRoute
  WatchlistRoute: typeof WatchlistRoute
  CoinCoinIdRoute: typeof CoinCoinIdRoute
  CoinCompareRoute: typeof CoinCompareRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/watchlist': {
      id: '/watchlist'
      path: '/watchlist'
      fullPath: '/watchlist'
      preLoaderRoute: typeof WatchlistRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/terms': {
      id: '/terms'
      path: '/terms'
      fullPath: '/terms'
      preLoaderRoute: typeof TermsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/privacy': {
      id: '/privacy'
      path: '/privacy'
      fullPath: '/privacy'
      preLoaderRoute: typeof PrivacyRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/price-chart': {
      id: '/price-chart'
      path: '/price-chart'
      fullPath: '/price-chart'
      preLoaderRoute: typeof PriceChartRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/coin/compare': {
      id: '/coin/compare'
      path: '/coin/compare'
      fullPath: '/coin/compare'
      preLoaderRoute: typeof CoinCompareRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/coin/$coinId': {
      id: '/coin/$coinId'
      path: '/coin/$coinId'
      fullPath: '/coin/$coinId'
      preLoaderRoute: typeof CoinCoinIdRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  PriceChartRoute: PriceChartRoute,
  PrivacyRoute: PrivacyRoute,
  TermsRoute: TermsRoute,
  WatchlistRoute: WatchlistRoute,
  CoinCoinIdRoute: CoinCoinIdRoute,
  CoinCompareRoute: CoinCompareRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
