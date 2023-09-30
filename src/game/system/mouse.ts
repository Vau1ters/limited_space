import { application } from '@shrimp/application'
import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'

export class Mouse extends System {
  public static leftClick: boolean
  private static leftHoldPrev: boolean
  public static leftHold: boolean
  public static x: number
  public static y: number

  public constructor(world: World) {
    super(world)
  }

  public init() { 
    Mouse.leftClick = false
    Mouse.leftHold = true
    Mouse.x = 0
    Mouse.y = 0
    window.addEventListener('mousedown', (e) => {
      if (e.button == 0) {
        Mouse.leftHold = true
      }
    })
    window.addEventListener('mouseup', (e) => {
      if (e.button == 0) {
        Mouse.leftHold = false
      }
    })
  }

  public execute(): void {
    // 座標取得
    const pos = application.renderer.plugins.interaction.mouse.getLocalPosition(application.stage)
    Mouse.x = pos.x
    Mouse.y = pos.y

    // クリック判定
    Mouse.leftClick = !Mouse.leftHold && Mouse.leftHoldPrev

    Mouse.leftHoldPrev = Mouse.leftHold
  }
}
