import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import Parallax from './components/Parallax'
import Header from './components/Header'
import Intro from './components/Intro'
import Name from './components/Name'
import GoNext from './components/GoNext'
import type { Props as NameProps } from './components/Name'

const data: NameProps[] = new Array(10).fill(null).map((e, i) => {
  return {
    name: `name-${i.toString()}`,
    displayName: 'Prénom',
    intro: ', lorem ipsum dolor sit amet, consectutor napam sed tortor.',
    text: `<figure class="article__media"> <img src="https://img.lemde.fr/2019/09/13/0/0/1800/1800/664/0/75/0/c5aca5b_nFS5dB2sCM_t2-ieav7d9-zs.jpg" srcset="https://img.lemde.fr/2019/09/13/0/0/1800/1800/1328/0/45/0/c5aca5b_nFS5dB2sCM_t2-ieav7d9-zs.jpg 1328w, https://img.lemde.fr/2019/09/13/0/0/1800/1800/664/0/75/0/c5aca5b_nFS5dB2sCM_t2-ieav7d9-zs.jpg 664w" sizes="(min-width: 768px) 664px, 100vw" alt=" width="1800" height="1800" class="initial lzld--loading" data-was-processed="true"> <noscript> <img src="https://img.lemde.fr/2019/09/13/0/0/1800/1800/664/0/75/0/c5aca5b_nFS5dB2sCM_t2-ieav7d9-zs.jpg" alt="> </noscript>  <figcaption class="article__legend" aria-hidden="true"> <span class="article__credit" aria-hidden="true">DAVID ADRIEN</span> </figcaption>  </figure>   <link rel="preload" href="https://img.lemde.fr/2019/09/13/0/0/1800/1800/664/0/75/0/c5aca5b_nFS5dB2sCM_t2-ieav7d9-zs.jpg" as="image" imagesrcset="https://img.lemde.fr/2019/09/13/0/0/1800/1800/1328/0/45/0/c5aca5b_nFS5dB2sCM_t2-ieav7d9-zs.jpg">             <p class="article__paragraph "><span class="article__inner">V</span>ictoire est de ces prénoms, comme Pierre, Olivier, Madeleine, qui sont aussi des noms communs. Mais Victoire est peut-être plus proche des prénoms-vertus, comme Clémence ou Honoré, que des prénoms-choses.</p>           <p class="article__paragraph ">En tant que nom commun, ces prénoms sont susceptibles de faire se rencontrer la personne et la chose. Olivier pris en photo dans un champ d’oliviers. Honoré recevant la Légion d’honneur. Espérance, née après tant de difficultés. Des moments où le prénom retrouve sa <em>motivation</em>, la correspondance naturelle entre le mot et la réalité que le mot désigne.</p>       <div id="inread-2" class="dfp-slot dfp__slot dfp__inread" data-format="inread" aria-hidden="true" data-google-query-id="CIqB8-3h-_ACFUJD0wodxJAGIA"><div id="google_ads_iframe_/128139881/LM_lemonde_abo/m_le_mag/m_le_mag/article/inread_0__container__" style="border: 0pt none;"><iframe id="google_ads_iframe_/128139881/LM_lemonde_abo/m_le_mag/m_le_mag/article/inread_0" title="3rd party ad content" name="google_ads_iframe_/128139881/LM_lemonde_abo/m_le_mag/m_le_mag/article/inread_0" width="300" height="250" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allow="conversion-measurement 'src'" srcdoc=" style="border: 0px; vertical-align: bottom;" data-google-container-id="2" data-load-complete="true"></iframe></div></div>      <p class="article__paragraph ">C’est ce qui arrive aux Victoire, nées le 8&nbsp;mai&nbsp;1945 ou le 11&nbsp;novembre&nbsp;1918. Ces Victoire de la victoire, on peut en trouver. Mais la Victoire de 1945 n’est pas celle de 1918. La Victoire de 1918 arrive après une série de combats sur le sol français, qui n’est pas entièrement libéré le 11&nbsp;novembre. Une proportion importante des filles qui naquirent le 11&nbsp;novembre reçut alors Victoire, en premier ou second prénom. La Victoire de 1945 naît alors que les Alliés sont entrés en Allemagne depuis plusieurs mois et près d’un an après le Débarquement.</p>           <h2 class="article__sub-title">Sans «&nbsp;motivation&nbsp;»</h2>           <p class="article__paragraph ">Libération et victoire sont déconnectées en&nbsp;1945. Et on le voit dans les prénoms&nbsp;: si une proportion non négligeable de filles reçoit Victoire les 8 et 9&nbsp;mai&nbsp;1945, c’est sans commune mesure avec 1918, peut-être parce que, dans l’esprit d’une partie des Français, la victoire était déjà acquise. De plus, en&nbsp;1945, le prénom est véritablement démodé. Il doit sonner alors aux oreilles des Français, comme Huguette ou Monique sonnent à nos oreilles&nbsp;: il faudrait vraiment une bonne raison pour appeler ainsi la petite dernière. La victoire a donné cette raison, mais sans remettre Victoire sur la courbe ascendante.</p>           <p class="article__paragraph ">Il faudra attendre la toute fin des années 1970 pour que Victoire, assez lentement, revienne à la mode, <em>La Boum</em> (1980), de Claude Pinoteau, aidant peut-être au renouveau. Au début des années 2020, ce sont environ 1&nbsp;500 Victoire qui naissent chaque année. Des Victoire sans <em>motivation</em>&nbsp;: les parents ne célèbrent pas la victoire, ils ont choisi un «&nbsp;joli prénom&nbsp;».</p>            <section class="catcher catcher--reference js-catcher"> <p class="catcher__desc"><span class="catcher__pilcrow"></span><span class="catcher__label"><strong>Baptiste Coulmont</strong> est professeur de sociologie à l’Ecole normale supérieure Paris-Saclay, auteur de <em>Sociologie des prénoms</em> (La Découverte, 2014, 130 p., 10&nbsp;€) et, avec Pierre Mercklé, de <em>Pourquoi les top-modèles ne sourient pas. Chroniques sociologiques</em> (Presses des Mines, 2020, 184 p., 29&nbsp;€).</span></p> </section>             <section class="catcher catcher--reference js-catcher"> <p class="catcher__desc"><span class="catcher__pilcrow"></span><span class="catcher__label"><a href="https://coulmont.com/" target="_blank" rel="noopener" title="Nouvelle fenêtre">http://coulmont.com/</a></span></p> </section>              <section class="author">    <p class="article__author-container"> <span class="author__detail"><a class="article__author-link" href="/signataires/baptiste-coulmont/"> <span class="author__name">Baptiste Coulmont</span><span class="author__desc">(Professeur de sociologie à l’École normale supérieure Paris-Saclay (http://coulmont.com/))</span></a></span></p>   </section>    <section class="article__reactions">  <a class="comments__active" href="https://www.lemonde.fr/m-perso/article/2021/05/08/le-prenom-des-gens-victoire_6079552_4497916.html?contributions" rel="nofollow">Contribuer</a>     <ul class="meta meta__social   old__meta-social">  <li class="meta__text meta__text--favorite">Favoris</li> <li class="meta__icon meta__icon--favorite"> <button class="meta__link  meta__link-wrapper" id="js-trigger-favorite-bottom" href="#"><span class="icon__favorites"></span><span class="sr-only">Ajouter aux favoris</span></button> <span class="meta__icon-desc meta__icon-desc--favorites" id="favorites-desc-bottom" aria-hidden="true">Ajouter aux favoris</span> </li>  <li class="meta__text meta__text--share">Partage</li>  <li class="meta__icon"> <button class="js-social js-social-tag meta__link meta__link-wrapper js-social-bottom js-social-init" data-social="fb"><span class="icon__facebook"></span><span class="sr-only">Partager sur Facebook</span></button> <span class="meta__icon-desc meta__icon-desc--facebook" aria-hidden="true">Partager sur Facebook</span> </li> <li class="meta__icon"> <button class="js-social js-social-tag meta__link meta__link-wrapper js-social-bottom js-social-init" data-social="mail"><span class="icon__email"></span><span class="sr-only">Envoyer par e-mail</span></button> <span class="meta__icon-desc meta__icon-desc--email" aria-hidden="true">Envoyer par e-mail</span> </li> <li class="meta__icon meta__icon--desktop"> <button class="js-social js-social-tag meta__link meta__link-wrapper js-social-bottom js-social-init" data-social="messenger"><span class="icon__messenger"></span><span class="sr-only">Partager sur Messenger</span></button> <span class="meta__icon-desc meta__icon-desc--messenger" aria-hidden="true">Partager sur Messenger</span> </li>  <li class="meta__icon meta__icon--mobile"> <a href="whatsapp://send?text=https://www.lemonde.fr/m-perso/article/2021/05/08/le-prenom-des-gens-victoire_6079552_4497916.html" class="meta__link  meta__link-wrapper js-social-tag" data-social="whatsapp"><span class="icon__whatsapp"></span><span class="sr-only">Partager sur Whatsapp</span></a> <span class="meta__icon-desc meta__icon-desc--whatsapp" aria-hidden="true">Partager sur Whatsapp</span> </li>  <li class="meta__icon meta__icon--dropdown"> <button class="meta__link  meta__link-wrapper meta__link--extend icon__arrow" type="button" data-toggle="collapse" data-toggle-target=".meta__sub"><span class="sr-only">Plus d’options</span></button> <span class="meta__icon-desc meta__icon-desc--more" aria-hidden="true">Plus d’options</span> <ul class="meta__sub"> <li class="meta__icon-sub">Plus d’options</li> <li class="meta__icon-sub"><button type="button" class="js-social js-social-tag meta__link-sub meta__link-wrapper js-social-bottom js-social-init" data-social="tw"><span class="meta__icon-container"><span class="icon__twitter"></span></span><span class="meta__label-sub">Twitter</span></button></li> <li class="meta__icon-sub"><button type="button" class="js-social js-social-tag meta__link-sub meta__link-wrapper js-social-bottom js-social-init" data-social="linkedin"><span class="meta__icon-container"><span class="icon__linkedin"></span></span><span class="meta__label-sub">Linkedin</span></button></li> <li class="meta__icon-sub"><button type="button" class="js-social js-social-tag meta__link-sub meta__link-wrapper js-social-bottom js-social-init" data-social="copy"><span class="meta__icon-container"><span class="icon__link"></span></span><span class="meta__label-sub">Copier le lien</span></button></li> </ul> </li>  </ul>  </section>`
  }
})

interface Props {
  className?: string
  style?: React.CSSProperties
}

interface State {
  currentName: string|null
}

class App extends React.Component<Props, State> {
  state: State = { currentName: null }
  $root: HTMLDivElement|null = null

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.activateName = this.activateName.bind(this)
    this.handleGoNextClick = this.handleGoNextClick.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * ACTIVATE NAME
   * * * * * * * * * * * * * * */
  async activateName (name: string|null) {
    await new Promise(resolve => {
      this.setState((curr: State) => {
        if (curr.currentName === name) return { ...curr, currentName: null }
        else return { ...curr, currentName: name }
      }, () => resolve(true))
    })
    if (this.$root === null || this.state.currentName === null) return
    const $name: Element|null = this.$root.querySelector(`#${name}`)
    if ($name === null) return
    const nameY = $name.getBoundingClientRect().top
    const windowY = window.pageYOffset
    const offsetY = -2 * 16
    const yScrollTarget = nameY + windowY + offsetY
    window.scrollTo({
      top: yScrollTarget,
      behavior: 'smooth'
    })
  }

  /* * * * * * * * * * * * * * *
   * HANDLE GO NEXK CLICK
   * * * * * * * * * * * * * * */
  handleGoNextClick (e: React.MouseEvent) {
    const currentName = this.state.currentName
    const currPos = data.findIndex(name => name.name === currentName)
    const nextPos = currPos + 1
    if (nextPos === data.length) return
    const nextName = data[nextPos].name
    this.activateName(nextName)
  }
  
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, state } = this
    const classes: string = clss('lm-app', 'prenoms', styles['app'], props.className)
    const inlineStyle = { ...props.style }
    const currentName = state.currentName
    const currentNamePos = data.findIndex((name: NameProps) => name.name === currentName)
    const currentNameIsLast = currentNamePos === data.length - 1

    const Names = () => (
      <div className={styles['names']}>
        {data.map((name: NameProps, i: number): React.ReactNode => {
          const expanded = currentName === name.name
          const onToggle = () => { this.activateName(name.name) }
          return <div
            key={name.name}
            id={name.name}
            className={styles['name']}
            style={{ top: '200px' }}>
            <Name
              {...name}
              expanded={expanded}
              onToggle={onToggle} />
          </div>
        })}
      </div>
    )

    return (
      <div
        className={classes}
        style={inlineStyle}
        ref={n => this.$root = n}>
        <div className={styles['parallax']}>
          <Parallax />
        </div>
        <Header className={styles['header']} />
        <Intro className={styles['intro']} />
        <Names />
        {currentName
          && !currentNameIsLast
          && <div
            onClick={this.handleGoNextClick}
            className={styles['go-next']}>
            <GoNext />
          </div>}
      </div>
    )
  }
}

export type { Props }
export default App
