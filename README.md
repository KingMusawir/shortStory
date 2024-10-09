# React Inventory Application Documentation

## Table of Contents
1. [Overview](#overview)
2. [Components](#components)
    - [App](#app)
    - [InventoryCard](#inventorycard)
    - [InventoryView](#inventoryview)
    - [SelectionView](#selectionview)
    - [Timer](#timer)
    - [Filter](#filter)
3. [Key Features](#key-features)
4. [State Management](#state-management)
5. [Drag and Drop Functionality](#drag-and-drop-functionality)
6. [Filtering and Pagination](#filtering-and-pagination)
7. [Responsive Design](#responsive-design)

## Overview

This React application is an inventory management system with drag-and-drop functionality, filtering, and real-time updates. It allows users to view and interact with inventory items, select items, and apply various filters.

## Components

### App

The main component that orchestrates the entire application.

Key features:
- Manages the overall state of the application
- Handles drag and drop operations between inventory and selection
- Implements filtering and pagination of inventory items
- Manages the timer functionality
- Handles responsive design for small screens

### InventoryCard

Represents an individual item in the inventory or selection.

Key features:
- Displays item image and ID
- Allows cycling through multiple images
- Implements drag and drop functionality
- Shows a modal with a larger image on click

### InventoryView

Displays the main inventory grid.

Key features:
- Renders a grid of InventoryCard components
- Implements infinite scrolling for loading more items
- Manages the droppable area for the inventory

### SelectionView

Displays the selected items.

Key features:
- Renders a grid of selected InventoryCard components
- Manages the droppable area for the selection

### Timer

Displays a timer that starts when items are selected.

Key features:
- Shows time in minutes and seconds
- Starts automatically when items are selected

### Filter

Provides filtering options for the inventory.

Key features:
- Allows filtering by even numbers, prime numbers, ending digits, and number range
- Updates the inventory view in real-time as filters are applied

## Key Features

1. Drag and Drop: Users can drag items between the inventory and selection areas.
2. Image Gallery: Each item has multiple images that can be cycled through.
3. Filtering: Users can apply various filters to the inventory.
4. Infinite Scrolling: The inventory loads more items as the user scrolls.
5. Real-time Updates: The inventory updates in real-time as filters are applied or items are moved.
6. Responsive Design: The application adapts to different screen sizes.

## State Management

The application uses React's useState and useEffect hooks for state management. Key state variables include:

- inventory: The full list of inventory items
- displayedInventory: The currently displayed inventory items
- selectedItems: The items in the selection area
- filters: The current filter settings
- isTimerRunning: The state of the timer

## Drag and Drop Functionality

The application uses the `@dnd-kit` library for drag and drop functionality. This includes:

- DndContext in the App component for overall drag and drop management
- useSortable in InventoryCard for making items draggable
- useDroppable in InventoryView and SelectionView for creating drop zones

## Filtering and Pagination

Filtering is implemented in the App component using the Filter component. The `handleFilterChange` function applies filters to the inventory in real-time.

Pagination is implemented using the `loadMoreItems` function, which loads additional items when the user scrolls to the bottom of the inventory.

## Responsive Design

The application includes responsive design features:

- Grid layout adapts to different screen sizes
- A message is displayed for very small screens where the app cannot be used effectively

This documentation provides an overview of the React Inventory Application, its components, and key features. For more detailed information on each component or functionality, refer to the inline comments in the code.