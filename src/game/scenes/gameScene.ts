import { Scene } from '@shrimp/scene'
import { application } from'@shrimp/application'
import * as PIXI from 'pixi.js'
import { World } from '@shrimp/ecs/world'
import { Entity } from '@shrimp/ecs/entity'
import { Camera } from '@game/component/camera'
import { Camera as CameraSystem } from '@game/system/camera'
import { Player } from '@game/system/player'
import { Draw } from '@game/system/draw'
import { Sprite } from '@game/component/sprite'
import { Graphics } from '@game/component/graphics'
import { Transform } from '@game/component/transform'
import { MapAttribute, AttrType } from '@game/component/mapAttribute'

export class GameScene implements Scene {
  private readonly world: World
  public constructor() {
    this.world = new World()
    this.world.addSystem(new Player(this.world))
    this.world.addSystem(new Draw(this.world))
    this.world.addSystem(new CameraSystem(this.world))

    const { default: url } = require('res/bus.png') // eslint-disable-line  @typescript-eslint/no-var-requires


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
      cells[i].addComponent(new MapAttribute(attributes[i]))
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
      application.stage.addChild(gr)
      cells[i].addComponent(new Graphics(gr))
      this.world.addEntity(cells[i])
    }

    // バス
    const sprite = PIXI.Sprite.from(url)

    application.stage.addChild(sprite)
    const bus = new Entity()
    bus.addComponent(new Transform(0, 0))
    bus.addComponent(new Sprite(sprite))
    this.world.addEntity(bus)

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
