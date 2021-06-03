import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import Name from '../Name'
import type { Props as NameProps } from '../Name'

const data: NameProps[] = [{
  name: 'Victoire',
  displayName: 'Victoire',
  intro: ', Des filles de la Libération à celles de « La Boum », les Victoire n’ont connu qu’un éphémère regain.',
  text: `
  <article class="article__content old__article-content-single">
  <p class="article__paragraph "><span class="article__inner">V</span>ictoire est de ces prénoms, comme Pierre, Olivier, Madeleine, qui sont aussi des noms communs. Mais Victoire est peut-être plus proche des prénoms-vertus, comme Clémence ou Honoré, que des prénoms-choses.</p>
  <p class="article__paragraph ">En tant que nom commun, ces prénoms sont susceptibles de faire se rencontrer la personne et la chose. Olivier pris en photo dans un champ d’oliviers. Honoré recevant la Légion d’honneur. Espérance, née après tant de difficultés. Des moments où le prénom retrouve sa <em>motivation</em>, la correspondance naturelle entre le mot et la réalité que le mot désigne.</p>
  <p class="article__paragraph ">C’est ce qui arrive aux Victoire, nées le 8&nbsp;mai&nbsp;1945 ou le 11&nbsp;novembre&nbsp;1918. Ces Victoire de la victoire, on peut en trouver. Mais la Victoire de 1945 n’est pas celle de 1918. La Victoire de 1918 arrive après une série de combats sur le sol français, qui n’est pas entièrement libéré le 11&nbsp;novembre. Une proportion importante des filles qui naquirent le 11&nbsp;novembre reçut alors Victoire, en premier ou second prénom. La Victoire de 1945 naît alors que les Alliés sont entrés en Allemagne depuis plusieurs mois et près d’un an après le Débarquement.</p>
  <h2 class="article__sub-title">Sans «&nbsp;motivation&nbsp;»</h2>
  <p class="article__paragraph ">Libération et victoire sont déconnectées en&nbsp;1945. Et on le voit dans les prénoms&nbsp;: si une proportion non négligeable de filles reçoit Victoire les 8 et 9&nbsp;mai&nbsp;1945, c’est sans commune mesure avec 1918, peut-être parce que, dans l’esprit d’une partie des Français, la victoire était déjà acquise. De plus, en&nbsp;1945, le prénom est véritablement démodé. Il doit sonner alors aux oreilles des Français, comme Huguette ou Monique sonnent à nos oreilles&nbsp;: il faudrait vraiment une bonne raison pour appeler ainsi la petite dernière. La victoire a donné cette raison, mais sans remettre Victoire sur la courbe ascendante.</p>
  <p class="article__paragraph ">Il faudra attendre la toute fin des années 1970 pour que Victoire, assez lentement, revienne à la mode, <em>La Boum</em> (1980), de Claude Pinoteau, aidant peut-être au renouveau. Au début des années 2020, ce sont environ 1&nbsp;500 Victoire qui naissent chaque année. Des Victoire sans <em>motivation</em>&nbsp;: les parents ne célèbrent pas la victoire, ils ont choisi un «&nbsp;joli prénom&nbsp;».</p>
  <section class="catcher catcher--reference js-catcher">
    <p class="catcher__desc"><span class="catcher__pilcrow"></span><span class="catcher__label"><strong>Baptiste Coulmont</strong> est professeur de sociologie à l’Ecole normale supérieure Paris-Saclay, auteur de <em>Sociologie des prénoms</em> (La Découverte, 2014, 130 p., 10&nbsp;€) et, avec Pierre Mercklé, de <em>Pourquoi les top-modèles ne sourient pas. Chroniques sociologiques</em> (Presses des Mines, 2020, 184 p., 29&nbsp;€).</span></p>
  </section>
  <section class="catcher catcher--reference js-catcher">
    <p class="catcher__desc"><span class="catcher__pilcrow"></span><span class="catcher__label"><a href="https://coulmont.com/" target="_blank" rel="noopener" title="Nouvelle fenêtre">http://coulmont.com/</a></span></p>
  </section>
  <section class="author">
    <p class="article__author-container"> <span class="author__detail"><a class="article__author-link" href="/signataires/baptiste-coulmont/"> <span class="author__name">Baptiste Coulmont</span><span class="author__desc">(Professeur de sociologie à l’École normale supérieure Paris-Saclay (http://coulmont.com/))</span></a></span></p>
  </section>
</article>`
}]

interface Props {
  className?: string
  style?: React.CSSProperties
}

class Names extends React.Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const classes: string = clss('prenoms-names', styles.wrapper, props.className)
    const inlineStyle = { ...props.style }
    return (
      <div className={classes} style={inlineStyle}>
        {data.map((name: NameProps, i: number): React.ReactNode => {
          return <Name {...name} key={i} />
        })}
      </div>
    )
  }
}

export type { Props }
export default Names
