import { application } from '@shrimp/application'
import { Component } from '@shrimp/ecs/component'
import { Sprite } from '@shrimp/component/sprite'
import * as PIXI from 'pixi.js'

export class UI implements Component
{
  private _text: PIXI.Text
  private _graphics: PIXI.Graphics
  public showTextNum: number
  public currentDelayTime: number
  public constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    private windowText: string,
    style: Partial<PIXI.ITextStyle> | PIXI.TextStyle | undefined = undefined,
    private showAll: boolean = true,
    private delayTime: number = 0
  ){
    // ウィンドウを描く
    this._graphics = new PIXI.Graphics()
    this._graphics.beginFill(0x000000)
    this._graphics.drawRoundedRect(x, y, width, height, 12)
    this._graphics.endFill()
    this._graphics.lineStyle(2, 0xFFFFFF, 1)
    this._graphics.drawRoundedRect(x, y, width, height, 12)

    this._graphics.zIndex = Sprite.layerToZIndex('ui')
    application.stage.addChild(this._graphics)

    // テキスト初期化
    this._text = new PIXI.Text('', style)
    this._text.zIndex = Sprite.layerToZIndex('text')
    this._text.position.x = x + 16
    this._text.position.y = y + 16

    this.currentDelayTime = 0
    if (showAll) {
      this.showTextNum = windowText.length
    } else {
      this.showTextNum = 0
    }

    application.stage.addChild(this._text)
  }

  public setText(text: string, delayTime: number = this.delayTime) {
    this.windowText = text
    if (this.showAll) {
      this.showTextNum = text.length
    } else {
      this.showTextNum = 0
      this.delayTime = delayTime
    }
  }

  public updateText() {
    this.currentDelayTime++
    if (this.currentDelayTime >= this.delayTime) {
    this._text.text = this.windowText.slice(0, this.showTextNum)
    this.showTextNum++
      this.currentDelayTime = 0
    }
  }

  // クリックで送れるか
  public isShownAll(): boolean {
    return this.showTextNum > this.windowText.length
  }

  // クリック連打でスキップしたい時用
  public showTextAll() {
    this.showTextNum = this.windowText.length
    this.updateText()
  }

  public get graphics(): PIXI.Graphics {
    return this._graphics
  }
  public get text(): PIXI.Text {
    return this._text
  }
}
