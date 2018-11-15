import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);
// <Authorized authority={children.props.route.authority} noMatch={<Redirect to="/user/login" />}>
//   {children}
// </Authorized>
export default ({ children }) => (
  <Authorized noMatch={<Redirect to="/user/login" />}>
    {children}
  </Authorized>
);
