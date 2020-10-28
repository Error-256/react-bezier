import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useContext,
} from "react";
import PropTypes from "prop-types";

import "./style.css";

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export const makeHash = () =>
  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

const endXY = (el, container, direction, indent) => {
  const rect = el.getBoundingClientRect();
  const containerRect = container.current.getBoundingClientRect();

  const offsetX = +indent >= 0 ? +indent : rect.width / 2;
  const offsetY = +indent >= 0 ? +indent : rect.height / 2;

  const xy = {
    x: rect.x - containerRect.x,
    y: rect.y - containerRect.y,
  };

  switch (direction) {
    case "top":
      return {
        x: xy.x + offsetX,
        y: xy.y,
      };
    case "bottom":
      return {
        x: xy.x + offsetX,
        y: xy.y + rect.height,
      };
    case "left":
      return {
        x: xy.x,
        y: xy.y + offsetY,
      };
    case "right":
      return {
        x: xy.x + rect.width,
        y: xy.y + offsetY,
      };

    default:
      throw new Error("unexpected type");
  }
};

const arrowsCords = (lines, hash) => {
  const result = [];
  for (const [i] of lines.entries()) {
    const path = document.getElementById(`path-${hash}-${i}`);
    const pathLength = Math.floor(path.getTotalLength());
    const pt0 = path.getPointAtLength((70 * pathLength) / 100);
    const pt1 = path.getPointAtLength((80 * pathLength) / 100);
    result.push({
      x: pt1.x,
      y: pt1.y,
      orient: (Math.atan2(pt1.y - pt0.y, pt1.x - pt0.x) * 180) / Math.PI,
    });
  }
  return result;
};

const getLine = (setting, container, hash) => {
  const a = document.querySelector(
    `.react-bezier-lines-${hash} [id='${setting.from}']`
  );
  const b = document.querySelector(
    `.react-bezier-lines-${hash} [id='${setting.to}']`
  );

  const result = {
    cord0: { x: 0, y: 0 },
    cord1: { x: 0, y: 0 },
    cord2: { x: 0, y: 0 },
    cord3: { x: 0, y: 0 },
    style: setting.style,
  };

  if (!a || !b) {
    return result;
    // throw new Error(`items not found: ${JSON.stringify(setting)}`);
  }

  result.cord0 = endXY(
    a,
    container,
    setting.positions.start.side,
    setting.positions.start.indent
  );
  result.cord3 = endXY(
    b,
    container,
    setting.positions.end.side,
    setting.positions.end.indent
  );

  switch (setting.positions.start.side) {
    case "top":
    case "bottom": {
      result.cord1.x = result.cord0.x;
      result.cord2.x = result.cord3.x;
      break;
    }
    case "left":
    case "right": {
      result.cord1.y = result.cord0.y;
      result.cord2.y = result.cord3.y;
      break;
    }

    default:
      break;
  }
  const halfX = Math.abs(result.cord3.x - result.cord0.x) / 2;
  const halfY = Math.abs(result.cord3.y - result.cord0.y) / 2;
  const clampX = clamp(halfX, 30, 100);
  const clampY = clamp(halfY, 30, 100);

  switch (setting.positions.end.side) {
    case "top": {
      switch (setting.positions.start.side) {
        case "top":
          result.cord1.y = result.cord0.y - clampY;
          result.cord2.y = result.cord3.y - clampY;
          break;
        case "bottom":
          result.cord1.y = result.cord0.y + clampY;
          result.cord2.y = result.cord3.y - clampY;
          break;
        case "left":
          result.cord1.x = result.cord0.x - clampY;
          result.cord2.x = result.cord3.x;
          result.cord2.y = result.cord3.y - clampY;
          break;
        case "right":
          result.cord1.x = result.cord0.x + clampX;
          result.cord2.x = result.cord3.x;
          result.cord2.y = result.cord3.y - clampY;
          break;
        default:
          break;
      }
      break;
    }

    case "bottom": {
      switch (setting.positions.start.side) {
        case "bottom":
          result.cord1.y = result.cord0.y + clampY;
          result.cord2.y = result.cord3.y + clampY;
          break;
        case "top":
          result.cord1.y = result.cord0.y - clampY;
          result.cord2.y = result.cord3.y + clampY;
          break;
        case "left":
          result.cord1.x = result.cord0.x - clampX;
          result.cord2.x = result.cord3.x;
          result.cord2.y = result.cord3.y + clampY;
          break;
        case "right":
          result.cord1.x = result.cord0.x + clampX;
          result.cord2.x = result.cord3.x;
          result.cord2.y = result.cord3.y + clampY;
          break;
        default:
          break;
      }
      break;
    }

    case "left": {
      switch (setting.positions.start.side) {
        case "left":
          result.cord1.x = result.cord0.x - clampX;
          result.cord2.x = result.cord3.x - clampX;
          break;
        case "right":
          result.cord1.x = result.cord0.x + clampX;
          result.cord2.x = result.cord3.x - clampX;
          break;
        case "top":
          result.cord1.y = result.cord0.y - clampY;
          result.cord2.x = result.cord3.x - clampX;
          result.cord2.y = result.cord3.y;
          break;
        case "bottom":
          result.cord1.y = result.cord0.y + clampY;
          result.cord2.y = result.cord3.y;
          result.cord2.x = result.cord3.x - clampX;
          break;
        default:
          break;
      }
      break;
    }

    case "right": {
      switch (setting.positions.start.side) {
        case "right":
          result.cord2.x = result.cord3.x + clampX;
          result.cord1.x = result.cord0.x + clampX;
          break;
        case "left":
          result.cord2.x = result.cord3.x + clampX;
          result.cord1.x = result.cord0.x - clampX;
          break;
        case "top":
          result.cord1.y = result.cord0.y - clampY;
          result.cord2.x = result.cord3.x + clampX;
          result.cord2.y = result.cord3.y;
          break;
        case "bottom":
          result.cord1.y = result.cord0.y + clampY;
          result.cord2.y = result.cord3.y;
          result.cord2.x = result.cord3.x + clampX;
          break;
        default:
          break;
      }
      break;
    }
    default:
      break;
  }

  return result;
};

const ReactBezierContext = React.createContext(null);
export const ReactBezier = ({ settings, children, arrow = true }) => {
  if (!settings) {
    throw new Error("ReactBezier - settings required");
  }
  const context = useContext(ReactBezierContext);
  const container = useRef();
  const [linesObj, setLinesObj] = useState({});
  const [arrows, setArrows] = useState([]);
  const [settingsGroup, setSettingsGroup] = useState({});
  const [hash] = useState(makeHash());

  const parentContainer = context?.parentContainer;
  const useContainer = parentContainer || container;

  const update = useCallback(
    (settings, oldLinesObj = {}) => {
      const lines = settings.map((v) => ({
        ...getLine(v, useContainer, hash),
        id: `${v.from};${v.to}`,
      }));

      const updateLinesObj = lines.reduce((results, v) => {
        (results[v.id] = results[v.id] || []).push(v);
        return results;
      }, {});

      setLinesObj({
        ...oldLinesObj,
        ...updateLinesObj,
      });
    },
    [useContainer, hash]
  );

  useEffect(() => {
    update(settings);
    const group = settings.reduce((results, v) => {
      (results[v.from] = results[v.from] || []).push(v);
      (results[v.to] = results[v.to] || []).push(v);
      return results;
    }, {});

    setSettingsGroup(group);
  }, [update, settings]);

  useLayoutEffect(() => {
    if (arrow) {
      setArrows(arrowsCords(Object.values(linesObj).flat(), hash));
    }
  }, [linesObj, hash]);

  useEffect(() => {
    if (container.current) {
      const observer = new MutationObserver((data) => {
        let setList = new Set();

        for (const v of data) {
          if (settingsGroup[v.target.id]) {
            settingsGroup[v.target.id].forEach(setList.add, setList);
          } else {
            const matchAll = v.target.innerHTML.matchAll(/id=['"`]{1}(.+?)['"`]{1}/g);
            const ids = Array.from(matchAll).map(val => val[1])
            for (const id of ids) {
              if (settingsGroup[id]) {
                settingsGroup[id].forEach(setList.add, setList);
              }
            }
          }
        }
        const settings = Array.from(setList);
        if (settings.length) {
          window.requestAnimationFrame(() => update(settings, linesObj));
        }
      });

      observer.observe(container.current, {
        attributes: true,
        characterData: true,
        subtree: true,
        childList: true,
      });
      return () => {
        observer.disconnect();
      };
    }
  });

  return (
    <ReactBezierContext.Provider
      value={{
        parentContainer: useContainer,
      }}
    >
      <div
        ref={container}
        style={
          !parentContainer ? { position: "relative", height: "inherit" } : {}
        }
        className={`react-bezier-lines-${hash}`}
      >
        {children}

        {Object.values(linesObj)
          .flat()
          .map((v, i) => (
            <React.Fragment key={i}>
              <svg className={"bezier-line"}>
                <path
                  id={`path-${hash}-${i}`}
                  d={`M${v.cord0.x} ${v.cord0.y} C ${v.cord1.x} ${v.cord1.y}, ${v.cord2.x} ${v.cord2.y}, ${v.cord3.x} ${v.cord3.y}`}
                  className={v.style}
                />
                {arrows && arrows[i] && (
                  <>
                    <defs>
                      <marker
                        id={`arrow-${hash}-${i}`}
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="5"
                        orient={arrows[i].orient}
                        markerUnits="userSpaceOnUse"
                      >
                        <polyline
                          points="1 1, 9 5, 1 9"
                          fill="none"
                          className={v.style}
                          style={{ strokeDasharray: "none" }}
                        />
                      </marker>
                    </defs>
                    <g className="arrow">
                      <path
                        markerEnd={`url(#arrow-${hash}-${i})`}
                        d={`M${arrows[i].x} ${arrows[i].y}`}
                        stroke="none"
                      />
                    </g>
                  </>
                )}
              </svg>
            </React.Fragment>
          ))}
      </div>
    </ReactBezierContext.Provider>
  );
};

export default ReactBezier;

ReactBezier.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  settings: PropTypes.array,
};
