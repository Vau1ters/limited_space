import { Component } from '@shrimp/ecs/component'

export type AttrType = 'start' | 'normal' | 'zombie' | 'goal'

export class CellAttribute implements Component
{

  public constructor(
    public attr: AttrType
  ){ }

}
