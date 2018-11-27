import React, { PureComponent, Fragment } from 'react';
import BMap from 'BMap';

export default class BMapCpmponent extends PureComponent {

	componentDidMount() {
		const { lon, lat, onClick, onlyShow } = this.props
		const map = new BMap.Map("allmap", { enableMapClick: false }); // 创建Map实例
		map.setCurrentCity("成都");
		map.disableDoubleClickZoom() //禁用双击放大。
		map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放
		map.centerAndZoom(new BMap.Point(104.072906, 30.662284), 12); // 初始化地图,设置中心点坐标和地图级别

		if (lon && lat) {
			map.centerAndZoom(new BMap.Point(lon, lat), 12);
			let marker = new BMap.Marker({
				lng: lon,
				lat: lat
			}); // 创建标注
			map.addOverlay(marker);
		}

		// 地图点击事件
		!onlyShow && map.addEventListener('click', ({
			type,
			target,
			point,
			pixel,
			overlay
		}) => {
			if (onClick) onClick(String(point.lng), String(point.lat))
			let marker = new BMap.Marker(point); // 创建标注
			map.clearOverlays();
			map.addOverlay(marker);
		}, true)
		
	}
	render() {
		const { style } = this.props
		return <div id="allmap" style={{ maxWidth: '100%', minHeight: 400, ...style }}></div>
	}
};