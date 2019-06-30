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

#### 2-Layout
**2-Layout:** Layout directory contains all major styles for layout and setting up major sections all over the web design/page.

_For example:_
- Containers
- Wrappers
- Columns
- Grids

#### 3-Shared
**3-Shared:** Shared directory contains Sass inheritance/extend properties. These are common styles that are reusable to any component.

Note: It is recommended that the styles in this directory should be kept as:
```@extend``` or ```@include```

_For example:_
- @extend
- 


#### 4-Modules

#### 5-Custom

#### 6-Animation (_Optional_)

## Styling Rules

Basic element styling structure:
```
.element {
    // Element Style;

    // Children Styles;

    // States;
}
```
