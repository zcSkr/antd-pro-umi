import React from 'react';
import Link from 'umi/link';
import Exception from 'ant-design-pro/lib/Exception';

const Exception404 = () => (
  <Exception
    type="404"
    desc='抱歉，你访问的页面不存在'
    linkElement={Link}
    backText='回到首页'
  />
);

export default Exception404;
