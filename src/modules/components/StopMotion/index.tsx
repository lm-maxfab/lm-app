import { Component, JSX } from 'preact'
import clamp from '../../utils/clamp'
import interpolate from '../../utils/interpolate'

interface Props {
  /* [REVIEW]
   * 1/ ci-dessous, progression attend qu'on lui passe
   * explicitement undefined, mais pas qu'on ne lui donne rien
   *   => progression?: number|null c'est mieux
   * 2/ sur images, ce qu'on dit avec typescript ici, c'est :
   * "t'inquiètes, y'aura TOUJOURS un array pour images", et pas
   * "c'est interdit de passer une prop images vide". OR:
   * - si on a pas de vraie raison d'exiger que la prop soit pas undefined
   * vaut mieux se laisser la possibilité
   * - il est tout à fait possible de créer un fichier js et pas ts qqpart
   * qui appelle <StopMotion /> sans prop images et du coup y'aura pas d'alerte
   * VScode ou de pb au moment de build, et là ton code va probablement
   * break parce que lui il s'attend à trouver un array systématiquement
   *   => images?: string[]
   */
  progression: number|null|undefined
  images: string[]
}

class StopMotion extends Component<Props, {}> {
  canvas: HTMLCanvasElement | null = null
  imageRatio: number = 1
  /* [REVIEW] (attention je vais pinailler de ouf) imagesElements avec
   * images au pluriel, ça voudrait dire que chaque image a plusieurs éléments */
  imagesElements: HTMLImageElement[] = []
  $canvasWrapper: HTMLDivElement | null = null

  constructor(props: Props) {
    super(props)
    /* [REVIEW] initialize pourrait avoir un nom plus explicite */
    this.initialize = this.initialize.bind(this)
    this.preloadImages = this.preloadImages.bind(this)
    this.setCanvasSize = this.setCanvasSize.bind(this)
    this.drawImageOnCanvas = this.drawImageOnCanvas.bind(this)
    this.getIndexBasedOnProgression = this.getIndexBasedOnProgression.bind(this)
    this.getFrameBasedOnProgression = this.getFrameBasedOnProgression.bind(this)
  }

  componentDidMount(): void {
    this.initialize()
  }

  componentDidUpdate(): void {
    /* [REVIEW]
     * 1. faire attention avec la syntaxe !this.canvas sur des objets
     * qui ne sont pas forcément des booléens, pour deux raisons :
     *   - c'est pas ultra explicite à la lecture
     *   - ça check pas toujours EXACTEMENT ce qu'on veut, mettons: 
     *   const str: string|undefined = '' ——> ça va passer dans if (!str)
     *   alors que c'est pas forcément ce qu'on veut, et si c'était le cas,
     *   vaudrait mieux if (str === null || str === '')
     * 2. ATTENTION PINAILLAGE :
     * if (this.canvas === null) return this.initialize(), c'est plus élégant : D
     * 3. Je me demande si c'est bien nécessaire d'avoir this.canvas alors qu'on 
     * peut le récupérer depuis this.$canvasWrapper ?
    */
    if (!this.canvas) {
      this.initialize()
      return
    }

    this.setCanvasSize()

    // update image
    const currentFrame = this.getFrameBasedOnProgression()
    if (!currentFrame) return
    requestAnimationFrame(() => this.drawImageOnCanvas(currentFrame))
  }

  // [REVIEW] dommage que tu dises ici que ça peut return undefined
  // parce que le code de la fonction il a juste envie de return un number le pauvre :(
  getIndexBasedOnProgression(): number | undefined {
    // [REVIEW] ce bloc il mériterait d'être un peu plus découpé,
    // on a des lignes un peu longues et c'est pas évident évident de comprendre ce qui se passe
    // Pas hésiter à rajouter des résultats intermédiaires stockés dans des variables en attandant
    // que : https://github.com/tc39/proposal-pipeline-operator
    const clampedProgression = clamp(this.props.progression ?? 0, 0, 1)
    // [REVIEW] je me demande si on peut pas se retrouver avec des cas de figure pourris
    // où interpolate(1, 0, 10) te retourne pas 10 mais 9.99999998 ou une connerie du genre.
    // t'as déjà demandé à javascript console.log(0.1 + 0.2) ? le résultat est vraiment très triste
    // dddu couuup...... Math.round finalement ? Boarh, j'sais pas. Ou alors 
    // ajouter un truc dans interpolate du genre :
    // if (ratio === 0) return bound1
    // if (ratio === 1) return bound2
    // => probablement mieux que Math.round, ça s'attaque au problème à la racine
    const interpolatedProgression = Math.floor(interpolate(clampedProgression, 0, (this.props.images?.length ?? 0) - 1))
    return interpolatedProgression
  }

  getFrameBasedOnProgression(): HTMLImageElement | undefined | void {
    const index = this.getIndexBasedOnProgression()
    // [REVIEW] EH BAH ÇA ALORS ??? IL SE PASSE QUOI SI INDEX === 0 ??? HEIN ??????? 😈😈😈😈😈
    if (!index) return
    // [REVIEW] imagesElements peut pas être undefined donc pas besoin de ?
    // (et ici c'est pas grave parce que c'est pas un input externe donc c'est même top)
    return this.imagesElements?.[index]
  }

  initialize(): void {
    // [REVIEW] pareil, plutot check si === null
    if (!this.$canvasWrapper) return

    this.canvas = document.createElement('canvas')
    this.$canvasWrapper?.appendChild(this.canvas)

    // [REVIEW] y'a globalement 2 types de fonctions :
    // celles qui sont là pour retourner une valeur
    // celles qui sont là pour faire des opérations
    // (et celles qui font les deux, dont à mon avis il faut se tenir à l'écart le plus souvent)
    // => faut faire gaffe avec celles qui font des opérations,
    // et qui en appellent d'autres qui font aussi des opérations,
    // ça peut devenir difficile de composer avec (c'est ce qui rend
    // ton didUpdate un tout petit peu difficile à capter au départ).
    // => vaudrait mieux avoir un initialize (renommé) qui crée et append
    // le canvas, et appeler manuellement setCanvasSize et preloadImages
    // en dessous de initialize là où t'en as besoin. Si en cours de route
    // tu te rends compte que y'a plein d'endroits où tu dois utiliser
    // la même séquence, tu peux créer une méthode explicitement nommée
    // initSetCanvasSizeAndPreloadImages, comme ça on sait bien tout ce qui se passe
    this.setCanvasSize()
    this.preloadImages()
  }

  async preloadImages() {
    // [REVIEW] du coup ici pas besoin de default sur 0 si tu change le return type de this.getIndex
    const currentIndex = this.getIndexBasedOnProgression() ?? 0
    // [REVIEW] ici pas d'incidence parce que .slice retourne un nouvel array
    // mais Array.reverse c'est typiquement un sale truc qui perform une opération
    // ET retourne un truc, mais il modifie l'Array sur lequel il est appelé donc faut se méfier
    // (tu sais ptet déjà)
    const imagesBefore = this.props.images.slice(0, currentIndex).reverse()
    const imagesAfter = this.props.images.slice(currentIndex, -1)
    const imagesInOrder = [] // [REVIEW] dis-y que ça prend que string, là il s'attend à du any

    let indexAfter = currentIndex
    let indexBefore = currentIndex - 1

    // [REVIEW] pareil, fais des check sur <= ou >= 0
    while (imagesBefore.length || imagesAfter.length) {
      // [REVIEW] ça donne tellement envie de faire un petit one-liner genre
      // if (imagesAfter.length > 0) imagesInOrder.push({ index: indexAfter++, url: imagesAfter.shift() })
      // mais j'avoue que le indexAfter++ au milieu c'est un peu dégueu
      // (indexAfter++ retourne la valeur d'indexAfter AVANT qu'elle ne soit incrémentée)
      if (imagesAfter.length) {
        imagesInOrder.push(
          {
            index: indexAfter,
            url: imagesAfter.shift()
          });
        indexAfter++
      }

      if (imagesBefore.length) {
        imagesInOrder.push(
          {
            index: indexBefore,
            url: imagesBefore.shift()
          });
        indexBefore--
      }
      // [REVIEW] pour s'assurer de pas faire de boucle infinie (même si ça doit le faire en l'état, on sait jamais),
      // je pense qu'il faudrait :
      //   - mettre un petit 'continue' à la fin de chaque if (ça annule mon idée de one-liner du coup)
      //   - mettre un petit 'break' à la fin du while
      // [REVIEW] mais sinon, bravo pour ce petit bijou, c'est concis et ça marche, c'est top !
    }

    for (const { index, url } of imagesInOrder) {
      const img = new Image()
      await this.loadImage(img, url)
      this.imagesElements[index] = img
      // [REVIEW] pareil, un peu bizarre de setCanvasSize et drawImage 
      // dans preload, vaut mieux les appeler à côté de preload là où y'a besoin
      if (index === currentIndex) {
        this.imageRatio = img.height / img.width
        this.setCanvasSize()
        this.drawImageOnCanvas(this.imagesElements[index])
      }
    }
  }

  loadImage (img: HTMLImageElement, url?: string) {
    // [REVIEW] è_____é
    if (!url) return
    // [REVIEW] pas besoin de reject ici
    return new Promise((resolve, reject) => {
      img.src = url
      img.onload = (event) => resolve(event)
    })
  }

  setCanvasSize(): void {
    // [REVIEW] ...............
    if (!this.canvas) return
    const wrapperWidth = this.$canvasWrapper?.getBoundingClientRect().width
    if (wrapperWidth && wrapperWidth != this.canvas.width) {
      this.canvas.width = wrapperWidth
      this.canvas.height = wrapperWidth * this.imageRatio
    }
  }

  drawImageOnCanvas(image: HTMLImageElement): void {
    if (!image) return
    if (!this.canvas) return

    this.canvas?.getContext('2d')?.drawImage(
      // ce qu'on dessine
      image,
      0,
      0,
      image.width,
      image.height,
      // où on le dessine
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): (JSX.Element | null) {
    return <div ref={n => { this.$canvasWrapper = n }} />
  }
}

export type { Props }
export default StopMotion
