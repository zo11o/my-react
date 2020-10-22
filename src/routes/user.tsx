import Loadable from 'react-loadable';
import LoadingComponent from './loading-component';

export const User = Loadable({
  loader: () => import('../views/user'),
  loading: LoadingComponent,
});

export default User;
