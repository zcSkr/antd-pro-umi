import React from 'react';
import Link from 'umi/link';
import Exception from 'ant-design-pro/lib/Exception';

const Exception500 = () => (
  <Exception
    type="500"
    desc='抱歉，服务器出错了'
    linkElement={Link}
    backText='回到首页'
  />
);

export default Exception500;
