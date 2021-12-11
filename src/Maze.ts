import { range } from 'lodash';

export enum Side {
  Top,
  Left,
  Bottom,
  Right,
}

export type Dimensions = {
  width: number;
  height: number;
};

type WallCoordinate = {
  x: number;
  y: number;
  side: Side;
};

export default class Maze {
  // Walls are stored in a boolean array where true represents a wall, false represents the absence of a wall. All
  // vertical walls (that run up along the y axis) are stored first, followed by all horizontal walls (that run side to
  // side along the x axis. Walls are stored in order going in the increasing x-axis direction, followed by going in the
  // increasing y-axis direction. In a 10x10 maze, there is an 11x10 grid of vertical walls and a 10x11 grid of
  // horizontal walls.
  //   Index 1 stores the (1, 0) vertical wall
  //   Index 0 stores the (0, 0) vertical wall
  //   Index 10 stores the (10, 0) vertical wall
  //   Index 11 stores the (0, 1) vertical wall
  //   Index 110 stores the (0, 0) horizontal wall
  //   Index 111 stores the (1, 0) horizontal wall
  //   Index 120 stores the (0, 1) horizontal wall
  #walls: boolean[];
  #dimensions: Dimensions;

  constructor(dimensions: Dimensions) {
    this.#dimensions = { ...dimensions };

    const verticalDimensions = this.getVerticalDimensions();
    const horizontalDimensions = this.getHorizontalDimensions();
    this.#walls = range(
      0,
      verticalDimensions.width * verticalDimensions.height +
        horizontalDimensions.width * horizontalDimensions.height,
    ).map(() => false);
  }

  // Return the dimensions of the maze
  getDimensions(): Dimensions {
    // Clone the dimensions so they can't be mutated
    return { ...this.#dimensions };
  }

  // Return the dimensions of the grid of vertical walls
  getVerticalDimensions(): Dimensions {
    return {
      width: this.#dimensions.width + 1,
      height: this.#dimensions.height,
    };
  }

  // Return the dimensions of the grid of horizontal walls
  getHorizontalDimensions(): Dimensions {
    return {
      width: this.#dimensions.width,
      height: this.#dimensions.height + 1,
    };
  }

  // Convert a wall coordinate to its index in the walls array
  #coordinateToIndex({ x, y, side }: WallCoordinate): number {
    if (side === Side.Bottom) {
      // Normalize bottom walls to the corresponding top wall
      return this.#coordinateToIndex({ x, y: y + 1, side: Side.Top });
    } else if (side === Side.Right) {
      // Normalize right walls to the corresponding top left wall
      return this.#coordinateToIndex({ x: x + 1, y, side: Side.Left });
    } else if (side === Side.Top) {
      const dimensions = this.getHorizontalDimensions();
      if (x >= dimensions.width || y >= dimensions.height) {
        throw new Error('Coordinate out of bounds');
      }

      return x + y * dimensions.width;
    } else if (side === Side.Left) {
      const dimensions = this.getHorizontalDimensions();
      if (x >= dimensions.width || y >= dimensions.height) {
        throw new Error('Coordinate out of bounds');
      }

      const verticalDimensions = this.getVerticalDimensions();
      return (
        // All vertical walls are stored before the horizontal walls
        verticalDimensions.width * verticalDimensions.height +
        x +
        y * dimensions.width
      );
    }
  }

  // Return a boolean representing the presence of a wall at the specified coordinates
  get(x: number, y: number, side: Side): boolean {
    return this.#walls[this.#coordinateToIndex({ x, y, side })];
  }

  // Return a new maze that clones the existing maze but with the presence of a wall set at the specified coordinates
  set(x: number, y: number, side: Side, value: boolean): Maze {
    const maze = new Maze(this.#dimensions);
    maze.#walls = this.#walls.slice(0);
    maze.#walls[this.#coordinateToIndex({ x, y, side })] = value;
    return maze;
  }
}
