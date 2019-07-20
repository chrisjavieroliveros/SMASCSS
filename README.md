# SMASC
_Scalable and Modular Architecture for Sassy CSS_

> Important: 

## Introduction
SMASC (pronounced “s-mask”) is a SCSS styling guide/architecture that attempts to document a consistent, scable and clear approach to any frontend web development process. This is **not** a framework; instead this is technique to keep styling codes (css or scss) more organized and more structured, leading to a development code that is easier to maintain and build.

### Inpirations

Pellentesque justo nisl, tristique eu dolor eget, sollicitudin ultricies purus. Aliquam placerat tortor ac purus ullamcorper, nec tincidunt arcu semper. Proin at ante molestie, tempor massa sit amet, luctus ex. Sed eu lacus tellus. In in metus elementum, egestas neque euismod, vulputate lacus. In hac habitasse platea dictumst.

In trying to learn more about what does and doesn't work in maintaining larger projects, I looked at how others were trying to solve similar problems. Nicole Sullivan's Object Oriented CSS, Jina's presentations on CSS Workflow, Natalie Downe's talk on Practical, maintainable CSS, and, lastly, Jeremy Keith's Pattern Primer were large influences on what was to become SMACSS.


### Getting Started
Pre-requisite knowledge:
- SCSS
- Compiling SCSS

## Core

Main Directory:
```
├── scss
│  ├── 0-plugins
│  ├── 1-main
│  ├── 2-inheritance
│  ├── 3-base
│  ├── 4-layout
│  ├── 5-modules
│  ├── 6-custom
│  ├── 7-animation
│  ├── main.scss
```

### Files

`main.scss`- Is our main scss file where; it is where we import our directories. It's best to leave this untouched. Unless we plan on adding a new directory to our project.

`*_dir.scss` Each folder contains its own directory file (denoted with a __dir_ suffix).

### Folders: Categorizing SCSS(CSS) Rules


#### Plugins 
_0-plugins_ - The plugins directory contains all and ANY external assets, packages and resources.

_Use Cases:_
- Normalize CSS
- Font Imports
- Theme File(s)

#### Main
_**1-Main**_ Contains SCSS variables, functions and mixins.

_Use Cases:_
- Color Definitions and Functions
- Responsive Function/Mixins

#### Inheritance
_**2-inteheritance:**_ Shared directory that contains sass inheritance/extended properties. These are common reusable styles.

Note: The styles in this directory should be kept as inheritance properties (```@extend```), and/or mixin definitions (```@include```) so it can easily be applied globally and merged together to any other existing styles.

_For example:_
- ```%global-input-style```
- ```@mixin global-input-style```

#### Base
_**3-Base:**_ The base directory contains rules applied to an element using an element selector. It is defining the default styling for how that element should look in all occurrences on the page. It is the default style of an element.

Base styles include setting heading sizes, default link styles, default font styles, and body backgrounds. In case of adding instances/variations in the element classes, it is best to create a correponding class and write the styles from their and not directly in the base element.

_Boilerplate files in directory:_
- Default ( `html`, `body` )
- Heading ( `h1`, `h2`, `h3`, `h4`, `h5`,`h6` )
- List ( `<ul>` `<ol>` )
- Paragraphs ( `<p>` )
- Line Heights ( _paragraph_, _span_ )

#### Layout
_**4-Layout:**_ Layout directory contains all major styles for layout and setting up major sections all over the web design/page.

_For example:_
- Containers
- Wrappers
- Columns
- Grids

#### Modules
_**5-Modules**_ Modules directory contains styles for reusable components. It is mandatory to use classes on this to easily replicate the styles.

#### Custom
_**6-Custom**_ Custom styles are mostly and/or almost always overrides for existing modules, classes and other (any) styles. It is recommended that we wrap a parent selector when we do the overrides.

#### Animation (_Optional_)
_**7-Animation**_ Library of animations reusable throughout the templates and classes.

## Styling Rules

Basic element styling structure:
```
.element {
    // Element Style;

    // Children Styles;

    // States;
}
```
