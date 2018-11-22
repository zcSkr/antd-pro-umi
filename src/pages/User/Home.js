import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Home = () => (
  <Exception
    title="当家师"
    desc='欢迎使用当家师后台管理系统'
    // linkElement={Link}
    // backText='回到首页'
    actions={<div></div>}
  />
);

export default Home;
