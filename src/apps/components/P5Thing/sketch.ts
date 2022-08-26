import p5 from 'p5'

export default ($container: HTMLElement) => {

  function getContainerDimensions () {
    const { width, height } = $container.getBoundingClientRect()
    return [width, height]
  }

  return (s: p5) => {
    s.setup = () => {
      const [width, height] = getContainerDimensions()
      s.createCanvas(width, height)
      s.frameRate(60)
    }
  
    s.draw = () => {
      const [width, height] = getContainerDimensions()
      s.resizeCanvas(width, height)
      s.background(Math.random() * 255, Math.random() * 255, Math.random() * 255)
    }
  }
}

