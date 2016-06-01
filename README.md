# startWebAudio
[![NPM Version](http://img.shields.io/npm/v/start-web-audio.svg?style=flat-square)](https://www.npmjs.org/package/start-web-audio)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> chore function for starting web audio in mobile Safari

## Installation

```
npm install start-web-audio
```

downloads:

- [start-web-audio.js](https://raw.githubusercontent.com/mohayonao/start-web-audio/master/index.js)

## API
- `startWebAudio(audioContext, [ elem, requireUserAction, callback ]): void`
  - attach event listeners to `elem` for starting Web Audio API
  - `audioContext: AudioContext`
  - `elem: EventTarget`
    - a target of event listener - _default: **window**_
  - `requireUserAction: boolean`
    - require user action  - _default: **false**_
    - this option is useful, when want to use the same workflow in all devices.
  - `callback: function`
    - called when Web Audio API has been started - _default: noop_

## Usage

```js
var audioContext = new AudioContext();

startWebAudio(audioContext, function() {
  console.log("web audio is now available");
});

setInterval(function() {
  var oscillator = audioContext.createOscillator();

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
  oscillator.connect(audioContext.destination);
}, 1000);
```

## License

MIT
