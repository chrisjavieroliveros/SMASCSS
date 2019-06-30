# SMASS
~ Scalable and Modular Architecture for Sassy CSS

## Getting Started

## Introduction

## Folders


#### Plugins
**0-Plugins:** The plugins directory contains all and ANY external assets, packages and resources.

_For example:_
- Normalize CSS
- Font Imports
- Theme Files

#### Base
**1-Base:** The base directory contains rules applied to an element using an element selector, a descendent selector, or a child selector, along with any pseudo-classes. It doesn’t include any class or ID selectors. It is defining the default styling for how that element should look in all occurrences on the page. 

Base styles include setting heading sizes, default link styles, default font styles, and body backgrounds. There should be no need to use !important in a Base style.

#### Layout
**2-Layout:** Layout directory contains all major styles for layout and setting up major sections all over the web design/page.

_For example:_
- Containers
- Wrappers
- Columns
- Grids

#### Shared
**3-Shared:** Shared directory contains Sass inheritance/extend properties. These are common styles that are reusable to any component.

Note: It is HIGHLY recommended that the styles in this directory should be kept as inheritance properties (```@extend```), and/or mixin definitions (```@include```) so it can easily be applied globally and merged together to any other existing styles.

_For example:_
- ```%global-input-style```
- ```@mixin global-input-style```


#### Modules

#### Custom

#### Animation (_Optional_)

## Styling Rules

Basic element styling structure:
```
.element {
    // Element Style;

    // Children Styles;

    // States;
}
```
