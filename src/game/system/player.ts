import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Transform } from '@shrimp/component/transform'
import { Player as PlayerComponent } from '@game/component/player'
import { Show } from '@game/component/show'
import { UI } from '@game/component/ui'
import { Mouse } from './mouse'
import { lerp } from '@shrimp/math/math'

export class Player extends System {
  private family = new Family([Transform, PlayerComponent])

  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    const [trans, player] = this.family.getSingleton().getComponents([Transform, PlayerComponent])
    const [UiText, showText] = player.textWindow.getComponents([UI, Show])

    // 更新処理
    switch (player.phase) {
      case 'start':
        if (Mouse.leftClick) {
          if (UiText.isShownAll()) {
            player.phase = 'move'
            UiText.setText('クリックで次のマスへ', 1)
          } else {
            UiText.showTextAll()
          }
        }
        break
      case 'move':
        if (Mouse.leftClick) {
          player.currentCellIndex++
          player.phase = 'moveAnim'
          showText.show = false
        }
        break
      case 'moveAnim':
        player.ratioMove += 0.01

        if (player.ratioMove > 1) {
          player.prevCellIndex = player.currentCellIndex
          player.ratioMove = 0
          player.phase = 'event'
        }
        break
      case 'event':
        player.phase = 'move'
        break
    }
    // アニメーション処理
    const cellPrev = player.cells[player.prevCellIndex]
    const cell = player.cells[player.currentCellIndex]
    const transCellPrev = cellPrev.getComponent(Transform)
    const transCell = cell.getComponent(Transform)
    trans.x = lerp(transCellPrev.x, transCell.x, player.ratioMove)
    trans.y = lerp(transCellPrev.y, transCell.y, player.ratioMove)
  }
}
