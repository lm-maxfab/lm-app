import { Component, ReactNode } from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

interface Props {
  className?: string
  style?: any
}

class Intro extends Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): ReactNode {
    const { props } = this
    const classes: string = clss('prenoms-intro', styles['wrapper'], props.className)
    const inlineStyle = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        Morbi et felis ante. Nullam lobortis enim ut enim imperdiet ultrices. Pellentesque sed euismod tellus, accumsan sagittis lorem. Praesent convallis lorem velit, ac dignissim tellus vestibulum in. Phasellus non sem ut orci efficitur molestie vitae a mi. Pellentesque dignissim pharetra augue, eu convallis erat dapibus nec. Sed egestas augue erat, vel ornare massa auctor ac. Proin dapibus, metus sit amet pulvinar scelerisque, est sapien dignissim sem, eu auctor risus metus porttitor diam.
        <br />
        Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque elementum scelerisque lorem a sodales. In ac augue purus. Donec semper magna eget elit blandit, rutrum ultricies neque congue. Nam nec eros malesuada, tincidunt massa eleifend, congue leo. Suspendisse eu tempus dui. Phasellus at metus ac augue lobortis efficitur in vitae turpis. Maecenas vehicula urna at nisl convallis vestibulum. Pellentesque egestas sodales est id vestibulum. Donec tempus ante in augue vulputate, sed ultricies lacus auctor. Etiam at mi diam. Nam mollis egestas enim, vitae condimentum ex hendrerit non. Sed laoreet sodales ullamcorper.
      </div>
    )
  }
}

export type { Props }
export default Intro
