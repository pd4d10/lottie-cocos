export type Id = string

export type Layer = {
  ty: LayerType
  nm: string
  refId: Id
  st: number
  ks: {
    o: any
    r: any
    p: any
    a: any
    s: any
  }
}

export type ImageAsset = {
  id: Id
  w: number
  h: number
  u: string
  p: string
}

export type PrecompAsset = {
  id: Id
  layers: Layer[]
}

export type Asset = ImageAsset | PrecompAsset

export type AnimationData = {
  fr: number
  w: number
  h: number
  assets: Asset[]
  layers: Layer[]
}

export type Actions = {
  /**
   * Create a precomp
   */
  createPrecomp(
    id: Id,
    payload: {
      width: number
      height: number
    },
  ): void

  /**
   * Create an image
   */
  createImage(
    id: Id,
    payload: {
      path: string
      name: string
      width: number
      height: number
    },
  ): void

  show(id: Id): void
  hide(id: Id): void
  delayShow(id: Id, timeout: number): void

  /**
   * Set anchor point of an element
   */
  setAnchor(
    id: Id,
    payload: {
      x: number
      y: number
      ax: number
      ay: number
    },
  ): any

  /**
   * Set absolute position of an element
   */
  setPosition(
    id: Id,
    payload: {
      x: number
      y: number
    },
  ): void

  /**
   * Set animation of position
   */
  setPositionAnimation(id: Id, payload: PositionAnimationData[]): void

  /**
   * Set rotation angle of an element
   */
  setRotation(id: Id, payload: { rotation: number }): void

  /**
   *
   * @param id
   * @param payload
   */
  setRotationAnimatation(id: Id, payload: SimpleAnimationData[]): void

  /**
   * Set scale of an element
   */
  setScale(
    id: Id,
    payload: {
      x: number
      y: number
    },
  ): void

  /**
   * Set scale animation of an element
   */
  setScaleAnimatation(id: Id, payload: SimpleAnimationData[]): void

  /**
   *
   * @param id Element id
   * @param opacity Opacity of element, 0-100
   */
  setOpacity(id: Id, payload: { opacity: number }): void

  /**
   * Set (AKA fade)
   * @param id
   * @param payload
   */
  setOpacityAnimation(id: Id, payload: SimpleAnimationData[]): void

  /**
   * Append an element as child to another element
   */
  appendChild(id: Id, parentId: Id): void

  /**
   * Get node by id
   * @param id Element id
   */
  getNodeById(id: Id): any

  // TODO: shapes
  // createShape(id: Id, strokeWidth: number): void
  // drawCubicBezier(id: Id, points: BezierPoints, width: number, color: Color): void
  // drawCubicBezierAnimation(id: Id, data: ShapeAnimationData, width: number, color: Color): void
  // drawEllipse(id: Id, ...args: any[]): void
  // curveAnimate(id: Id, width: number, color: Color, config: any): any
}

export type ArrayColor = [number, number, number, number]

export enum LayerType {
  precomp = 0,
  solid = 1,
  image = 2,
  null = 3,
  shape = 4,
  text = 5,
}

export enum Shape {
  ellipse = 'el',
  group = 'gr',
  shape = 'sh',
  transform = 'tr',
  stroke = 'st',
  fill = 'fl',
  merge = 'mm',
}

export enum Effect {
  slider = 0,
  angle = 1,
  color = 2,
  point = 3,
  checkbox = 4,
  group = 5,
  dropDown = 7,
}

// export type opacityKeyframe = SimpleKeyframe
// export type

export type ArrayPoint = [number, number]

export type Point = { x: number; y: number }

export type BezierPoints = [Point, Point, Point, Point]

export type Keyframe = {
  t: number
  s: ArrayPoint
  e: ArrayPoint
  to: ArrayPoint
  ti: ArrayPoint
}

export type PositionAnimationData = {
  /**
   * Animation delay from start
   */
  delay: number
  /**
   * Animation duration
   */
  duration: number
  /**
   * Bezier points coordinate
   */
  points: BezierPoints
}

export type SimpleKeyframe = {
  t: number
  s: number[]
  e: number[]
}

export type SimpleAnimationData = {
  delay: number
  duration: number
  start: number[]
  end: number[]
}

export type BezierShape = {
  v: ArrayPoint[]
  o: ArrayPoint[]
  i: ArrayPoint[]
}

export type ShapeKeyframe = {
  t: number
  s: [BezierShape]
  e: [BezierShape]
}

export type ShapeAnimationData = {
  delay: number
  duration: number
  start: BezierPoints[]
  end: BezierPoints[]
}
