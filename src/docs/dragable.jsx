// component for demo
import React, { useState } from "react";
import PropTypes from "prop-types";

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function getClientCoords(el) {
  const top =
    (document.documentElement && document.documentElement.scrollTop) ||
    document.body.scrollTop;
  const left =
    (document.documentElement && document.documentElement.scrollLeft) ||
    document.body.scrollLeft;
  return {
    x: el.offsetLeft + left,
    y: el.offsetTop + top,
    h: el.offsetHeight,
    w: el.offsetWidth,
  };
}

const Draggable = ({ children }) => {
  const [styles, setStyles] = useState({});

  const onMouseDown = (e) => {
    const posS = getClientCoords(e.target);
    const posW = getClientCoords(e.target.parentNode);
    const shiftX = e.clientX - posS.x;
    const shiftY = e.clientY - posS.y;

    document.onmousemove = (el) => {
      const move = {
        x: clamp(Math.round(el.clientX - shiftX - posW.x), 0, posW.w - posS.w),
        y: clamp(Math.round(el.clientY - shiftY - posW.y), 0, posW.h - posS.h),
      };

      const style = {
        ...styles,
        left: `${move.x}px`,
        top: `${move.y}px`,
      };

      setStyles(style);
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  return (
    <>
      {React.Children.map(children, (child, i) => {
        return React.cloneElement(child, {
          index: i,
          key: i,
          onMouseDown,
          style: { ...styles, position: "absolute", userSelect: "none" },
        });
      })}
    </>
  );
};

export default Draggable;

Draggable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
  id: PropTypes.string,
};
