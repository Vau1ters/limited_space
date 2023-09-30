import { Entity } from '@shrimp/ecs/entity'
import { Component } from '@shrimp/ecs/component'

export type Phase = 'start' | 'move' | 'moveAnim' | 'event'


export class Player implements Component
{
  public prevCellIndex: number
  public ratioMove: number
  public phase: Phase = 'start'
  public constructor(
    public currentCellIndex: number,
    public cells: Entity[],
    public textWindow: Entity
  ) {
    this.prevCellIndex = this.currentCellIndex
    this.ratioMove = 0
  }
}
