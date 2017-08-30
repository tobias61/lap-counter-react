import Runner from './data/models/Runner';
import Lap from './data/models/Lap';

class LapSimulator {
  constructor() {}

  start() {
    Runner.findAll().then(res => {
      this.interval = setInterval(() => {
        const max = res.length - 1;
        const min = 0;
        const index = this.getRandomInt(min, max);
        const runner = res[index];
        console.log('Add Lap', runner.id, index);
        Lap.create({
          runner_id: runner.id,
        });
      }, 1000);
    });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  stop() {
    if (this.interval) {
      this.interval.cancel();
    }
  }
}

export default LapSimulator;
