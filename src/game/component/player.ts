import { Entity } from '@shrimp/ecs/entity'
import { Component } from '@shrimp/ecs/component'

export class Player implements Component
{
  public prevCellIndex: number
  public ratioMove: number
  public constructor(
    public currentCellIndex: number,
    public cells: Entity[]
  ) {
    this.prevCellIndex = this.currentCellIndex
    this.ratioMove = 0
  }
}
