import Loadable from 'react-loadable';
import LoadingComponent from './loading-component';
// interface IArguments {
//   isLoading: boolean;
//   error: any;
// }

// const Home = () => <div>home</div>
// const Loading = (a,b) => <div>sdf</div>;

export const User = Loadable({
  loader: () => import('../views/user'),
  loading: LoadingComponent,
});

export default User;
