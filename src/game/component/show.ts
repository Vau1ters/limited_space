import { Component } from '@shrimp/ecs/component'

export class Show implements Component
{
  public constructor(
    public show: boolean = true
  ) { }
}
