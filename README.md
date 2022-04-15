# React Reactive Nav

React navbar component that mimics Android-like toolbar scrolling behavior.

![preview](https://github.com/franz-dc/react-reactive-nav/blob/main/preview.gif?raw=true)

## Installation

### yarn

```bash
yarn add react-reactive-nav
```

### npm

```bash
npm i react-reactive-nav
```

## Usage

```jsx
import { ReactiveNav } from 'react-reactive-nav';

const MyComponent = () => (
  <ReactiveNav height={64}>{/* navbar content goes here */}</ReactiveNav>
);
```

Note that `height` must be supplied to the component's props.

## Examples

### MUI (Material-UI)

```jsx
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/core';
import { Menu as MenuIcon } from '@mui/icons-material';
import { ReactiveNav } from 'react-reactive-nav';

const MyComponent = () => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <ReactiveNav height={smUp ? 64 : 56}>
      <AppBar>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' color='inherit' component='div'>
            App Bar
          </Typography>
        </Toolbar>
      </AppBar>
    </ReactiveNav>
  );
};
```

[![Edit react-reactive-nav demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-reactive-nav-demo-z74jef?fontsize=14&hidenavigation=1&theme=dark)
