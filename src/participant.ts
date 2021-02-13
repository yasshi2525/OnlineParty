import { consts } from "./constants";

export type ParticipantParameter = {
  scene: g.Scene;
  parent: g.E;
  x: number;
  y: number;
};

export class Participant {
  readonly view: g.E;
  constructor(opts: ParticipantParameter) {
    this.view = new g.FilledRect({
      scene: opts.scene,
      parent: opts.parent,
      tag: "参加者パネル",
      x: opts.x - consts.participant.size / 2,
      y: opts.y - consts.participant.size / 2,
      width: consts.participant.size,
      height: consts.participant.size,
      cssColor: "#ff0000",
      touchable: true
    });
    let pointerID = -1;
    let isDragging = false;
    this.view.onPointDown.add(e => {
      if (!isDragging) {
        isDragging = true;
        pointerID = e.pointerId;
      }
    });
    this.view.onPointMove.add(e => {
      if (pointerID === e.pointerId) {
        this.view.x += e.prevDelta.x;
        this.view.y += e.prevDelta.y;
        this.view.modified();
      }
    });
    this.view.onPointUp.add(e => {
      if (pointerID === e.pointerId) {
        isDragging = false;
      }
    });
  }
}
