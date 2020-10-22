import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';

export default function Home(props: any) {
  return (
    <div className="views-home">
      Home
      <Link to="/user">去往用户中序</Link>
    </div>
  );
}
