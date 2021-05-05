export class NodeTree {
  constructor(tag) {
    this.tag = tag;
    this.parent = null;
    this.children = [];
    this.pos = { x: 0, y: 0 };
    this.rad = 30;
  }

  set Position(position) {
    this.pos = position;
  }
  get Position() {
    return this.pos;
  }
  set Parent(parent) {
    this.parent = parent;
  }

  addChilde(childe) {
    this.children.push = childe;
  }

  get getTag() {
    return this.tag;
  }
}
