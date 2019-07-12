# SMASC
_Scalable and Modular Architecture for Sassy CSS_

## Introduction

Nunc condimentum sapien odio, in faucibus lorem gravida at. Curabitur convallis augue eu sem tempus feugiat. Nunc eu ornare massa. Morbi malesuada enim tristique ante pulvinar viverra. Morbi turpis sapien, finibus ut massa at, posuere luctus eros. Duis porta nisl eget dapibus blandit. Phasellus vel libero sit amet sem aliquam volutpat eget eu metus. Suspendisse elit elit, dapibus facilisis ante id, lacinia tincidunt quam. Suspendisse condimentum at elit non volutpat. Nullam fringilla tortor imperdiet, auctor est at, vulputate nisl. Duis et aliquam urna. Maecenas commodo vitae urna vitae vehicula. Morbi pulvinar consectetur nibh ac lobortis. Etiam in ante ac odio efficitur consectetur. Nam non scelerisque dolor.

### Inpirations
Pellentesque justo nisl, tristique eu dolor eget, sollicitudin ultricies purus. Aliquam placerat tortor ac purus ullamcorper, nec tincidunt arcu semper. Proin at ante molestie, tempor massa sit amet, luctus ex. Sed eu lacus tellus. In in metus elementum, egestas neque euismod, vulputate lacus. In hac habitasse platea dictumst.

## Folders
```
├── scss
│  ├── 0-plugins
│  ├── 1-main
│  ├── 2-shared
│  ├── 3-base
│  ├── 4-layout
│  ├── 5-modules
│  ├── 6-custom
│  ├── 7-animation
```

<!-- │  │  ├── 0-plugins-dir.scss -->

### Plugins
**_0-Plugins_** The plugins directory contains all and ANY external assets, packages and resources.

_For example:_
- Normalize CSS
- Font Imports
- Theme File(s)

### Main
_**1-Main**_ Contains SCSS variables, functions and mixins that will be reusable throughout the styles.

_For example:_
- Color Definitions and Functions
- Responsive Function/Mixins

### Shared
_**2-Shared:**_ Shared directory contains sass inheritance/extend properties. These are common reusable styles.

Note: The styles in this directory should be kept as inheritance properties (```@extend```), and/or mixin definitions (```@include```) so it can easily be applied globally and merged together to any other existing styles.

_For example:_
- ```%global-input-style```
- ```@mixin global-input-style```

### Base
_**3-Base:**_ The base directory contains rules applied to an element using an element selector. It is defining the default styling for how that element should look in all occurrences on the page. It is the default style of an element.

Base styles include setting heading sizes, default link styles, default font styles, and body backgrounds. In case of adding instances/variations in the element classes, it is best to create a correponding class and write the styles from their and not directly in the base element.

_Boilerplate files in directory:_
- Default ( `html`, `body` )
- Heading ( `h1`, `h2`, `h3`, `h4`, `h5`,`h6` )
- List ( `<ul>` `<ol>` )
- Paragraphs ( `<p>` )
- Line Heights ( _paragraph_, _span_ )

### Layout
_**4-Layout:**_ Layout directory contains all major styles for layout and setting up major sections all over the web design/page.

_For example:_
- Containers
- Wrappers
- Columns
- Grids

### Modules
_**5-Modules**_ Modules directory contains styles for reusable components. It is mandatory to use classes on this to easily replicate the styles.

### Custom
_**6-Custom**_ Custom styles are mostly and/or almost always overrides for existing modules, classes and other (any) styles. It is recommended that we wrap a parent selector when we do the overrides.

### Animation (_Optional_)
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
