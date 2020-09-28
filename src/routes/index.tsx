import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Home, HomeDetail } from './home';
import { User } from './user';

const NotFound = () => <div>无此页面</div>;

// const notFound = {
//     path: "*",
//     component: NotFound,
// };

const routes = [
  {
    path: '/home',
    component: Home,
    routes: [
      {
        path: '/home/detail',
        component: HomeDetail,
      },
    ],
  },
  {
    user: '/user',
    component: User,
  },
  {
    path: '*',
    component: NotFound,
  },
];
// routes.push(notFound);

interface IChildProps {
  childProps: any;
}

// const NotFound = () => <div>无此页面</div>;

function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

const Routes = ({ childProps }: IChildProps) => (
  <Router>
    {/* <Switch>
            <Route path="/" exact component={Home} props={childProps} />
            <Route component={NotFound} />
        </Switch> */}
    <Switch>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </Switch>
  </Router>
);

export default Routes;
