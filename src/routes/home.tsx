import React from 'react';
import Loadable from 'react-loadable';
import LoadingComponent from './loading-component';
// interface IArguments {
//   isLoading: boolean;
//   error: any;
// }

// export const Home = Loadable({
//     loader: () => import("../views/home"),
//     loading: LoadingComponent,
// });

// export const HomeDetail = Loadable({
//     loader: () => import("../views/home/detail"),
//     loading: LoadingComponent,
// });

export const Home = () => <div>home</div>;
export const HomeDetail = () => <div>detail</div>;

const home = {
  path: '/home',
  component: Home,
  routes: [
    {
      path: '/home/detail',
      component: HomeDetail,
    },
  ],
};

export default home;
