let size = 7              // Grid size(Adjustable)
let n = 200               // Total sum to distribute
let peakMatrix, fillMatrix, queue = []
let cellSize = 50         // Size of each cell in pixels
let fr = 10

function setup() {
  createCanvas(size * cellSize, size * cellSize)
  peakMatrix = generateRandomPeakMatrix(size)
  // print the peak matrix
  console.log(peakMatrix.map(row => row.join("\t")).join("\n"))
  fillMatrix = Array.from({ length: size }, () => Array(size).fill(0))

  let center = Math.floor(size / 2)
  // queue.push([center, center])  // Start filling from center
  queue.push([int(random(size)), int(random(size))])  // Start filling from center
  frameRate(fr)                 // Controls the animation speed

  background(255)
  drawMatrix()                  // Render matrix visually
}

function draw() {
  background(20)
  drawMatrix()                  // Render matrix visually

  if(n > 0) {
    distributeFlow(fillMatrix, peakMatrix)
  }
}

function generateRandomPeakMatrix(size) {
  let matrix = Array.from({ length: size }, () => Array(size).fill(0))
  let center = Math.floor(size / 2)
  let numbers = []

  for(let i = 0; i < size * size; i++) {
    numbers.push(i + 1)
  }
  numbers.sort(() => Math.random() - 0.5)  // Shuffle values

  let queue = [[center, center]]
  let index = 0

  while(queue.length > 0) {
    let [x, y] = queue.shift()
    if(matrix[x][y] === 0) {
      matrix[x][y] = numbers[index++]
    }
    let neighbors = [
      [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
    ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size && matrix[nx][ny] === 0)
    neighbors.sort(() => Math.random() - 0.5)
    queue.push(...neighbors)
  }

  return matrix
}

/**
 * given a fillMatrix and peakMatrix, distribute the flow of water/ink
 * across neighbouring cells
 * 
 * @returns 
 */
function distributeFlow() {
  if(queue.length === 0) return
  let [x, y] = queue.shift()
  if(fillMatrix[x][y] < peakMatrix[x][y]) {
    fillMatrix[x][y]++
    n--
  }

  // TODO: control the degree of neighbour finding, can be +/-2 or +/-n(to simulate faster flow)
  let neighbors = [
    [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
  ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size);

  queue.push(...neighbors.sort(() => Math.random() - 0.5));  // Spread randomly
}


/**
 * draws the matrix on the canvas
 */ 
function drawMatrix() {
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      let filledRatio = fillMatrix[i][j] / peakMatrix[i][j]
      let colourValue = map(filledRatio, 0, 1, 50, 255)
      fill(colourValue, 0, 255/colourValue)               // increase/decrease intensity of the colour
      // fill('#f1f1f1')
      rect(j * cellSize, i * cellSize, cellSize, cellSize)
      
      // text colour & fill
      fill('#000')
      textAlign(CENTER, CENTER)
      textSize(14)
      text(fillMatrix[i][j], j * cellSize + cellSize / 2, i * cellSize + cellSize / 2)
    }
  }
}