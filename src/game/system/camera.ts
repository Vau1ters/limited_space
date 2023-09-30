import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Player } from '@game/component/player'
import { Camera as CameraComponent } from '@game/component/camera'
import { windowSize } from '@shrimp/application'

export class Camera extends System {
  private playerFamily = new Family([Transform, Player])
  private cameraFamily = new Family([Transform, CameraComponent])

  public constructor(world: World) {
    super(world)
    this.playerFamily.init(this.world)
    this.cameraFamily.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    const camera = this.cameraFamily.getSingleton()
    const cameraComponent = camera.getComponent(CameraComponent)
    const transTarget = cameraComponent.target.getComponent(Transform)
    const transCamera = camera.getComponent(Transform)
    transCamera.x = transTarget.x + 8 - windowSize.width / 2
    transCamera.y = transTarget.y + 8 - windowSize.height / 2
  }
}
