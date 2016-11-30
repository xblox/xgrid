### Extensions and fixes for [dgrid](https://github.com/SitePen/dgrid)
  
- better keyboard control for trees and thumbs
- layout functions to split areas of the grid, statusbar & toolbar area
- multi-renderers as mixin
- simple setup for all features
- search filter with a simple ui
- xide specific extension for actions (for column-hider, search, clipboard, show status-bar, ...)
- fixes some things
- some more options to the select mixin (select(rows,to,select, options: focus, delay, append, expand))



### Dependencies

*Basics*

- [custom dgrid version](https://github.com/gbaumgart/xgrid)
- jQuery (globally loaded, not as AMD module)
- [xide](https://github.com/gbaumgart/xide) for events and core stuff
- Optional: [xlang](https://github.com/gbaumgart/xlang) alternate i18 module
- Optional: [xaction](https://github.com/gbaumgart/xaction) for grid's user action
- Optional: [xdocker](https://github.com/gbaumgart/xdocker) for layout functions like having panels within the grid
- Optional: [bootstrap 3 themes](https://github.com/gbaumgart/admin-theme)

### Installation

Do the setup as usual, download the dependencies at your src/lib/ root and define the packages in you Dojo config 

### Demos

- [screenshots](https://github.com/net-commander/windows-dist/issues/57)

### Usage

<hr/>

### Todo's

- Shim jQuery
- replace all dojo dom and render stuff with web-components/HTMLCustomElement
- sort & group actions (and their renderers)
- cleanup code
- test units

### License: BSD-3-clause