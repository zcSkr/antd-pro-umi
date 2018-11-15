import * as React from 'react';
import { IPageHeaderProps } from './index'

export default class BreadcrumbView extends React.PureComponent<IPageHeaderProps, any> {}

export function getBreadcrumb(breadcrumbNameMap: Object, url: string): Object;
