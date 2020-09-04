import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import Draggable from "./dragable";
import ReactBezier from "../../lib";
import "./styles.css";

const cubeSettings = [
  {
    from: "cube-1",
    to: "cube-2",
    positions: {
      start: {
        side: "bottom",
      },
      end: {
        side: "top",
      },
    },
    style: "red-line",
  },
  {
    from: "cube-1",
    to: "cube-2",
    positions: {
      start: {
        side: "top",
      },
      end: {
        side: "bottom",
      },
    },
    style: "red-line dash",
  },
  {
    from: "cube-2",
    to: "cube-1",
    positions: {
      start: {
        side: "left",
      },
      end: {
        side: "right",
      },
    },
    style: "blue-line",
  },
  {
    from: "cube-2",
    to: "cube-1",
    positions: {
      start: {
        side: "right",
      },
      end: {
        side: "left",
      },
    },
    style: "blue-line dash",
  },
];

const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getDots = (count) =>
  Array(+count)
    .fill(0)
    .map((v, i) => ({
      x: 10 + i * 100 + randomInteger(i * 50, i * 50 + 50),
      y: randomInteger(100, 300),
    }));

const generateDotsSettings = (count) => {
  const settings = [];
  Array(+count)
    .fill(0)
    .forEach((_, i) => {
      settings.push({
        from: `dot-${i}`,
        to: `dot-${i + 1}`,
        positions: {
          start: {
            side: "right",
          },
          end: {
            side: "left",
          },
        },
        style: "blue-line",
      });
    });

  return settings;
};

function Demo() {
  const count = useRef();
  const [countDots, setCountDots] = useState(10);
  const [dotsSettings, setDotsSettings] = useState([]);
  const [dots, setDots] = useState([]);

  useEffect(() => {
    setDots(getDots(countDots));
    setDotsSettings(generateDotsSettings(countDots));
  }, [countDots]);

  const generate = (e) => {
    e.preventDefault();
    const val = count.current.value;
    setCountDots(typeof countDots === "string" ? +val : val);
  };

  return (
    <>
      <div style={{ height: "400px" }}>
        <ReactBezier settings={cubeSettings}>
          <>
            <Draggable>
              <div id="cube-1" className={"cube-1"}>
                drag
              </div>
            </Draggable>
            <Draggable>
              <div id="cube-2" className={"cube-2"}>
                drag
              </div>
            </Draggable>
          </>
        </ReactBezier>
      </div>
      <div style={{ height: "300px" }}>
        <ReactBezier settings={dotsSettings} arrow={false}>
          <div>
            Generate random dots
            <form onSubmit={generate}>
              <label>
                Count:
                <input
                  type="number"
                  ref={count}
                  min={2}
                  max={1000}
                  defaultValue={countDots}
                />
              </label>
              <input type="submit" value="Generate" />
            </form>
            {dots.map((v, i) => (
              <div
                key={i}
                className={"dot"}
                id={`dot-${i}`}
                style={{ left: `${v.x}px`, top: `${v.y}px` }}
              />
            ))}
          </div>
        </ReactBezier>
      </div>
    </>
  );
}

render(<Demo />, document.getElementById("app"));
