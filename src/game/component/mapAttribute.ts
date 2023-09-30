import { Component } from '@shrimp/ecs/component'

export type AttrType = 'start' | 'normal' | 'zombie' | 'goal'

export class MapAttribute implements Component
{

  public constructor(
    public attr: AttrType
  ){ }

}
