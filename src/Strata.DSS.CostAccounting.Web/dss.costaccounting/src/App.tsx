import React from 'react';
import Unload from '@strata/tempo/lib/unload';
import { AuthProvider } from '@strata/core/lib';
import { BrowserRouter } from 'react-router-dom';
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
              <Navigation />
            </PageLoader>
          </BrowserRouter>
        </AuthProvider>
      </Unload>
    </ErrorBoundary>
  );
};

export default App;
