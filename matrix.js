class Matrix {

  constructor(size = 3) {
    this.size = size
    this.matrix = Array.from({ length: this.size }, () => Array(this.size).fill(0))
    return this
  }

  print() {
    console.log(this.matrix.map(row => row.join("\t")).join("\n"))
  }

  generatePeak(size = this.size) {
    // let matrix = Array.from({ length: size }, () => Array(size).fill(0))
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
      if(this.matrix[x][y] === 0) {
        this.matrix[x][y] = numbers[index++]
      }
      let neighbors = [
        [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
      ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size && this.matrix[nx][ny] === 0)
      neighbors.sort(() => Math.random() - 0.5)
      queue.push(...neighbors)
    }

    this.matrix = matrix
    return this
  }

}