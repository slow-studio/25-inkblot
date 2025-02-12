let size = 6              // Grid size(Adjustable)
let n = 100               // Total sum to distribute
let peakMatrix, fillMatrix, queue = []
let cellSize = 50         // Size of each cell in pixels
let fr = 10

function setup() {
  createCanvas(size * cellSize, size * cellSize)
  // peakMatrix = generateRandomPeakMatrix(size)
  peakMatrix = generateRandomPeakMatrix(size, 3, [0, 100])

  // print the peak matrix
  console.log(peakMatrix.map(row => row.join("\t")).join("\n"))
  fillMatrix = Array.from({ length: size }, () => Array(size).fill(0))

  let center = Math.floor(size / 2)
  // queue.push([center, center])  // Start filling from center
  // queue.push([int(random(size)), int(random(size))])  // Start filling from center
  // frameRate(fr)                 // Controls the animation speed

  background(20)
  // drawMatrix()                  // Render matrix visually
  showMatrix(peakMatrix)
}

/**
 * a function to generate a matrix with random peaks
 * 
 * @param {int} size - the size of an [nxn] matrix
 * @param {int} x - the number of peaks you want in the matrix
 * @param {arr} peakRange - the range of values for the peaks (min, max)
 * @returns - a matrix with random peaks
 */
function generateRandomPeakMatrix(size, x, peakRange) {
  // Initialize the matrix with zeros
  let matrix = Array.from({ length: size }, () => Array(size).fill(0));
  let peaks = []

  let [minPeak, maxPeak] = peakRange // Destructure peak range

  // Generate 'x' random peak positions
  while (peaks.length < x) {
    let px = Math.floor(Math.random() * size);
    let py = Math.floor(Math.random() * size);
    if (!peaks.some(([px2, py2]) => px2 === px && py2 === py)) {
      peaks.push([px, py]);
    }
  }

  // Generate random numbers to fill the matrix
  let numbers = []
  for (let i = 0; i < size * size; i++) {
    numbers.push(Math.floor(Math.random() * (maxPeak - minPeak + 1)) + minPeak)
  }
  numbers.sort(() => Math.random() - 0.5) // Shuffle values

  // Initialize the queue with the peaks
  let queue = [...peaks]
  let index = 0

  // Fill the matrix
  while (queue.length > 0) {
    let [x, y] = queue.shift()
    if (matrix[x][y] === 0) {
      matrix[x][y] = numbers[index++]
    }

    // Get the neighbors of the current cell
    // let neighbors = [
    //   [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
    // ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size && matrix[nx][ny] === 0)
    let neighbors = []
    function isValidNeighbor(nx, ny, size, matrix) {
      return nx >= 0 && ny >= 0 && nx < size && ny < size && matrix[nx][ny] === 0
    }
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx !== 0 || dy !== 0) {
          let nx = x + dx
          let ny = y + dy
          if (isValidNeighbor(nx, ny, size, matrix)) {
            neighbors.push([nx, ny])
          }
        }
      }
    }

    // shuffle the neighbors
    neighbors.sort(() => Math.random() - 0.5)
    queue.push(...neighbors)
  }

  return matrix
}


/**
 * given a matrix, show it on the canvas along with
 * the values and the strength of the value displayed as colour
 * 
 * @param {matrix} matrix - a matrix to be displayed on canvas
 */
function showMatrix(matrix) {
  // assuming this is a
  let size = matrix.length
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      // console.log(matrix[i][j])
      // let filledRatio = fillMatrix[i][j] / peakMatrix[i][j]
      // let colourValue = map(filledRatio, 0, 1, 50, 255)
      // fill(colourValue, 0, colourValue)               // increase/decrease intensity of the colour
      fill(255, 255, 255, 255 / matrix[i][j])
      rect(j * cellSize, i * cellSize, cellSize, cellSize)
      
      // text colour & fill
      fill('#000')
      textAlign(CENTER, CENTER)
      textSize(14)
      text(matrix[i][j], j * cellSize + cellSize / 2, i * cellSize + cellSize / 2)
    }
  }
}