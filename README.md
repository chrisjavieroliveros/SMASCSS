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

#### 3-Shared

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
