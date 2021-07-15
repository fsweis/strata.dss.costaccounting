import React from 'react';
import Unload from '@strata/tempo/lib/unload';
import { AuthProvider } from '@strata/core/lib';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Navigation from './shared/Navigation';
import ErrorBoundary from '@strata/tempo/lib/errorboundary';
import PageLoader from '@strata/tempo/lib/pageloader';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Unload>
        <AuthProvider>
          <BrowserRouter>
            <PageLoader>
              <CookiesProvider>
                <Navigation />
              </CookiesProvider>
            </PageLoader>
          </BrowserRouter>
        </AuthProvider>
      </Unload>
    </ErrorBoundary>
  );
};

export default App;
