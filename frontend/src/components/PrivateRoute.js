// frontend/src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// This component takes another component as its "child".
const PrivateRoute = ({ children }) => {
  // We check our "information desk" (AuthContext) to see if there's a token.
  const { token } = useContext(AuthContext);

  // If there IS a token, the user is logged in. We allow them to see the child component.
  // If there is NO token, we use the <Navigate> component to redirect them to the /login page.
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;