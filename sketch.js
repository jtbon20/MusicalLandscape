/* eslint no-unused-vars: 0 no-undef:0 */
/* eslint consistent-return:0 no-mixed-operators:0 */
/* eslint max-len:0 */

let source, fft, cnv, mySound;

const divisions = 1.5;
const speed = 1;

const waterThreshold = 0.5;
const widthCenter = 3;

function preload() {
  soundFormats('mp3', 'ogg');
  source = loadSound('assets/song.mp3');
}

function setup() {
  background(255);

  cnv = createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(0.2);

  source.setVolume(0.85);
  source.play();

  // source = new p5.AudioIn();
  // source.start();

  fft = new p5.FFT(0.95, 256);
  fft.setInput(source);
}

// average a point in an array with its neighbors
function smoothPoint(spectrum, index, numberOfNeighbors) {
  // default to 2 neighbors on either side
  const neighbors = numberOfNeighbors || 2;
  const len = spectrum.length;

  let val = 0;

  // start below the index
  const indexMinusNeighbors = index - neighbors;
  let smoothedPoints = 0;

  for (let i = indexMinusNeighbors; i < (index + neighbors) && i < len; i += 1) {
    // if there is a point at spectrum[i], tally it
    if (typeof (spectrum[i]) !== 'undefined') {
      val += spectrum[i];
      smoothedPoints += 1;
    }
  }

  val /= smoothedPoints;

  return val;
}


// Color palettes from:
// https://gka.github.io/palettes
function getMountain(min, max) {
  const d = (max - min) / 200;
  return d3.scale.threshold()
    .range(['#ffebcd', '#feeacc', '#fce9cb', '#fbe9ca', '#fbe8c9', '#f9e8c8', '#f8e7c6', '#f7e6c6', '#f6e5c5', '#f4e5c3', '#f4e4c3', '#f2e3c2', '#f0e3c0', '#efe2bf', '#efe1bf', '#ede0bd', '#ece0bc', '#ebdfbc', '#eadeba', '#e8deb9', '#e8ddb8', '#e6ddb7', '#e5dcb6', '#e4dcb5', '#e3dab4', '#e1d9b2', '#e1d9b2', '#dfd8b1', '#ded7af', '#ddd7ae', '#dcd6ae', '#dad6ac', '#d9d5ac', '#d9d4ab', '#d7d4a9', '#d6d3a8', '#d5d2a8', '#d3d1a6', '#d2d1a5', '#d2d0a5', '#d0d0a3', '#cecfa2', '#cdcea1', '#cdcea1', '#cbcd9f', '#cacc9f', '#c9cc9e', '#c8cb9c', '#c6ca9b', '#c6ca9b', '#c4c999', '#c2c898', '#c2c898', '#c1c796', '#bfc695', '#bfc594', '#bdc493', '#bcc492', '#bbc392', '#bac390', '#b8c18f', '#b7c18e', '#b7c18d', '#b5bf8c', '#b5bf8b', '#b3bf8a', '#b2be89', '#b0bd88', '#b0bd87', '#aebb86', '#adbb85', '#acbb84', '#abb983', '#a9b982', '#a9b982', '#a7b780', '#a6b67f', '#a5b67e', '#a4b57d', '#a2b57c', '#a2b47c', '#a1b37a', '#9fb379', '#9fb278', '#9db177', '#9cb076', '#9bb075', '#9ab074', '#98af73', '#97ae72', '#97ae72', '#95ad70', '#94ac6f', '#93ab6f', '#92ab6d', '#90aa6c', '#90aa6c', '#8ea96a', '#8da869', '#8ca769', '#8ba768', '#89a666', '#89a566', '#87a565', '#86a363', '#85a363', '#84a362', '#82a260', '#82a260', '#81a15f', '#7f9f5d', '#7e9f5d', '#7d9e5c', '#7c9d5b', '#7b9d5b', '#7a9d59', '#789c58', '#789b57', '#779b56', '#759955', '#749955', '#739854', '#719752', '#719751', '#709651', '#6e964f', '#6d954f', '#6c944e', '#6b944c', '#69934b', '#69934b', '#67924a', '#669149', '#669148', '#649047', '#628f46', '#628e45', '#608e44', '#5f8d42', '#5f8c42', '#5d8b41', '#5c8b40', '#5b8a40', '#59893e', '#58883d', '#58883d', '#56873b', '#54873a', '#54863a', '#528539', '#518537', '#518437', '#4f8436', '#4d8334', '#4d8234', '#4b8133', '#498131', '#498031', '#488030', '#467e2e', '#467e2e', '#447d2d', '#427c2b', '#427c2b', '#407b2a', '#3e7b29', '#3e7a28', '#3c7a27', '#3a7926', '#3a7826', '#387724', '#367722', '#367622', '#347621', '#32741f', '#32741f', '#30741e', '#2e721c', '#2e721c', '#2c711b', '#2a7119', '#297018', '#277017', '#256e15', '#256e15', '#236d14', '#206c12', '#1f6c11', '#1d6c10', '#1b6a0e', '#1a6a0d', '#186a0c', '#146809', '#136808', '#116707', '#0c6605', '#0a6604', '#076503', '#026501', '#006400'])
    .domain([min + 1 * d, min + 2 * d, min + 3 * d, min + 4 * d, min + 5 * d, min + 6 * d, min + 7 * d, min + 8 * d, min + 9 * d, min + 10 * d, min + 11 * d, min + 12 * d, min + 13 * d, min + 14 * d, min + 15 * d, min + 16 * d, min + 17 * d, min + 18 * d, min + 19 * d, min + 20 * d, min + 21 * d, min + 22 * d, min + 23 * d, min + 24 * d, min + 25 * d, min + 26 * d, min + 27 * d, min + 28 * d, min + 29 * d, min + 30 * d, min + 31 * d, min + 32 * d, min + 33 * d, min + 34 * d, min + 35 * d, min + 36 * d, min + 37 * d, min + 38 * d, min + 39 * d, min + 40 * d, min + 41 * d, min + 42 * d, min + 43 * d, min + 44 * d, min + 45 * d, min + 46 * d, min + 47 * d, min + 48 * d, min + 49 * d, min + 50 * d, min + 51 * d, min + 52 * d, min + 53 * d, min + 54 * d, min + 55 * d, min + 56 * d, min + 57 * d, min + 58 * d, min + 59 * d, min + 60 * d, min + 61 * d, min + 62 * d, min + 63 * d, min + 64 * d, min + 65 * d, min + 66 * d, min + 67 * d, min + 68 * d, min + 69 * d, min + 70 * d, min + 71 * d, min + 72 * d, min + 73 * d, min + 74 * d, min + 75 * d, min + 76 * d, min + 77 * d, min + 78 * d, min + 79 * d, min + 80 * d, min + 81 * d, min + 82 * d, min + 83 * d, min + 84 * d, min + 85 * d, min + 86 * d, min + 87 * d, min + 88 * d, min + 89 * d, min + 90 * d, min + 91 * d, min + 92 * d, min + 93 * d, min + 94 * d, min + 95 * d, min + 96 * d, min + 97 * d, min + 98 * d, min + 99 * d, min + 100 * d, min + 101 * d, min + 102 * d, min + 103 * d, min + 104 * d, min + 105 * d, min + 106 * d, min + 107 * d, min + 108 * d, min + 109 * d, min + 110 * d, min + 111 * d, min + 112 * d, min + 113 * d, min + 114 * d, min + 115 * d, min + 116 * d, min + 117 * d, min + 118 * d, min + 119 * d, min + 120 * d, min + 121 * d, min + 122 * d, min + 123 * d, min + 124 * d, min + 125 * d, min + 126 * d, min + 127 * d, min + 128 * d, min + 129 * d, min + 130 * d, min + 131 * d, min + 132 * d, min + 133 * d, min + 134 * d, min + 135 * d, min + 136 * d, min + 137 * d, min + 138 * d, min + 139 * d, min + 140 * d, min + 141 * d, min + 142 * d, min + 143 * d, min + 144 * d, min + 145 * d, min + 146 * d, min + 147 * d, min + 148 * d, min + 149 * d, min + 150 * d, min + 151 * d, min + 152 * d, min + 153 * d, min + 154 * d, min + 155 * d, min + 156 * d, min + 157 * d, min + 158 * d, min + 159 * d, min + 160 * d, min + 161 * d, min + 162 * d, min + 163 * d, min + 164 * d, min + 165 * d, min + 166 * d, min + 167 * d, min + 168 * d, min + 169 * d, min + 170 * d, min + 171 * d, min + 172 * d, min + 173 * d, min + 174 * d, min + 175 * d, min + 176 * d, min + 177 * d, min + 178 * d, min + 179 * d, min + 180 * d, min + 181 * d, min + 182 * d, min + 183 * d, min + 184 * d, min + 185 * d, min + 186 * d, min + 187 * d, min + 188 * d, min + 189 * d, min + 190 * d, min + 191 * d, min + 192 * d, min + 193 * d, min + 194 * d, min + 195 * d, min + 196 * d, min + 197 * d, min + 198 * d, min + 199 * d, min + 200 * d]);
}

function getWater(min, max) {
  const d = (max - min) / 10;
  return d3.scale.threshold()
    .range(['#1e90ff', '#5694f3', '#7598e6', '#8c9cd8', '#a0a0ca', '#aea4be', '#bda9b0', '#c9aea2', '#d3b395', '#deb887'])
    .domain([min + 1 * d, min + 2 * d, min + 3 * d, min + 4 * d, min + 5 * d, min + 6 * d, min + 7 * d, min + 8 * d, min + 9 * d, min + 10 * d]);
}

const waterColor = getWater(0, waterThreshold);

function checkWater(spectrum, index) {
  const startHeight = spectrum[index];
  for (let i = 0; i < 4; i += 1) {
    if (Math.abs(spectrum[index + i] - startHeight) > waterThreshold) return false;
  }

  return true;
}

function draw() {
  const h = height / divisions;
  const mountainColor = getMountain(1, height);
  const spectrum = fft.analyze();
  const newBuffer = [];
  const len = spectrum.length;

  background(255, 255, 255, 1);
  copy(cnv, 0, 0, width, height, 0, speed, width, height);

  for (let i = 0; i < len; i += 1) {
    // color the object
    const z = spectrum[len - i];
    if (checkWater(spectrum, len - i)) stroke(`${waterColor(z)}`);
    else stroke(`${mountainColor(z)}`);

    // draw the outline
    beginShape();
    for (let j = 0; j < 4; j += 1) {
      const pointLoc = i + j;
      if (pointLoc < len) {
        const point = smoothPoint(spectrum, len - pointLoc, 4);
        const x = map(pointLoc, 0, len - 1, 0, width / widthCenter);
        const y = map(point, 0, 255, h, 0);
        curveVertex(x, y);
      }
    }
    endShape();
  }

  for (let i = 0; i < len; i += 1) {
    // color the object
    const z = spectrum[i];
    if (checkWater(spectrum, i)) stroke(`${waterColor(z)}`);
    else stroke(`${mountainColor(z)}`);

    // draw the outline
    beginShape();
    for (let j = 0; j < 4; j += 1) {
      const pointLoc = i + j;
      if (pointLoc < len) {
        const point = smoothPoint(spectrum, pointLoc, 4);
        const x = map(pointLoc, 0, len - 1, width / widthCenter, width);
        const y = map(point, 0, 255, h, 0);
        curveVertex(x, y);
      }
    }
    endShape();
  }
}
