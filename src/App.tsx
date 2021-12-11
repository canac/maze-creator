import { minBy, range } from 'lodash';
import { useState, CSSProperties, MouseEvent } from 'react';
import { Maze, Side, Wall } from './Maze';

type CSSPropertiesWithVars = CSSProperties & { '--maze-columns': number };

export function App() {
  const [maze, setMaze] = useState(new Maze({ width: 10, height: 10 }));
  const [hover, setHover] = useState<Wall | null>(null);

  // Return the side closest to mouse
  function getClosestSide(event: MouseEvent): Side {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const sideDistances: Array<{ side: Side; distance: number }> = [
      { side: Side.Left, distance: event.clientX - boundingRect.left },
      { side: Side.Top, distance: event.clientY - boundingRect.top },
      { side: Side.Right, distance: boundingRect.right - event.clientX },
      { side: Side.Bottom, distance: boundingRect.bottom - event.clientY },
    ];
    return minBy(sideDistances, 'distance').side;
  }

  function toggleWall(x: number, y: number, event: MouseEvent) {
    const closestSide = getClosestSide(event);
    setMaze(maze.set(x, y, closestSide, !maze.get(x, y, closestSide)));
  }

  const dimensions = maze.getDimensions();
  return (
    <div
      className="maze"
      style={{ '--maze-columns': dimensions.width } as CSSPropertiesWithVars}
      onMouseLeave={() => setHover(null)}
    >
      {range(dimensions.height).map((y) =>
        range(dimensions.width).map((x) => (
          <div
            key={`${x},${y}`}
            className={[
              'cell',
              maze.get(x, y, Side.Left) ? 'wall-left' : null,
              maze.get(x, y, Side.Top) ? 'wall-top' : null,
              maze.get(x, y, Side.Right) ? 'wall-right' : null,
              maze.get(x, y, Side.Bottom) ? 'wall-bottom' : null,
              hover && hover.equals(new Wall(x, y, Side.Left))
                ? 'hover-wall-left'
                : null,
              hover && hover.equals(new Wall(x, y, Side.Top))
                ? 'hover-wall-top'
                : null,
              hover && hover.equals(new Wall(x, y, Side.Right))
                ? 'hover-wall-right'
                : null,
              hover && hover.equals(new Wall(x, y, Side.Bottom))
                ? 'hover-wall-bottom'
                : null,
            ].join(' ')}
            onClick={(event) => toggleWall(x, y, event)}
            onMouseMove={(event) =>
              setHover(new Wall(x, y, getClosestSide(event)))
            }
          />
        )),
      )}
    </div>
  );
}
