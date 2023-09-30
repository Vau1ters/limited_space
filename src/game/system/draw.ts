import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Camera } from '@game/component/camera'
import { UI } from '@game/component/ui'
import { Graphics } from '@game/component/graphics'
import { Sprite } from '@shrimp/component/sprite'
import { Transform } from '@shrimp/component/transform'

export class Draw extends System {
  private family = new Family([Transform, Sprite], [UI])
  private familyBg = new Family([Transform, Graphics], [UI])
  private familyUi = new Family([UI])
  private familyCamera = new Family([Transform, Camera])

  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
    this.familyBg.init(this.world)
    this.familyCamera.init(this.world)
    this.familyUi.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    const camera = this.familyCamera.getSingleton()
    const transCamera = camera.getComponent(Transform)

    for (const [ui] of this.familyUi) {
      ui.updateText()
    }

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
