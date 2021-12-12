import { minBy, range } from 'lodash';
import { useState, CSSProperties, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Maze, Side, Wall } from './Maze';

type CSSPropertiesWithVars = CSSProperties & {
  '--maze-columns': number;
  '--maze-rows': number;
};

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
      style={
        {
          '--maze-columns': dimensions.width,
          '--maze-rows': dimensions.height,
        } as CSSPropertiesWithVars
      }
      onMouseLeave={() => setHover(null)}
    >
      <button
        className="add prepend-row"
        onClick={() => setMaze(maze.prependRows(1))}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>
      <button
        className="add prepend-column"
        onClick={() => setMaze(maze.prependColumns(1))}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>
      <button
        className="add append-row"
        onClick={() => setMaze(maze.appendRows(1))}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>
      <button
        className="add append-column"
        onClick={() => setMaze(maze.appendColumns(1))}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>
      <button className="remove remove-first-row head">
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button className="remove remove-first-row tail">
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button className="remove remove-first-column head">
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button className="remove remove-first-column tail">
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button className="remove remove-last-row head">
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button className="remove remove-last-row tail">
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button className="remove remove-last-column head">
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button className="remove remove-last-column tail">
        <FontAwesomeIcon icon={faTrash} />
      </button>
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
