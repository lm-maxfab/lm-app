import { Component, JSX } from 'preact'
import { Renderer, Geometry, Program, Mesh } from 'ogl'

import bem from '../../utils/bem'

const vertexShader = `
  attribute vec2 uv;
  attribute vec2 position;

  varying vec2 vUv;

  void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
  }
`

interface Props extends JSX.HTMLAttributes<HTMLImageElement> {
  width?: number
  height?: number
  shader?: string
  progression?: number
}

class CanvasGL extends Component<Props, {}> {

  renderer: Renderer | null = null
  program: Program | null = null
  mesh: Mesh | null = null

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor(props: Props) {
    super(props)

    this.createCanvas = this.createCanvas.bind(this)
    this.updateCanvas = this.updateCanvas.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentDidMount(): void {
    this.createCanvas()
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  createCanvas(): void {

    this.renderer = new Renderer({
      width: this.props.width,
      height: this.props.height,
    });
    const gl = this.renderer.gl;
    this.$canvasWrapper?.appendChild(gl.canvas);

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    this.program = new Program(gl, {
      vertex: vertexShader,
      fragment: this.props.shader,
      uniforms: {
        uTime: { value: 0. },
        uProg: { value: 0. },
      },
    });

    const program = this.program

    this.mesh = new Mesh(gl, { geometry, program });

    requestAnimationFrame(this.updateCanvas);
  }

  updateCanvas(t: number): void {
    requestAnimationFrame(this.updateCanvas);

    if (!this.renderer) return
    if (!this.program) return

    this.program.uniforms.uProg.value = this.props.progression ?? 0.
    this.program.uniforms.uTime.value = t * 0.001;
    this.renderer.render({ scene: this.mesh });
  }

  $canvasWrapper: HTMLDivElement | null = null

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    return (
      <div ref={n => { this.$canvasWrapper = n }}></div>
    )
  }
}

export type { Props }
export default CanvasGL
