import Actor from './actors-constructor';
import Location from './locations-constructor';

let key = 1;

export default class Scene {
  constructor() {
    this.displayActors = false;
    this.title = '';
    this.position = 0;
    this.paragraphs = [''];
    this.paragraphsHTML = [''];
    this.actors = [new Actor()];
    this.locations = [];
    this.whichModule = null;
    this.mapModules = '';
    this.key = key++;
  }
  getPosition(index) {
    this.position = index;
  }
}
