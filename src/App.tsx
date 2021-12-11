import { range } from 'lodash';
import { useState, CSSProperties } from 'react';
import Maze from './Maze';

type CSSPropertiesWithVars = CSSProperties & { '--maze-columns': number };

export function App() {
  const [maze, setMaze] = useState(new Maze({ width: 10, height: 10 }));

  const dimensions = maze.getDimensions();
  return (
    <div
      className="maze"
      style={{ '--maze-columns': dimensions.width } as CSSPropertiesWithVars}
    >
      {range(dimensions.height).map((y) =>
        range(dimensions.width).map((x) => (
          <div key={`${x},${y}`} className="cell top-wall" />
        )),
      )}
    </div>
  );
}
