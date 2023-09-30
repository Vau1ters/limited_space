import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Player as PlayerComponent } from '@game/component/player'

export class Player extends System {
  private family = new Family([Transform, PlayerComponent])

  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    for (const [trans, player] of this.family)
    {
      // 更新処理
      // アニメーション処理
      const cell = player.cells[player.currentCellIndex]
      const transCell = cell.getComponent(Transform)
      trans.x = transCell.x
      trans.y = transCell.y
    }
  }
}
