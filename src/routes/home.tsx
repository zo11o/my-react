import Loadable from 'react-loadable';

const Home = Loadable({
  loader: () => import('../views/home'),
  loading: MyLoadingComponent,
});

export default Home;
