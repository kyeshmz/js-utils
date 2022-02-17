import {
    Mesh,
    PlaneBufferGeometry,
    ShaderMaterial,
    Texture,
    Vector2,
    Vector4
} from 'three'
import fragmentShader from './shader/shader.frag'
import vertexShader from './shader/shader.vert'
  
  export class VideoPlane2 extends Mesh {
    element: HTMLVideoElement
    texture: Texture
    material: any
    geometry: PlaneBufferGeometry
  
    width: number
    height: number
    top: number
    left: number
    pixels: [boolean, boolean, boolean, boolean]
    screenSize: Vector2
    components: [string, string, string, string]
    componentSetter: [
      (v: number) => void,
      (v: number) => void,
      (v: number) => void,
      (v: number) => void
    ]
  
    constructor(
      elementID: string,
  
      { width = 1, height = 1, top = 0, left = 0 } = {}
    ) {
      super()
  
      this.element = document.getElementById(elementID) as HTMLVideoElement
  
      // this.texture = new VideoTexture(this.element)
      // this.texture.encoding = sRGBEncoding
  
      // this.scale.set(
      //   1.0,
      //   this.texture.image.height / this.texture.image.width,
      //   1.0
      // )
  
      // this.material = new MeshNormalMaterial({
      //   // map: this.texture,
  
      //   side: FrontSide, // so that it only shows up in front
      // })
  
      this.width = width
      this.height = height
      this.top = top
      this.left = left
      this.pixels = [false, false, false, false] // w h t l
      this.screenSize = new Vector2(1, 1)
      this.components = ['width', 'height', 'top', 'left']
      this.componentSetter = [
        this.setWidth,
        this.setHeight,
        this.setTop,
        this.setLeft,
      ]
  
      this.material = new ShaderMaterial({
        uniforms: {
          uTexture: {
            value: this.texture,
          },
          uSize: {
            value: new Vector4(1, 1, 0, 0),
          },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // depthWrite: false,
      })
      this.frustumCulled = false
  
      // this.renderOrder = -1
  
      this.geometry = new PlaneBufferGeometry(2, 2, 1, 1)
      this.setSize(this.width, this.height)
      this.setOffset(this.top, this.left)
      // this.initGui()
    }
    update() {
      console.log('updated width', this.width)
      this.setSize(this.width, this.height)
    }
  
    setScreenSize(width: number, height: number) {
      // this.material.uniforms.uScreenSize.value.set( width , height , 1 / width , 1 / height );
      this.screenSize.set(width, height)
  
      this.pixels.forEach((p, pi) => {
        //if a component is set in pixels, update the uniform
        if (p) this.componentSetter[pi].call(this, this[this.components[pi]])
      })
    }
  
    setSize(width: number, height: number) {
      this.setWidth(width)
      this.setHeight(height)
    }
  
    setWidth(v: number) {
      this.width = v
      if (isNaN(v)) {
        this.material.uniforms.uSize.value.x =
          parseInt(v as unknown as string) / this.screenSize.x
        this.pixels[0] = true
      } else {
        this.material.uniforms.uSize.value.x = v
        this.pixels[0] = false
      }
      console.log(this.material.uniforms.uSize.value.x)
    }
  
    setHeight(v: number) {
      this.height = v
      if (isNaN(v)) {
        this.material.uniforms.uSize.value.y =
          parseInt(v as unknown as string) / this.screenSize.y
        this.pixels[1] = true
      } else {
        this.material.uniforms.uSize.value.y = v
        this.pixels[1] = false
      }
    }
  
    setOffset(top: number, left: number) {
      this.setLeft(left)
      this.setTop(top)
    }
  
    setTop(v: number) {
      this.top = v
      if (isNaN(v)) {
        this.material.uniforms.uSize.value.z =
          parseInt(v as unknown as string) / this.screenSize.y
        this.pixels[2] = true
      } else {
        this.material.uniforms.uSize.value.z = v
        this.pixels[2] = false
      }
    }
  
    setLeft(v: number) {
      this.left = v
      if (isNaN(v)) {
        this.material.uniforms.uSize.value.w =
          parseInt(v as unknown as string) / this.screenSize.x
        this.pixels[3] = true
      } else {
        this.material.uniforms.uSize.value.w = v
        this.pixels[3] = false
      }
    }
  }
  