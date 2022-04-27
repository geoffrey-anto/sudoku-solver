class findLargesConnectedComponent {
  public n: number
  public m: number
  private visited: number[][]
  public result: number[][]
  public count: number

  constructor(n: number, m: number) {
    this.n = n
    this.m = m
    this.visited = new Array(n)
    this.result = new Array(n)
    this.count = 0
    for (let i = 0; i < n; i++) {
      this.visited[i] = new Array(m)
      this.result[i] = new Array(m)
    }
  }
  private is_valid(
    x: number,
    y: number,
    key: number,
    input: number[][]
  ): boolean {
    if (x < this.n && y < this.m && x >= 0 && y >= 0) {
      if (this.visited[x][y] == 0 && input[x][y] == key) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  private BFS(x: number, y: number, i: number, j: number, input: number[][]) {
    if (x != y) {
      return
    }
    this.visited[i][j] = 1
    this.count++

    const x_move: number[] = [0, 0, 1, -1]
    const y_move: number[] = [1, -1, 0, 0]

    for (let k = 0; k < 4; k++) {
      if (this.is_valid(i + y_move[k], j + x_move[k], x, input)) {
        this.BFS(x, y, i + y_move[k], j + x_move[k], input)
      }
    }
  }
  private reset_visited() {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.m; j++) {
        this.visited[i][j] = 0
      }
    }
  }
  private reset_result(key: number, input: number[][]) {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.m; j++) {
        if (this.visited[i][j] == 1 && input[i][j] == key) {
          this.result[i][j] = this.visited[i][j]
        } else {
          this.result[i][j] = 0
        }
      }
    }
  }
  private print_result(res: number) {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.m; j++) {
        if (this.result[i][j] != 0) {
          this.result[i][j] = 255;
        } else {
          this.result[i][j] = 0;
        }
      }
    }
  }
  public computeLargestConnectedGrid(input: number[][]) {
    let curr_max = Number.MIN_VALUE
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.m; j++) {
        this.reset_visited()
        this.count = 0

        if (j + 1 < this.m) {
          this.BFS(input[i][j], input[i][j + 1], i, j, input)
        }
        if (this.count >= curr_max) {
          curr_max = this.count
          this.reset_result(input[i][j], input)
        }
        this.reset_visited()
        this.count = 0

        if (i + 1 < this.n) {
          this.BFS(input[i][j], input[i + 1][j], i, j, input)
        }
        if (this.count >= curr_max) {
          curr_max = this.count
          this.reset_result(input[i][j], input)
        }
      }
    }
    this.print_result(curr_max)
    return this.result;
  }
}

// function main() {
//   const input: number[][] = [
//     [1, 4, 4, 4, 4, 3, 3, 1],
//     [2, 1, 1, 4, 3, 3, 1, 1],
//     [3, 2, 1, 1, 2, 3, 2, 1],
//     [3, 3, 2, 1, 2, 2, 2, 2],
//     [3, 1, 3, 1, 1, 4, 4, 4],
//     [1, 1, 3, 1, 1, 4, 4, 4],
//   ]
//   console.log('Done')
//   const obj = new findLargesConnectedComponent(6, 8)
//   obj.computeLargestConnectedGrid(input)
// }
// main()

export default findLargesConnectedComponent
