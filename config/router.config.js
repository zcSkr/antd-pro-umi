export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', component: './User/Home' },
      {
        path: '/sys',
        icon: 'setting',
        name: '系统设置',
        routes: [
          {
            path: '/sys/role',
            name: '角色管理',
            component: './Sys/RoleManage',
          },
          {
            path: '/sys/module',
            name: '模块管理',
            component: './Sys/ModuleManage',
          },
          {
            path: '/sys/params',
            name: '系统参数',
            component: './Sys/SysParams',
          },
          {
            path: '/sys/administrator',
            name: '子管理员',
            component: './Sys/ChildManage',
          },
          {
            path: '/sys/datadic',
            name: '数据字典',
            component: './Sys/DataDic',
          },
          {
            component: '404',
          },
        ]
      },
      {
        path: '/sysUser',
        icon: 'setting',
        name: '系统用户',
        routes: [
          {
            path: '/sysUser/factory',
            name: '厂家管理',
            component: './sysUser/FactoryManage',
          },
          {
            path: '/sysUser/merchant',
            name: '商家管理',
            component: './sysUser/MerchantManage',
          },
          {
            path: '/sysUser/user',
            name: '用户管理',
            component: './sysUser/UserManage',
          },
          {
            component: '404',
          },
        ]
      },
      {
        path: '/service',
        icon: 'table',
        name: '业务管理',
        routes: [
          {
            path: '/service/feedback',
            name: '系统反馈',
            component: './Service/FeedBack',
          },
          {
            path: '/service/devicedppeal',
            name: '设备申诉',
            component: './Service/DeviceDppeal',
          },
          {
            path: '/service/virtualdevice',
            name: '虚拟设备',
            component: './Service/VirtualDevice',
          },
          {
            component: '404',
          },
        ]
      },
      {
        path: '/device',
        icon: 'table',
        name: '设备管理',
        component: './Device/DeviceManage',
      },
      {
        path: '/factory',
        icon: 'table',
        name: '厂家权限',
        routes: [
          {
            path: '/factory/merchantManage',
            name: '商家管理',
            component: './Factory/MerchantManage',
          },
          {
            path: '/factory/deviceManage',
            name: '设备管理',
            component: './Factory/DeviceManage',
          },
          {
            component: '404',
          },
        ]
      },
      {
        path: '/merchant',
        icon: 'table',
        name: '商家权限',
        routes: [
          {
            path: '/merchant/deviceManage',
            name: '设备管理',
            component: './Merchant/DeviceManage',
          },
          {
            component: '404',
          },
        ]
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: '403',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: '404',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: '500',
            component: './Exception/500',
          },
          {
            component: '404',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
  {
    component: '404',
  },
];
