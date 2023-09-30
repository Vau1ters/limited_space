import { Component } from '@shrimp/ecs/component'
import * as PIXI from 'pixi.js'

export class Graphics implements Component
{
  public constructor(
    public graphics: PIXI.Graphics
  ) { }
}
