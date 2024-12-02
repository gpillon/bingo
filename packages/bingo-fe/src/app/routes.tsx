import * as React from 'react';
import { Route, RouteComponentProps, Switch, useLocation } from 'react-router-dom';
import { NotFound } from '@app/NotFound/NotFound';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { GameList } from '@app/Games/GameList';
import { GameView } from '@app/Games/GameView';
import { UserManagement } from '@app/Admin/Users/UserManagement';
import { PriceManagement } from './Admin/Prices/PriceManagement';

let routeFocusTimer: number;
export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
  requiresAdmin?: boolean;

}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    component: Dashboard,
    exact: true,
    label: 'Dashboard',
    path: '/',
    title: 'Bingo | Dashboard',
  },
  {
    component: GameList,
    exact: true,
    label: 'Games',
    path: '/games',
    title: 'Bingo | Games',
  },
  {
    component: GameList,
    exact: true,
    path: '/games/new',
    title: 'Bingo | New Game',
  },
  {
    component: GameView,
    exact: true,
    path: '/games/:id',
    title: 'Bingo | Game',
  },
  // {
  //   component: MyCards,
  //   exact: true,
  //   label: 'My Cards',
  //   path: '/my-cards',
  //   title: 'Bingo | My Cards',
  // },
  {
    label: 'Admin',
    routes: [
      {
        component: UserManagement,
        exact: true,
        label: 'Users',
        path: '/admin/users',
        title: 'Bingo | User Management',
        requiresAdmin: true,
      },
      {
        component: UserManagement,
        path: '/admin/users/new',
        exact: true,
        title: 'Bingo | New User',
        requiresAdmin: true
      },
      {
        component: PriceManagement,
        exact: true,
        label: 'Prize Management',
        path: '/admin/prices',
        title: 'Bingo | Prize Management',
        requiresAdmin: true,
      },
    ],
  },

];

// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
// may not be necessary if https://github.com/ReactTraining/react-router/issues/5210 is resolved
// const useA11yRouteChange = () => {
//   const { pathname } = useLocation();
//   React.useEffect(() => {
//     routeFocusTimer = window.setTimeout(() => {
//       const mainContainer = document.getElementById('primary-app-container');
//       if (mainContainer) {
//         mainContainer.focus();
//       }
//     }, 50);
//     return () => {
//       window.clearTimeout(routeFocusTimer);
//     };
//   }, [pathname]);
// };

const RouteWithTitleUpdates = ({ component: Component, title, ...rest }: IAppRoute) => {
  //useA11yRouteChange();
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} {...rest} />;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Switch>
    {flattenedRoutes.map(({ path, exact, component, title }, idx) => (
      <RouteWithTitleUpdates path={path} exact={exact} component={component} key={idx} title={title} />
    ))}
    <PageNotFound title="404 Page Not Found" />
  </Switch>
);

export { AppRoutes, routes };
