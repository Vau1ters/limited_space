import { application } from '@shrimp/application'
import { Component } from '@shrimp/ecs/component'
import { assert } from '@shrimp/utils/assertion'
import * as PIXI from 'pixi.js'

export type Layer = 'bg' | 'chrBack' | 'chr' | 'ui' | 'text'

export class Sprite implements Component
{
  private _sprite: PIXI.AnimatedSprite
  public constructor(
    private sprites: Map<string, PIXI.Texture[] | PIXI.FrameObject[]>,
    private currentAnim: string,
    layer: Layer,
    public anchor: {
      x: number,
      y: number
    } = {x: 0, y: 0}
  ) {
    const defaultAnim = sprites.get(currentAnim)
    assert(defaultAnim, `sprite has no ${currentAnim} animation`)
    this._sprite = new PIXI.AnimatedSprite(defaultAnim)
    this._sprite.play()
    this._sprite.zIndex = Sprite.layerToZIndex(layer)
    application.stage.addChild(this._sprite)
  }

  public static layerToZIndex(layer: Layer): number {
    switch (layer) {
      case 'bg':
        return 0
      case 'chrBack':
        return 1
      case 'chr':
        return 2
      case 'ui':
        return 3
      case 'text':
        return 4
    }
  }

  public remomveSprite() {
    application.stage.removeChild(this._sprite)
  }

  public changeAnimation(animName: string, continuePlay = false) {
    if (animName == this.currentAnim) {
      return
    }
    const currentFrame = this._sprite.currentFrame
    const anim = this.sprites.get(animName)
    assert(anim, `sprite has no ${animName} animation`)
    this._sprite.textures = anim
    this.currentAnim = animName
    if (continuePlay) {
      this._sprite.gotoAndPlay(currentFrame)
    } else {
      this._sprite.play()
    }
  }
  
  public get sprite(): PIXI.AnimatedSprite {
    return this._sprite
  }
}
