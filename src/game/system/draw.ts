import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Camera } from '@game/component/camera'
import { Graphics } from '@game/component/graphics'
import { Sprite } from '@game/component/sprite'
import { Transform } from '@game/component/transform'

export class Draw extends System {
  private family = new Family([Transform, Sprite])
  private familyBg = new Family([Transform, Graphics])
  private familyCamera = new Family([Transform, Camera])

  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
    this.familyBg.init(this.world)
    this.familyCamera.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    const camera = this.familyCamera.getSingleton()
    const transCamera = camera.getComponent(Transform)

    for (const [trans, graphics] of this.familyBg)
    {
      graphics.graphics.x = trans.x - transCamera.x
      graphics.graphics.y = trans.y - transCamera.y
    }
    for (const [trans, sprite] of this.family)
    {
      sprite.sprite.x = trans.x - transCamera.x + sprite.anchor.x
      sprite.sprite.y = trans.y - transCamera.y + sprite.anchor.y
    }
  }
}
