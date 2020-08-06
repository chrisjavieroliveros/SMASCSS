# SMASCSS 3.1

_Scalable and Modular Architecture for Sassy CSS_

## Introduction

SMASC (pronounced “s-mask”) is a SCSS styling guide/architecture that attempts to document a consistent, scable and clear approach to any frontend web development process. This is **not** a framework; instead this is technique to keep styling codes (css or scss) more organized and more structured, leading to a development code that is easier to maintain and build.

The main mission of SMASCSS is to have a styling architecture and workflow that's highly maintainable, easy to understand and use.

### Inpirations

In trying to learn more about what does and doesn't work in maintaining larger projects, I looked at how others were trying to solve similar problems. Nicole Sullivan's Object Oriented CSS, Jina's presentations on CSS Workflow, Natalie Downe's talk on Practical, maintainable CSS, and, lastly, Jeremy Keith's Pattern Primer were large influences on what was to become SMASCSS.

## Getting Started

Pre-requisite knowledge:

- SCSS
- Compiling SCSS
- NPM/Yarn (esp when using Bootstrap)

## Scaffolding

```
├── scss
│  ├── vendors
│  ├── abstracts
│  ├── base
│  ├── layouts
│  ├── components
│  ├── overrides
│  ├── custom [optional]
│  ├── themes [optional]
```

Note: Although these files do not appear to be in this order inside; it is however imported this way in the _main.scss_ file, so it gets compiled in this structure.

## General Information

### The Basics

`main.scss`- Is our main scss file. This is the file that gets compiled. Rename this file as you see fit. This is also the place where we set the file version to keep track of everything. (Or at least that's what I do.)

The _main.scss_ file is where we import our directories. It's best to leave the imports untouched - unless you plan on adding a new directory to your project.

`*_dir.scss` - Each folder contains its own directory file (denoted with a \__dir_ suffix). 

While _main.scss_ is pulling these directory files; the main function of a directory file is to pull its own local files. This then merge them altogether into one file when scss is compiled. 

Doing this makes all styling logic localized and modularized. It helps us manage and maintain all our styling code efficiently as each component will have its own file. It reduces alot of the clutter during development (if it doesn't eliminate it).

### The Main Folders

Getting to know the folders is the most critical thing to understand to be able to make sense of SMASCSS and what we are trying to do. Read through each folder description very carefully. The great thing about this is that it's straightforward and very easy to understand. You will only need to read this once.

`/vendors` - The vendors folder contains all and ANY external assets, packages and resources. The best example of these external assets are:

- Font Imports
- Themes
- UI Packages
- Browser Resets
- CSS Boilerplates

This way, all of our vendor assets are contained in one folder; thus can be updated anytime and very easily.

`/abstracts` - The abstracts folder is our main SCSS-Logic archive. This folder contains SCSS variables, functions and mixins. Any function or variable that we are going to make available for the entire project has to be added here.

There are functions and mixins in this folder by default. One example of an abstract in this folder is the _responsive.scss_; this is our default mixin to handle responsive media queries. SMASCSS makes it very easy to add media queries using mixins! Please check out this file's "How to Use".

Another very useful trait of the abstracts folder is that.

`/base` - The base directory contains rules applied to an element using an **element selector**. It is defining the default styling for how that element should look in all occurrences on the page. It is the default style of an element.

Base styles include setting heading sizes, default link styles, default button styles, default font styles, and body backgrounds. This folder is like our own personal default / / base / reset.

Elements that are recommened to be set in base directory are:

- Navigation
- List (ol, ul, li)

Additional notes:

- Set the global fonts and any font/text related properties in _typography.scss_

`/layouts` - Layout directory contains all major styles for layout and setting up sections and wrappers.

Classes / Styles that are recommened to be in layouts are:

- Containers
- Wrappers
- Columns
- Grids

`/components` - The components directory contains styles for reusable components. This is the holy grail of the idea of SMASCSS. While every website / webapp begins with setting up the defaults; components are mostly unique to every project. This is the directory we would populate most as unique components and/or modules should be added here.


`/overrides` -  Overrides directory contains specific and very unique styles. These styles are most likely an override for the existing modules, components or defaults. Most likely these overrides happen when you add and exiting component/style to a new section/page; but this time needs a few tweaks to perfectly fit. Overrides gives us great flexibility to modify existing components without affecting our original code.

How to use efficiently:
1. Wrap the component / element / class to be overriden with a parent
2. Add a unique #id to the parent
3. Use the parent #id to override the styles

Sample scenario of when to you use the overrides folder:
- You already have a _navigation_ element styled in the _/base_ folde. Bbut then on this one page you somehow need to adjust the padding size and position. You cannot change the base code as it would affect the rest of the pages; that is when you:

    1. create a new navigation file in the /overrides
    2. add a unique _#id_ to this new navigation element
    3. Override the base styles it using the unique id thus, any code we add to this id, only affects this navigation.

### Optional Folders (Docs Coming Soon)
Important Note: Optional folders **should never** be imported to the main.scss as these optional folders are intentionally created to generate their own separate css files.

`/custom` - Optimization reasons. 

`/themes` - Mostly contains color overrides for CSS variables.

## FAQs

