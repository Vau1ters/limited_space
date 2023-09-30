import * as PIXI from 'pixi.js'
import { TextStyle } from 'pixi.js'
import { Scene } from '@shrimp/scene'
import { World } from '@shrimp/ecs/world'
import { Entity } from '@shrimp/ecs/entity'

import { SpriteDef } from '@shrimp/graphics/spriteDef'

import { Camera } from '@game/component/camera'
import { Player } from '@game/component/player'
import { Sprite } from '@shrimp/component/sprite'
import { Show } from '@game/component/show'
import { Graphics } from '@game/component/graphics'
import { UI } from '@game/component/ui'
import { Transform } from '@shrimp/component/transform'
import { CellAttribute, AttrType } from '@game/component/cellAttribute'

import { Camera as CameraSystem } from '@game/system/camera'
import { Mouse } from '@game/system/mouse'
import { Player as PlayerSystem } from '@game/system/player'
import { Draw } from '@game/system/draw'

export class GameScene implements Scene {
  private readonly world: World
  public constructor() {
    this.world = new World()
    this.world.addSystem(new Mouse(this.world))
    this.world.addSystem(new PlayerSystem(this.world))
    this.world.addSystem(new CameraSystem(this.world))
    this.world.addSystem(new Draw(this.world))

    // Sprite設定
    SpriteDef.defineSpriteDef('bus', 4,
      new Map([
        ['left', [{idx: 0, time: 100}, {idx: 1, time: 100}]],
        ['leftBack', [{idx: 2, time: 100}, {idx: 3, time: 100}]]
      ]))

    SpriteDef.defineSpriteDef('ground', 3,
      new Map([
        ['left', [0]],
        ['middle', [1]],
        ['right', [2]],
      ]))


    // マップセル
    const cellRadius = 16
    const cells: Entity[] = []
    const cell_num = 4
    const attributes: AttrType[] = 
      ['start', 'normal', 'zombie', 'goal']

    const posCells: number[] =
      [
        0,
        32 * 4,
        32 * 8,
        32 * 12,
      ]

    for (let i = 0; i < cell_num; i++) {
      cells.push(new Entity())
      cells[i].addComponent(new Transform(-posCells[i], 0))
      cells[i].addComponent(new CellAttribute(attributes[i]))
      const gr = new PIXI.Graphics()

      switch(attributes[i]) {
        case 'start':
        case 'goal':
          gr.lineStyle(2, 0xFFFFFF, 1)
          gr.drawCircle(0, 0, cellRadius)
          gr.beginFill(0xFFFFFF)
          gr.drawCircle(0, 0, cellRadius - 6)
          gr.endFill()
          break
        case 'normal':
          gr.beginFill(0xFFFFFF)
          gr.drawCircle(0, 0, cellRadius)
          gr.endFill()
          break
        case 'zombie':
          gr.beginFill(0xFF0000)
          gr.drawCircle(0, 0, cellRadius)
          gr.endFill()
          break
      }

      cells[i].addComponent(new Graphics(gr, 'bg'))
      cells[i].addComponent(new Show())
      this.world.addEntity(cells[i])
    }

    // 道
    const lengths: number[] = []
    for (let i = 0; i < posCells.length - 1; i++) {
      lengths[i] = posCells[i + 1] - posCells[i] - cellRadius * 2
    }

    for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      const count = Math.floor(lengths[cellIndex] / 32)
      for (let roadIndex = 0; roadIndex < count; roadIndex++) {
        const road = new Entity()
        road.addComponent(new Transform(-posCells[cellIndex] - roadIndex * 32 - cellRadius - 16, 0))
        const defRoad = SpriteDef.getDef('ground')
        let pattern: string
        if (roadIndex == 0) {
          pattern = 'right'
        } else if (roadIndex == count - 1) {
          pattern = 'left'
        } else {
          pattern = 'middle'
        }
        road.addComponent(new Sprite(defRoad, pattern, 'bg', {x: -16, y: -16}))
        road.addComponent(new Show())
        this.world.addEntity(road)
      }
    }

    // テキストウィンドウ
    const textWindow = new Entity()

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 12,
      fill: ['#FFFFFF'],
    });

    textWindow.addComponent(new UI(16, 140, 288, 80, '街は突如としてゾンビウイルスに侵された。\nバスを運転していた私は\nこのまま街から逃げざるを得なかった。', style, false, 5))
    textWindow.addComponent(new Show())
    this.world.addEntity(textWindow)

    // バス
    const bus = new Entity()
    const defBus = SpriteDef.getDef('bus')
    bus.addComponent(new Player(0, cells, textWindow))
    bus.addComponent(new Transform(0, 0))
    bus.addComponent(new Sprite(defBus, 'left', 'chr', {x: -16, y: -16}))
    const show = new Show()
    bus.addComponent(show)
    this.world.addEntity(bus)
    const busBack = new Entity()
    busBack.addComponent(bus.getComponent(Transform))
    busBack.addComponent(new Sprite(defBus, 'leftBack', 'chrBack', {x: -16, y: -16}))
    busBack.addComponent(show)
    this.world.addEntity(busBack)

    // カメラ
    const camera = new Entity()
    camera.addComponent(new Transform(0, 0))
    camera.addComponent(new Camera(bus, -128, 0))
    this.world.addEntity(camera)
  }

  public exec() {
    this.world.execute()
  }

  public getNextScene() {
    return this
  }
}
