import { Component } from '@shrimp/ecs/component'
import { Entity } from '@shrimp/ecs/entity';

export class Camera implements Component
{
  public constructor(
    public target: Entity,
    public anchorX: number,
    public anchorY: number
  ) { }
}
