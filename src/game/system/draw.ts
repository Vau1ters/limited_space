import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Camera } from '@game/component/camera'
import { UI } from '@game/component/ui'
import { Show } from '@game/component/show'
import { Graphics } from '@game/component/graphics'
import { Sprite } from '@shrimp/component/sprite'
import { Transform } from '@shrimp/component/transform'
import { assert } from '@shrimp/utils/assertion'

export class Draw extends System {
  private family = new Family([Transform, Sprite, Show])
  private familyBg = new Family([Transform, Graphics, Show])
  private familyUi = new Family([UI, Show])
  private familyCamera = new Family([Transform, Camera])

  private familyInvalid = new Family([Transform, Sprite], [Show])
  private familyInvalidBg = new Family([Transform, Graphics], [Show])
  private familyInvalidUi = new Family([UI], [Show])

  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
    this.familyBg.init(this.world)
    this.familyCamera.init(this.world)
    this.familyUi.init(this.world)

    this.familyInvalid.init(this.world)
    this.familyInvalidBg.init(this.world)
    this.familyInvalidUi.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    // Show忘れチェック
    assert(this.familyInvalid.hasNoMember, 'Show忘れ')
    assert(this.familyInvalidBg.hasNoMember, 'Show忘れ')
    assert(this.familyInvalidUi.hasNoMember, 'Show忘れ')


    const camera = this.familyCamera.getSingleton()
    const transCamera = camera.getComponent(Transform)

    for (const [ui, show] of this.familyUi) {
      ui.graphics.renderable = ui.text.renderable = show.show
      if (show.show) {
        ui.updateText()
      }
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
