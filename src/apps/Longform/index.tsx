import { Component, JSX } from 'preact'
import Scrollgneugneu, { PropsPageData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import { GeneralSettings } from '../types'

interface Props extends InjectedProps {}
interface State {}

class Longform extends Component<Props, State> {
  static clss: string = 'sable-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const generalSettings: Partial<GeneralSettings> = {
      // Ligne virtuelle dans l'écran représentant le seuil entre 2 pages
      thresholdOffset: '60%',
      bgColorTransitionDuration: '600ms',
      // Combien de pages à l'avance faut il pour charger le contenu des blocs fixes
      lazyLoadDistance: 2,
      // N'est utile que si le scrllgngn est utilisé dans une div en overflow-y: scroll
      // qui ne ferait pas toute la hauteur de l'écran (jamais quoi)
      viewportHeight: '100vh',
      // Utile si jamais on veut le mettre en cover d'article et qu'il reste le header du site,
      // si on veut que les blocs fixes s'accrochent pile en dessous du header (~60px).
      // Dans ce cas, je crois qu'il faut viewportHeight: 'calc(100vh - 60px)', mais bref
      topOffset: 0,
      // Ajouter une classe custom au header autre que .lm-article-header
      // Par défaut, le header n'a pas de styles définis
      headerCustomClass: undefined,
      // Appliquer du css sur la classe custom plutot que .lm-article-header
      headerCustomCss: undefined,
      // left, center, right, par défaut: left
      headerNavItemsAlign: 'center'
    }
    const pagesData: PropsPageData[] = [
      // Une page simple sans les commentaires
      {
        showHeader: true,
        showNav: true,
        headerLogoFill1: 'black',
        headerLogoFill2: 'rgb(0, 0, 0, .3)',
        headerNavItemsAlign: 'center',
        chapterName: 'Mon super chapitre',
        isChapterHead: true,
        bgColor: 'cornflowerblue',
        blocks: [{
          depth: 'scroll',
          layout: 'right-half',
          type: 'html',
          content: `<div style="
            background-color: chocolate;
            width: 100%;
            height: 120vh;
            padding: 16px;
            border: 16px solid black;
            box-sizing: border-box;
            font-weight: 700;
            font-family: var(--ff-marr-sans);">
            Right half.
          </div>`
        }]
      },

      // Une page avec le détail de chq propriété
      {
        showHeader: true,
        showNav: true,
        // Couleur principale du logo dans la nav
        headerLogoFill1: 'white',
        // Contreforme du logo (30% de l'opacité de la couleur principale c'est bien)
        headerLogoFill2: 'rgb(255, 255, 255, .3)',
        // Classes et css spécifiques du header, actifs uniquement quand la page est active
        headerCustomClass: 'class-on-header-while-this-page-is-active',
        headerCustomCss: '.class-on-header-while-this-page-is-active { opacity: 1; }',
        headerNavItemsAlign: 'center',
        // Nom du chapitre tel qu'affiché dans la nav
        chapterName: 'Mon super chapitre',
        // Cette page est-elle celle sur laquelle on atterrit
        // quand on clique sur le chp dans la nav
        isChapterHead: true,
        // Couleur de fond DU SCRLLGNGN (pas de la page) lorsque la page est active
        bgColor: 'blueviolet',
        
        // Liste des blocs présents dans la page.
        blocks: [{
          // Utile si on veut que le bloc soit présent sur plusieurs pages :
          // On le définit avec toutes ses propriétés une première fois,
          // puis on y fait référence dans d'autres pages (ULTÉRIEURES) en ne renseignant que l'id
          id: 'le-nom-du-bloc',
          // - scroll: le bloc scrolle dans la page. Les blocs de ce type s'ajoutent
          //   les uns au dessus des autres, donc pas tellement d'intérêt d'en avoir plusieurs
          // - back: le bloc est fixe et s'affiche à l'écran quand la page est active. Il est
          //   en background, et donc passe en dessous des blocks scrollables
          // - front: le bloc est fixe tout pareil, mais passe au dessus du contenu scrollable
          depth: 'scroll',
          // Utile pour arranger entre eux des blocs back ou entre eux des blocs front
          // ne reflète pas le réel z-index dans la page, l'ordre des z-index final est :
          // [
          //  ...sortedZIndexesForBack,
          //  ...sortedZIndexesForScroll,
          //  ...sortedZIndexesForFront
          // ]
          zIndex: 2,
          // left-half, right-half, full-screen, d'autres à venir, pas encore tout à fait
          // satisfait de comment ça marche donc ça va sûrement bouger
          layout: 'left-half',
          // Si vide, c'est le layout qui s'applique, sinon, on applique un autre layout
          // en dessous de 800px de largeur d'écran
          mobileLayout: 'right-half',
          // À n'utiliser que sur les blocs back ou front
          // permet de paramétrer de quelle manière les blocs apparaissent quand ils deviennent
          // actifs. Globalement inutile cependant : (
          // Modèle: [[transition-name, duration-in-ms], ...]
          // Genre: [['grow', 600]]
          // Options: 'fade', 'grow', 'whirl', 'slide-up', 'right-open', 'left-open'
          transitions: [],
          // Même logique que pour mobileLayout
          mobileTransitions: [],
          // Type de contenu
          // - html pour afficher directement le contenu de la propriété 'content',
          // - module pour rendre le résultat du module js compatible, hébergé à l'adresse renseignée dans la propriété 'content'
          // - more to come 😏
          type: 'html',
          // Utile si on a un type: 'module' et qu'on veut que le scrllgngn déclenche une update
          // à chaque évènement scroll détecté sur la page courante
          trackScroll: false,
          // Le contenu à afficher, ou l'url du module
          content: `<div style="
            background-color: coral;
            width: 100%;
            height: 120vh;
            padding: 16px;
            border: 16px solid black;
            box-sizing: border-box;
            font-weight: 700;
            font-family: var(--ff-marr-sans);">
            Left half.
          </div>`
        }]
      }
    ]

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Scrollgneugneu
        pages={pagesData}
        thresholdOffset={generalSettings?.thresholdOffset}
        bgColorTransitionDuration={generalSettings?.bgColorTransitionDuration}
        stickyBlocksLazyLoadDistance={generalSettings?.lazyLoadDistance}
        stickyBlocksViewportHeight={generalSettings?.viewportHeight}
        stickyBlocksOffsetTop={generalSettings?.topOffset}
        headerCustomClass={generalSettings?.headerCustomClass}
        headerCustomCss={generalSettings?.headerCustomCss}
        headerNavItemsAlign={generalSettings?.headerNavItemsAlign} />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
