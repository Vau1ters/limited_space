import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Transform } from '@shrimp/component/transform'
import { Player as PlayerComponent } from '@game/component/player'
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
    {
      // 更新処理
      switch (player.phase) {
        case 'start':
          player.phase = 'move'
          break
        case 'move':
          if (Mouse.leftClick) {
            player.currentCellIndex++
            player.phase = 'moveAnim'
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
}
