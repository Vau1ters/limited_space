import * as PIXI from 'pixi.js'
import { Scene } from '@shrimp/scene'
import { World } from '@shrimp/ecs/world'
import { Entity } from '@shrimp/ecs/entity'

import { SpriteDef } from '@game/graphics/spriteDef'

import { Camera } from '@game/component/camera'
import { Player } from '@game/component/player'
import { Sprite } from '@game/component/sprite'
import { Graphics } from '@game/component/graphics'
import { Transform } from '@game/component/transform'
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


    // マップセル
    const cells: Entity[] = []
    const cell_num = 4
    const attributes: AttrType[] = 
      ['start', 'normal', 'zombie', 'goal']

    const pos: [number, number][] =
      [
        [0, 0],
        [0, 30],
        [0, 60],
        [0, 90],
      ]

    for (let i = 0; i < cell_num; i++) {
      cells.push(new Entity())
      cells[i].addComponent(new Transform(pos[i][0], pos[i][1]))
      cells[i].addComponent(new CellAttribute(attributes[i]))
      const gr = new PIXI.Graphics()

      switch(attributes[i]) {
        case 'start':
        case 'goal':
          gr.lineStyle(2, 0xFFFFFF, 1)
          gr.drawCircle(0, 0, 20)
          gr.beginFill(0xFFFFFF)
          gr.drawCircle(0, 0, 10)
          gr.endFill()
          break
        case 'normal':
          gr.beginFill(0xFFFFFF)
          gr.drawCircle(0, 0, 20)
          gr.endFill()
          break
        case 'zombie':
          gr.beginFill(0xFF0000)
          gr.drawCircle(0, 0, 20)
          gr.endFill()
          break
      }
      cells[i].addComponent(new Graphics(gr, 'bg'))
      this.world.addEntity(cells[i])
    }

    // バス
    const bus = new Entity()
    const defBus = SpriteDef.getDef('bus')
    bus.addComponent(new Player(0, cells))
    bus.addComponent(new Transform(0, 0))
    bus.addComponent(new Sprite(defBus, 'left', 'chr', {x: -16, y: -16}))
    this.world.addEntity(bus)
    const busBack = new Entity()
    busBack.addComponent(bus.getComponent(Transform))
    busBack.addComponent(new Sprite(defBus, 'leftBack', 'chrBack', {x: -16, y: -16}))
    this.world.addEntity(busBack)

    // カメラ
    const camera = new Entity()
    camera.addComponent(new Transform(0, 0))
    camera.addComponent(new Camera(bus))
    this.world.addEntity(camera)
  }

  public exec() {
    this.world.execute()
  }

  public getNextScene() {
    return this
  }
}
