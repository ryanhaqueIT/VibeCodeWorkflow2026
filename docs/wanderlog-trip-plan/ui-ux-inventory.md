# UI/UX Inventory - Wanderlog Trip Plan (Trip to China)

URL: https://wanderlog.com/plan/djavnwcdeolucliy/trip-to-china
Captured: authenticated plan view (desktop + mobile)

## Global layout
- Split layout: left planning content + right map (desktop)
- Single-column content with map toggle (mobile)
- Sticky top nav with logo, save status, undo/redo, bulk actions, share/get app
- Floating map controls (zoom, layers, export, find hotels)
- Footer support links

## Primary navigation
- Logo link to home
- Save status indicator ("Saved")
- Undo / Redo
- Bulk actions: Copy to, Move to, Delete, Deselect all places
- Share / Get app / profile menu
- Sidebar toggle (mobile)
- AI Assistant entry point

## Map area
- Google Maps embed with zoom controls, scale, attribution, terms
- Map layers panel with select/deselect all
- Focus map search, find hotels
- Export (Pro) / Export to Google Maps (mobile)
- Map view / Exit map toggle

## Trip header
- Hero image with "Change header image"
- Trip title editable field
- Date range picker
- Owner avatar + actions

## Overview tab
- Carousel of community guides (image, title, author)
- Quick add tiles: reservations, lists, notes
- Itinerary preview blocks with day cards
- Budget summary section

## Explore tab
- Explore content (carousel / guide tiles)
- Explore CTA / browse all controls

## Notes tab
- Notes list with title field
- Notes body area with add note / checklist actions
- Empty-state hints

## Places to visit tab
- Places list with title field
- Add place input
- Recommended places carousel
- Add note / checklist actions

## Untitled list tab
- Custom list with title field
- Add place / note / checklist actions
- Empty-state layout

## Itinerary tab
- Day list with collapsible day headers
- Add subheading
- Auto-fill day
- Optimize route (Pro badge on some)
- Add place / note / checklist per day
- Lodging prompt card with "Book hotels"

## Budget tab
- Budget summary: total, set budget, group balances
- Actions: add expense, view breakdown, add tripmate, settings
- Expenses list with sort dropdown
- Empty-state message

## Modals and dialogs
- Share / Invite tripmates
  - Permission toggle (can edit / view only)
  - Shareable link + copy
  - Invite by email/user, manage tripmates
- Date range picker
  - Month navigation
  - Selected start/end date range

## AI Assistant
- Informational disclaimers
- Suggested prompts
- Input field with send button
- Pro upgrade banner

## Autocomplete and input states
- Add place combobox with suggestions list
- Inline list of search results (places, airports, map results)

## Mobile-specific UI
- Sidebar modal for tab navigation (Overview/Explore/Notes/Places/Untitled/Itinerary/Budget)
- Map view toggle becomes primary map navigation
- Compressed buttons and icon-only actions
- Share dialog adapted to narrow viewport

## System and utility UI
- Loading placeholders in lists
- Pro badges on premium actions
- Chat widget button

## Captured states (screenshots)
- Desktop: overview, explore, notes, places to visit, untitled, itinerary, budget
- Desktop: map layers open, share dialog, date picker, add place autocomplete, AI assistant
- Mobile: overview, explore, notes, places to visit, untitled, itinerary, budget
- Mobile: sidebar menu, map view, map layers open, share dialog, date picker, add place autocomplete, AI assistant
