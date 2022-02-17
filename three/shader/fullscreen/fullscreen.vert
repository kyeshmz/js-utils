uniform vec4 uSize; 		//w h t l 
varying vec2 vUv;

void main(){
	vUv = uv;
	// code to make it full screen
	// get the current position of each of the veriticies
	// usize.xyzw
	// uSize is 1, 1, 0,0
	// vec2 transformed = position.xy * 1 - vec2(1., -1) + vec2(1,1)+ vec2(0,0) * 2
	//vec2 transformed = postion.xy * 1 - vec2(2,0)
	// 
	vec2 transformed = position.xy * uSize.xy - vec2(1.,-1.) + vec2( uSize.x ,  -uSize.y ) + vec2( uSize.w , - uSize.z ) * 2.;





	// 変換：ローカル座標 → 配置 → カメラ座標
	float addedPos = position.x + uSize.x;
	vec3 addedVec = vec3(addedPos, vec2(position.y,position.z));
	vec4 mvPosition = modelViewMatrix * vec4(addedVec, 1.0);    
  	// 変換：ローカル座標 → 配置 → カメラ座標
	//   vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);    
	// 変換：カメラ座標 → 画面座標
	vec4 v = projectionMatrix * mvPosition;
	gl_Position = v;

	// gl_Position = vec4( transformed , 1. , 1. );
		// gl_Position = vec4( vec2(position.xy) , 1. , 1. );
}