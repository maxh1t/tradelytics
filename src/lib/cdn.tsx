'use client'
import { Config, Theme, CDPReactProvider } from '@coinbase/cdp-react'
import { PropsWithChildren } from 'react'

const config: Config = {
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID!,
  ethereum: {
    createOnLogin: 'smart',
  },
  appName: 'Tradelytics',
  appLogoUrl: 'http://localhost:3000/logo.svg',
  authMethods: ['email', 'sms', 'oauth:google', 'oauth:apple', 'oauth:x'],
  showCoinbaseFooter: true,
}

const theme: Partial<Theme> = {
  'colors-bg-default': '#ffffff',
  'colors-bg-alternate': '#eef0f3',
  'colors-bg-primary': '#0052ff',
  'colors-bg-secondary': '#eef0f3',
  'colors-fg-default': '#0a0b0d',
  'colors-fg-muted': '#5b616e',
  'colors-fg-primary': '#0052ff',
  'colors-fg-onPrimary': '#ffffff',
  'colors-fg-onSecondary': '#0a0b0d',
  'colors-fg-positive': '#098551',
  'colors-fg-negative': '#cf202f',
  'colors-fg-warning': '#ed702f',
  'colors-line-default': '#dcdfe4',
  'colors-line-heavy': '#9397a0',
  'borderRadius-cta': 'var(--cdp-web-borderRadius-md)',
  'borderRadius-link': 'var(--cdp-web-borderRadius-md)',
  'borderRadius-input': 'var(--cdp-web-borderRadius-md)',
  'borderRadius-select-trigger': 'var(--cdp-web-borderRadius-md)',
  'borderRadius-select-list': 'var(--cdp-web-borderRadius-md)',
  'borderRadius-modal': 'var(--cdp-web-borderRadius-md)',
}

export function CDPProvider({ children }: PropsWithChildren) {
  return (
    <CDPReactProvider config={config} theme={theme}>
      {children}
    </CDPReactProvider>
  )
}
