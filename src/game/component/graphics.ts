import { application } from '@shrimp/application'
import { Component } from '@shrimp/ecs/component'
import { Layer, Sprite } from '@shrimp/component/sprite'
import * as PIXI from 'pixi.js'

export class Graphics implements Component
{
  public constructor(
    private _graphics: PIXI.Graphics,
    layer: Layer
  ) {
    _graphics.zIndex = Sprite.layerToZIndex(layer)
    application.stage.addChild(this._graphics)
  }

  public get graphics(): PIXI.Graphics {
    return this._graphics
  }
}
