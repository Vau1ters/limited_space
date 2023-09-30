import { application } from '@shrimp/application'
import { Component } from '@shrimp/ecs/component'
import { Layer, Sprite } from '@shrimp/component/sprite'
import * as PIXI from 'pixi.js'

export class Graphics implements Component
{
  public constructor(
    public graphics: PIXI.Graphics,
    layer: Layer
  ) {
    graphics.zIndex = Sprite.layerToZIndex(layer)
    application.stage.addChild(this.graphics)
  }
}
