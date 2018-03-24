// import { v4 } from 'uuid'
import { Options, Layer, Shape, Effect } from './types'
/// <reference path="../typings/cocos2d/cocos2d-lib.d.ts" />

const { v4 } = (window as any).uuid
const genId = () => 'v' + v4().replace(/-/g, '_F') // for lua variables

export function traverse(
  data: any,
  containerId: string,
  useSpriteFrame: boolean,
  options: Options,
) {
  const getTime = (time: number) => time / data.fr
  // const getTime = (time: number) => time

  let assets: {
    [id: string]: any
  }

  function getAsset(id: string) {
    if (!assets) {
      assets = {}
      for (let asset of data.assets) {
        if (asset.id) {
          assets[asset.id] = asset
        }
      }
    }
    return assets[id]
  }

  function _traverseShape(
    data: any,
    parentId: string,
    parentWidth: number,
    parentHeight: number,
    id?: string,
    d?: any,
  ) {
    switch (data.ty) {
      case Shape.group: {
        const id = genId()
        const d = {
          id,
          width: 0,
          color: { r: 0, g: 0, b: 0, a: 0 },
          data: [],
        }
        for (let item of data.it) {
          _traverseShape(item, parentId, parentWidth, parentHeight, id, d)
        }
        options.createDrawNode(id, parentId, d.width)
        d.data.forEach((item: any[]) => {
          options.drawCubicBezier(
            id,
            item[0],
            item[1],
            item[2],
            item[3],
            d.width,
            d.color,
          )
        })
        // options.curveAnimate(id, 10, { r: 255, g: 0, b: 0, a: 255 }, d.data)
      }
      case Shape.stroke: {
        if (id) {
          const [r, g, b, a] = (data.c.k as any[]).map(x => x * 255)
          d.color = { r, g, b, a }
          d.width = data.w.k
        }
      }
      case Shape.shape: {
        if (id && d) {
          const c = (x: any) => {
            const { i, o, v } = x
            d.data = []
            for (let j = 0; j < v.length - 1; j++) {
              d.data.push([
                { x: v[j][0], y: parentHeight - v[j][1] },
                { x: v[j][0] + o[j][0], y: parentHeight - v[j][1] - o[j][1] },
                {
                  x: v[j + 1][0] + i[j + 1][0],
                  y: parentHeight - v[j + 1][1] - i[j + 1][1],
                },
                { x: v[j + 1][0], y: parentHeight - v[j + 1][1] },
              ])
            }
          }
          if (data.ks) {
            if (data.ks.a) {
              c(data.ks.k[0].s[0])
              // animation
              // FIXME: shape animation
              // d.data = data.ks.k[0]
            } else {
              c(data.ks.k)
            }
          }
        }
      }
    }
  }

  // function _traverseEffect(data: any, parentId: string, node: cc.DrawNode) {
  //   switch (data.ty) {
  //     case Effect.group: {
  //       if (data.mn === 'ADBE Gaussian Blur 2') {
  //       }
  //       for (let item of data.ef) {
  //         _traverseEffect(item, parentId, node)
  //       }
  //     }
  //     case Effect.dropDown: {
  //     }
  //   }
  // }

  function _applyAnchor(
    layer: any,
    id: string,
    width: number,
    height: number,
  ) {}

  function _applyTransform(
    layer: any,
    id: string,
    parentId: string,
    width: number,
    height: number,
    parentWidth: number,
    parentHeight: number,
    st: number,
    options: Options,
  ) {
    const parseK = (k: any[]) => {
      return k.reduceRight(
        (result, item, i) => {
          const { s, e, to, ti, t } = item
          if (s) {
            result.arr.unshift({
              s,
              e,
              to,
              ti,
              t: getTime(result.nextTime - t),
              startTime: i === 0 ? getTime(t) : 0,
            })
          }
          result.nextTime = t
          return result
        },
        {
          nextTime: null,
          arr: [],
        },
      )
    }

    // anchor
    if (layer.ks.a && layer.ks.a.k) {
      const [x, y] = layer.ks.a.k
      if (typeof x === 'number' && typeof y === 'number') {
        options.setAnchorPoint(id, x / width, 1 - y / height)
      } else {
        console.log('Anchor error: ', id, layer.ks.a)
      }
    }

    // position
    if (layer.ks.p) {
      const { k } = layer.ks.p
      if (typeof k[0] === 'number') {
        var [x, y] = k
        options.setPosition(id, x, parentHeight - y)
      } else if (k.length) {
        const [x, y] = k[0].s
        options.setPosition(id, x, parentHeight - y)
        options.positionAnimate(id, parseK(k).arr, getTime(st), parentHeight)
      }
    }

    // rotation
    if (layer.ks.r && layer.ks.r.k) {
      const { k } = layer.ks.r
      if (typeof k === 'number') {
        options.setRotation(id, k)
      } else if (typeof k[0] === 'number') {
        options.setRotation(id, k[0])
      } else {
        options.setRotation(id, k[0].s[0])
        options.rotationAnimate(id, parseK(k).arr, getTime(st))
      }
    }

    // scale
    if (layer.ks.s) {
      const { k } = layer.ks.s
      if (typeof k[0] === 'number') {
        const [x, y] = k
        options.setScale(id, x / 100, y / 100)
      } else {
        const [x, y] = k[0].s
        options.setScale(id, x / 100, y / 100)
        options.scaleAnimate(id, parseK(k).arr, getTime(st))
      }
    }
  }

  function _traverseLayer(
    layer: any,
    parentId: string,
    options: Options,
    st: number,
    parentWidth: number,
    parentHeight: number,
  ) {
    // console.log(layer.nm)

    switch (layer.ty) {
      case Layer.shape: {
        const id = genId()
        // same width and height as parent
        options.createLayer(id, parentWidth, parentHeight)
        _applyTransform(
          layer,
          id,
          parentId,
          parentWidth,
          parentHeight,
          parentWidth,
          parentHeight,
          st,
          options,
        )
        options.addChild(id, parentId)
        for (let shape of layer.shapes) {
          _traverseShape(shape, id, parentWidth, parentHeight)
        }
        break
      }
      case Layer.solid: {
        break
      }
      case Layer.image: {
        const id = layer.refId
        const asset = getAsset(id)
        if (!asset) break
        // TODO: sprite frame
        options.createSprite(
          id,
          (useSpriteFrame ? '' : asset.u) + asset.p,
          asset.w,
          asset.h,
        )
        options.setContentSize(id, asset.w, asset.h)
        options.addChild(id, parentId)
        _applyTransform(
          layer,
          id,
          parentId,
          asset.w,
          asset.h,
          parentWidth,
          parentHeight,
          st,
          options,
        )

        break
      }
      case Layer.null:
      case Layer.precomp: {
        const id = layer.refId || genId()
        layer.xid = id

        // precomp
        options.createLayer(id, layer.w, layer.h)

        // size
        // options.setContentSize(id, layer.w || asset.w, layer.h || asset.h)

        if (layer.ks.s && layer.ks.s.k) {
          const [x, y] = layer.ks.s.k
          if (typeof x === 'number' && typeof y === 'number') {
          }
        }

        if (layer.ks.o) {
        }

        _applyTransform(
          layer,
          id,
          parentId,
          layer.w,
          layer.h,
          parentWidth,
          parentHeight,
          st,
          options,
        )

        // effects
        if (layer.ef) {
          for (let item of layer.ef) {
            // _traverseEffect(item, parentId)
          }
        }

        const asset = getAsset(id)
        if (asset && asset.layers) {
          // FIXME: parent before child
          const sortedLayers = []
          const indexIdMapping: any = {}
          for (let l of asset.layers) {
            if (l.parent) {
              sortedLayers.push(l)
            } else {
              sortedLayers.unshift(l)
            }
            if (l.ind) {
              indexIdMapping[l.ind] = l
            }
          }

          for (let l of sortedLayers) {
            const correctId = l.parent ? indexIdMapping[l.parent].xid : id
            const parentWidth =
              (l.parent ? indexIdMapping[l.parent] : layer).w || 0
            const parentHeight =
              (l.parent ? indexIdMapping[l.parent] : layer).h || 0
            _traverseLayer(
              l,
              correctId,
              options,
              st + (layer.st || 0),
              parentWidth,
              parentHeight,
            )
          }
        }

        options.addChild(id, parentId)
        break
      }
    }
  }

  for (let layer of data.layers) {
    _traverseLayer(layer, containerId, options, 0, data.w, data.h)
  }
}
