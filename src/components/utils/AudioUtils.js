function generateTranscript(text, cb) {
  var sdk = require("microsoft-cognitiveservices-speech-sdk");
  var subscriptionKey = "09336b849227439bb2432601c4850a28";
  var serviceRegion = "eastus";
  // var filename = "YourAudioFile.wav";

  // var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
  var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  // create the speech synthesizer.
  // var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  var synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

  const trans = {
    transcript: text,
    words: [],
  };

  const startIndices = []

  var preTime = 0;

  synthesizer.wordBoundary = function (s, e) {
    // console.log("(WordBoundary), Text: " + e.text + ", Audio offset: " + e.audioOffset / 10000 + "ms.");
    let curTime = parseFloat((e.audioOffset / 10000000).toFixed(3));
    trans.words.push({
      startTime: preTime,
      endTime: curTime,
      selected: false,
      speakerTag: 0
    })
    startIndices.push(e.textOffset);
    preTime = curTime;
  };

  synthesizer.speakTextAsync(text,
    function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails +
          "\nDid you update the subscription info?");
      }
      synthesizer.close();
      synthesizer = undefined;

      for (let i = 0; i < startIndices.length; i++) {
        var word = '';
        if (i != startIndices.length - 1) {
          word = text.slice(startIndices[i], startIndices[i + 1])
        } else {
          word = text.slice(startIndices[i])
        }
        trans.words[i].word = word.trim()
      }
      const audioContext = new AudioContext();
      cb(trans, audioContext.decodeAudioData(result.audioData));
    },
    function (err) {
      console.trace("err - " + err);
      synthesizer.close();
      synthesizer = undefined;
      cb(undefined, undefined)
    });
}

async function getEndTime(text) {
  return new Promise((resolve, reject) => {
    var sdk = require("microsoft-cognitiveservices-speech-sdk");
    var subscriptionKey = "09336b849227439bb2432601c4850a28";
    var serviceRegion = "eastus";
    // var filename = "YourAudioFile.wav";

    // var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

    // create the speech synthesizer.
    // var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

    const trans = {
      transcript: text,
      words: [],
    };

    const startIndices = []

    var preTime = 0;

    synthesizer.wordBoundary = function (s, e) {
      let curTime = parseFloat((e.audioOffset / 10000000).toFixed(3));
      trans.words.push({
        startTime: preTime,
        endTime: curTime,
        selected: false,
        speakerTag: 0
      })
      startIndices.push(e.textOffset);
      preTime = curTime;
    };

    synthesizer.speakTextAsync(text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
        } else {
          console.error("Speech synthesis canceled, " + result.errorDetails +
            "\nDid you update the subscription info?");
        }
        synthesizer.close();
        synthesizer = undefined;

        for (let i = 0; i < startIndices.length; i++) {
          var word = '';
          if (i != startIndices.length - 1) {
            word = text.slice(startIndices[i], startIndices[i + 1])
          } else {
            word = text.slice(startIndices[i])
          }
          trans.words[i].word = word.trim()
        }
        resolve(trans.words[trans.words.length - 1].endTime);
        // cb(trans.words[trans.words.length-1].endTime);
        // return trans.words[trans.words.length-1].endTime
      },
      (err) => {
        // console.trace("err - " + err);
        synthesizer.close();
        // synthesizer = undefined;
        reject(err);
      });
  })
}


function dataURItoBlob(dataURI) {
  if (!dataURI) {
    return null;
  }
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
  const byteString = atob(dataURI.split(',')[1]); //base64 解码
  const arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
  const intArray = new Uint8Array(arrayBuffer); //创建视图

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], { type: mimeString });
}

async function blobToAudioBuffer(blob) {
  if (!blob) {
    return new Promise((resolve) => {
      resolve(new AudioBuffer({ length: 8000, numberOfChannels: 2, sampleRate: 8000 }));
    });
  }
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new AudioContext();
  return audioCtx.decodeAudioData(arrayBuffer);
}

function computeAudioDuration(audioBuffer) {
  return audioBuffer.length / audioBuffer.sampleRate;
}

function copy3Sec(audioBuffer) {
  const channels = audioBuffer.numberOfChannels;
  const rate = audioBuffer.sampleRate;

  const totFrameCount = rate * 4;
  const copyFrameCount = rate * 3;

  const newAudioBuffer = new AudioContext().createBuffer(channels, totFrameCount, rate);
  const tempArray = new Float32Array(copyFrameCount);

  for (let channel = 0; channel < channels; channel++) {
    audioBuffer.copyFromChannel(tempArray, channel, 0);
    newAudioBuffer.copyToChannel(tempArray, channel, 0);
  }

  return newAudioBuffer;
}

function extend1Sec(audioBuffer) {
  const channels = audioBuffer.numberOfChannels;
  const rate = audioBuffer.sampleRate;

  const totFrameCount = audioBuffer.length + rate;
  const copyFrameCount = audioBuffer.length;

  const newAudioBuffer = new AudioContext().createBuffer(channels, totFrameCount, rate);
  const tempArray = new Float32Array(copyFrameCount);

  for (let channel = 0; channel < channels; channel++) {
    audioBuffer.copyFromChannel(tempArray, channel, 0);
    newAudioBuffer.copyToChannel(tempArray, channel, 0);
  }

  return newAudioBuffer;
}


function concatAudio(audioBuffers, extendTimes) {
  if (audioBuffers.length === 0) {
    return new AudioContext().createBuffer(2, 0, 1);
  }
  const channels = audioBuffers[0].numberOfChannels;
  const rate = audioBuffers[0].sampleRate;

  let totFrameCount = audioBuffers.reduce((sum, ab) => sum + ab.length, 0);
  if (extendTimes) {
    extendTimes.forEach(time => totFrameCount += time * rate);
  }
  const newAudioBuffer = new AudioContext().createBuffer(channels, totFrameCount, rate);

  let bufferOffset = 0;
  for (let i = 0; i < audioBuffers.length; ++i) {
    const buffer = audioBuffers[i];
    const srcFrameCount = buffer.length;
    const tempArray = new Float32Array(srcFrameCount);

    for (let channel = 0; channel < channels; channel++) {
      buffer.copyFromChannel(tempArray, channel, 0);
      newAudioBuffer.copyToChannel(tempArray, channel, bufferOffset);
    }
    bufferOffset += srcFrameCount;
    bufferOffset += extendTimes ? extendTimes[i] : 0;
  }

  return newAudioBuffer;
}

function audioBufferToBlob(abuffer) {
  let numOfChan = abuffer.numberOfChannels,
    length = abuffer.length * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [], i, sample,
    offset = 0,
    pos = 0;

  // write WAVE header
  // "RIFF"
  setUint32(0x46464952);
  // file length - 8
  setUint32(length - 8);
  // "WAVE"
  setUint32(0x45564157);
  // "fmt " chunk
  setUint32(0x20746d66);
  // length = 16
  setUint32(16);
  // PCM (uncompressed)
  setUint16(1);
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  // avg. bytes/sec
  setUint32(abuffer.sampleRate * 2 * numOfChan);
  // block-align
  setUint16(numOfChan * 2);
  // 16-bit (hardcoded in this demo)
  setUint16(16);
  // "data" - chunk
  setUint32(0x61746164);
  // chunk length
  setUint32(length - pos - 4);

  // write interleaved data
  for (i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while (pos < length) {
    // interleave channels
    for (i = 0; i < numOfChan; i++) {
      // clamp
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      // scale to 16-bit signed int
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      // write 16-bit sample
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    // next source sample
    offset++
  }

  // create Blob
  return new Blob([buffer], { type: "audio/wav" });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

export const AudioUtils = {
  dataURItoBlob,
  blobToAudioBuffer,
  audioBufferToBlob,
  concatAudio,
  computeAudioDuration,
  generateTranscript,
  extend1Sec,
  copy3Sec,
  getEndTime
}
