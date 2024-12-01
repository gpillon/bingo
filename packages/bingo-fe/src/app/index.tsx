import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import '@app/app.css';
import { Login } from '@app/Login/Login';
import { useAuthStore } from './store/authState';
import '@patternfly/react-core/dist/styles/base.css';


const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      {isAuthenticated ? (
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      ) : (
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect to="/login" />
        </Switch>
      )}
    </Router>
  );
};
export default App;
