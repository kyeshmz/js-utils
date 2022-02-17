varying vec2 vUv;
uniform sampler2D uTexture;
void main(){
	// gl_FragColor = texture2D( uTexture , vUv );
	gl_FragColor = vec4(vec3(0.3),1.0);
}