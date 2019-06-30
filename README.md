# SMASS
~ Scalable and Modular Architecture for Sassy CSS

## Introduction
Nunc condimentum sapien odio, in faucibus lorem gravida at. Curabitur convallis augue eu sem tempus feugiat. Nunc eu ornare massa. Morbi malesuada enim tristique ante pulvinar viverra. Morbi turpis sapien, finibus ut massa at, posuere luctus eros. Duis porta nisl eget dapibus blandit. Phasellus vel libero sit amet sem aliquam volutpat eget eu metus. Suspendisse elit elit, dapibus facilisis ante id, lacinia tincidunt quam. Suspendisse condimentum at elit non volutpat. Nullam fringilla tortor imperdiet, auctor est at, vulputate nisl. Duis et aliquam urna. Maecenas commodo vitae urna vitae vehicula. Morbi pulvinar consectetur nibh ac lobortis. Etiam in ante ac odio efficitur consectetur. Nam non scelerisque dolor.

Pellentesque justo nisl, tristique eu dolor eget, sollicitudin ultricies purus. Aliquam placerat tortor ac purus ullamcorper, nec tincidunt arcu semper. Proin at ante molestie, tempor massa sit amet, luctus ex. Sed eu lacus tellus. In in metus elementum, egestas neque euismod, vulputate lacus. In hac habitasse platea dictumst.

## Folders Definitions

### Plugins
**0-Plugins:** The plugins directory contains all and ANY external assets, packages and resources.

_For example:_
- Normalize CSS
- Font Imports
- Theme Files

### Base
_**1-Base:**_ The base directory contains rules applied to an element using an element selector, a descendent selector, or a child selector, along with any pseudo-classes. It doesn’t include any class or ID selectors. It is defining the default styling for how that element should look in all occurrences on the page. 

Base styles include setting heading sizes, default link styles, default font styles, and body backgrounds. There should be no need to use !important in a Base style.

### Layout
_**2-Layout:**_ Layout directory contains all major styles for layout and setting up major sections all over the web design/page.

_For example:_
- Containers
- Wrappers
- Columns
- Grids

### Shared
_**3-Shared:**_ Shared directory contains Sass inheritance/extend properties. These are common styles that are reusable to any component.

Note: It is HIGHLY recommended that the styles in this directory should be kept as inheritance properties (```@extend```), and/or mixin definitions (```@include```) so it can easily be applied globally and merged together to any other existing styles.

_For example:_
- ```%global-input-style```
- ```@mixin global-input-style```


### Modules

### Custom

### Animation (_Optional_)

## Styling Rules

Basic element styling structure:
```
.element {
    // Element Style;

    // Children Styles;

    // States;
}
```
