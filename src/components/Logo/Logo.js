import React from 'react';
import Tilt from 'react-tilt';
import face from './face.png';

const Logo = () => {
return(
	<div className = 'ma4 mt0'>
		<Tilt className="Tilt br-100 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
 			<div className="Tilt-inner pa4">
 				<img alt = "logo" src = {face}/> 
 				</div>
		</Tilt>
	</div>
	);
}
export default Logo;