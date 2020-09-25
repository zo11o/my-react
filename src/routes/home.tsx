import Loadable from 'react-loadable';
import React from 'react';

interface IArguments {
  isLoading: boolean;
  error: any;
}

const MyLoadingComponent = ({ isLoading, error }: IArguments) => {
  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Handle the error state
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  } else {
    return null;
  }
};

const Home = Loadable({
  loader: () => import('../views/home'),
  loading: MyLoadingComponent,
});

export default Home;
