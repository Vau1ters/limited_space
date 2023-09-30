import { application } from '@shrimp/application'
import { Component } from '@shrimp/ecs/component'
import { Sprite } from '@shrimp/component/sprite'
import * as PIXI from 'pixi.js'

export class UI implements Component
{
  private _text: PIXI.Text
  private graphics: PIXI.Graphics
  public showTextNum: number
  public constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    private text: string,
    style: Partial<PIXI.ITextStyle> | PIXI.TextStyle | undefined = undefined,
    private showAll: boolean = false
  ){
    // ウィンドウを描く
    this.graphics = new PIXI.Graphics()
    this.graphics.beginFill(0x000000)
    this.graphics.drawRoundedRect(x, y, width, height, 12)
    this.graphics.endFill()
    this.graphics.lineStyle(2, 0xFFFFFF, 1)
    this.graphics.drawRoundedRect(x, y, width, height, 12)

    this.graphics.zIndex = Sprite.layerToZIndex('ui')
    application.stage.addChild(this.graphics)

    // テキスト初期化
    this._text = new PIXI.Text('', style)
    this._text.zIndex = Sprite.layerToZIndex('text')
    this._text.position.x = x + 16
    this._text.position.y = y + 16
    if (showAll) {
      this.showTextNum = text.length
    } else {
      this.showTextNum = 0
    }

    application.stage.addChild(this._text)
  }

  public setText(text: string) {
    this.text = text
    if (this.showAll) {
      this.showTextNum = text.length
    } else {
      this.showTextNum = 0
    }
  }

  public updateText() {
    this._text.text = this.text.slice(0, this.showTextNum)
    this.showTextNum++
  }

  // クリックで送れるか
  public isShown(): boolean {
    return this.showTextNum > this.text.length
  }

  // クリック連打でスキップしたい時用
  public showTextAll() {
    this.showTextNum = this.text.length
    this.updateText()
  }
}
