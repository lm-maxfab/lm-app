import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'
import Paginator from './Paginator2'

interface Props extends InjectedProps {}
interface State {}

class Longform extends Component<Props, State> {
  static clss: string = 'illus21-longform'
  clss = Longform.clss
  state: State = {}

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    
    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      marginTop: 'var(--len-nav-height)'
    }
    const paginatorStyle: JSX.CSSProperties = {
      // marginLeft: '30px',
      // marginTop: '200px',
      // marginBottom: '200px',
      
      
      width: '800px',
      height: '800px',
      
      backgroundColor: 'cornflowerblue'
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Paginator
        root='self'
        direction='horizontal'
        tresholdOffset='10%'
        onPageChange={() => {
          console.log('page change!')
        }}
        style={paginatorStyle}>
        <Paginator.Page value='première'>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <span>COUCOU</span>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <span>COUCOU</span>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <span>COUCOU</span>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <span>COUCOU</span>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <span>COUCOU</span>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <span>COUCOU</span>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <span>COUCOU</span>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <span>COUCOU</span>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <Paginator.Page>Child</Paginator.Page>
        <Paginator.Page style={{ backgroundColor: 'blue' }}>Child</Paginator.Page>
        <span>COUCOU</span>
      </Paginator>
    </div>
  }
}

export type { Props, Longform }
export default wrapper(Longform)
