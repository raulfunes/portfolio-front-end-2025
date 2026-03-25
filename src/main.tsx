import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/index.ts'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { EditModeProvider } from './contexts/EditModeContext.tsx'
import { inject } from '@vercel/analytics'

inject()

// Sync <html lang=""> with the active i18n language for SEO
document.documentElement.lang = i18n.language?.split('-')[0] ?? 'es'
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.split('-')[0]
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <EditModeProvider>
          <App />
        </EditModeProvider>
      </AuthProvider>
    </I18nextProvider>
  </StrictMode>,
)
