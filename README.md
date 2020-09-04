# react-bezier

Small and simple library for ReactJs for plotting bezier curves

### Install dependencies

```bash
npm install react-bezier
```

### Demo

https://error-256.github.io/react-bezier/

### Demo source codes

https://github.com/Error-256/react-bezier/tree/master/src/docs

##### Settings:

| method   | description               | default  |
| :------- | :------------------------ | :------- |
| settings | array of settings objects | required |
| arrow    | direction arrow           | **true** |

##### Settings object:

| name      | description                                                                                                                                                                                                  |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from      | start id                                                                                                                                                                                                     |
| to        | end id                                                                                                                                                                                                       |
| positions | contains 2 properties: **start** and **end** responsible for display settings. **side** - the side to which the line is attached, **indent** - the indent from the edge (optional, by default in the center) |
| style     | css class                                                                                                                                                                                                    |

### Example

```js
import ReactBezier from "react-bezier";

...

const settings = [
  {
    from: "cube-1",
    to: "cube-2",
    positions: {
      start: {
        side: "bottom",
        indent: 20
      },
      end: {
        side: "top",
      },
    },
    style: "red-line",
  }
]

...

<ReactBezier settings={settings}>
  <div>
    <div id="cube-1"></div>
    <div id="cube-2"></div>
  </div>
</ReactBezier>
```
