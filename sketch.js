//ink-blotting, with math; march, 2025.

let seed = 5000000;
let paper = []; // a virtual array where each element corresponds to one-pixel on the screen.

function setup() {
  createCanvas(400, 400);
  pixelDensity(1); //always treat one-pixel as one-pixel in higher density displays.

  background(255);

  //feed an initial value to the virtual array, so that each element corresponds to one-pixel on the screen.
  for (let i = 0; i < width * height; i++) {
    paper.push(0);
  }

  //console.log(`set up ${paper.length} pixels on paper.`); //debug-comment to check how many items get created in paper.

  dropInk(width / 2, height / 2);
  dropInk(width / 1.8, height / 1.8);
  dropInk(width / 3, height / 1.8);
}

//i'm going to drop ink in a circle and see if that meets my need of realism.

function dropInk(x, y) {
  //drops ink on the paper and displays it on the screen.

  //get an index, and also get neighbouring indices.
  let centerIndex = pos(x, y);

  //change value of elements in paper-array.
  paper[centerIndex] = seed/3;

  //update visually:
  loadPixels();
  changeRGBA(centerIndex, paper[centerIndex]);

  updatePixels();
}

function draw() {
  loadPixels();

  for (let i = 0; i < paper.length; ++i) {
    // blot ink from each pixel in paper to its neighbours:
    arjuns_blot(i);
  }
  for (let i = 0; i < paper.length; i++) {
    //display the blot:
    changeRGBA(i, paper[i]);
  }
  updatePixels();
}

//drawing functions:
function arjuns_blot(index) {
  //we check how much ink we have.
  let ink = paper[index];
  const capacity = 255; //fixed capacity of 255 for each cell.

  let offload_desired = ink - capacity;

  //we find all neighbours first.
  let neighbours = getNeighbours(index);

  if (ink > capacity ) {
    //∴ there's a desire to offload, and offload the extra ink.

    //then, we find the difference between what the cell has and its neighbours.
    let raw_differences = [];

    for (let i = 0; i < neighbours.length; i++) {
      if (paper[index] > paper[neighbours[i]]) {
        //it's a positive difference, so store it as is.
        raw_differences.push(paper[index] - paper[neighbours[i]]);
      } else {
        //it's a negative difference, so keep it at zero.
        raw_differences.push(0);
      }
    }

    //now, see how much the demand is.
    let total_demand = 0;

    for (let i = 0; i < raw_differences.length; i++) {
      total_demand += raw_differences[i];
    }

    //however, even if the demand is a lot, the surface can only give so much. so, the amount of ink to go has to be limited.
    const rate = 40000;
    let ink_to_give = Math.min(total_demand, rate, offload_desired); //in one instance, don't give more than 200.

    //now, we go to each neighbour and we give it the relevant ink.

    for (let i = 0; i < neighbours.length; i++) {
      if ([i] == 1 || [i] == 4 || [i] == 6 || [i] == 3) {
        //edge:

        //give it 97% of what it can actually get.
        let to_give = 0;
        to_give = ink_to_give * (raw_differences[i] / total_demand) * 0.97;

        paper[index] -= to_give;
        paper[neighbours[i]] += to_give;
      } else {
        //corner:

        //give it 54% of what it can actually get.
        let to_give = 0;
        to_give = ink_to_give * (raw_differences[i] / total_demand) * 0.54;

        paper[index] -= to_give;
        paper[neighbours[i]] += to_give;
      }
    }
  } 
  
  for (let i = 0; i < neighbours.length; i++) {
    if (paper[index] > paper[neighbours[i]]+paper[index]/16&& paper[index] / paper[neighbours[i]] > 1.1) {
      
      paper[index] -= 1;
      paper[neighbours[i]] += 1;
    }
  }
}

//helper-functions:
function getNeighbours(index) {
  //returns an array of neighbour-indices.
  let neighbours = [];

  //we calculate naighbours based on the x, y position and not the index (because the index is one-dimensional.
  //so, we convert the index to x, y coordinates again:
  let indexCoordinate = inversePos(index);
  let x = indexCoordinate[0];
  let y = indexCoordinate[1];

  //list all 8 neighbour-possibilities for a position:
  let potentialNeighbours = [
    [x - 1, y - 1], // top-left.
    [x, y - 1], // top.
    [x + 1, y - 1], // top-right.
    [x + 1, y], // right.
    [x + 1, y + 1], // bottom-right.
    [x, y + 1], // bottom.
    [x - 1, y + 1], // bottom-left.
    [x - 1, y], // left.
  ];

  //console.log(`neighbour positions of ${index} are ${potentialNeighbours}`); //debug-comment to check potential neighbour output.

  //filter out-of-bounds positions:
  for (let i = 0; i < potentialNeighbours.length; i++) {
    //a neighbour is out-of-bounds if it is beyond the canvas dimensions.

    let nx = potentialNeighbours[i][0];
    let ny = potentialNeighbours[i][1];

    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      neighbours.push(pos(nx, ny));
    }
  }

  //console.log(`neighbours for ${index} are indices: ${neighbours}`); //debug-comment to check neighbours.

  return neighbours;
}

function pos(x, y) {
  //returns a valid index-number for a given position.
  let element = floor(x) + floor(y) * width;
  // console.log(`pos(${x}, ${y}) found element ${element}.`)

  if (element <= paper.length) {
    return element;
  } else {
    return null;
  }
}

function inversePos(index) {
  //returns x & y coordinates for an index-position.
  let x = floor(index % width);
  let y = floor((index - x) / width);

  // console.log(`inverse-pos for index ${index} is ${x}, ${y}.`)

  return [x, y];
}

function changeRGBA(index, a = 255) {
  //changes RGBA values for an index position, using the p5.pixels array.
  a = constrain(a, 0, 255);
  index *= 4;
  pixels[index + 0] = pixels[index + 1] = pixels[index + 2] = 255 - a;
  pixels[index + 3] = 255;
}
