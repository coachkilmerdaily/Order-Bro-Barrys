# Order Bro

Simple browser prototype for supplier ordering at Barry's Burgers Semaphore.

## What it does

- Mobile-first supplier dashboard with 6 large supplier cards
- Clean header with Barry's logo, `Order Bro`, and today's date
- Supplier stock entry opens in an overlay drawer so the user does not need to scroll down the page
- Uses Phase One delivery rules for Saint Meat, Fruit & Veg, Galipo, Bidfood, Desserts, and Packaging
- Checks South Australia 2026 public holiday disruption dates
- Calculates next valid delivery day and required stock cover window
- Keeps Phase Two context controls in a separate Week Overview section instead of the main ordering flow
- Can sync live weather for Semaphore and map it into the weather mode automatically
- Current stock entry per item
- Suggested order quantities based on stock cover, par levels, manual trade expectation, weather nudges, event nudges, and storage caps
- Plain-text order summary for the active supplier with copy/paste support
- Automatically rolls over to a fresh stock-count cycle when the Adelaide date changes at midnight
- Includes a Phase Three upload review queue for supplier docs, invoice files, and naming-memory confirmation
- Stores supplier memory for aliases, units, pack terms, and manual supplier notes
- Starts the Phase Four-ready stock model by separating ordered units from counted/prepped units for Saint Meat
- Enforces hard storage-capacity limits and caps recommendations automatically when physical space is full
- Local browser save using `localStorage`

## Open it

Open [index.html](C:\Users\cnrat\OneDrive\Documents\Order Bro\index.html) in a browser.

## Important note about multiple staff

This prototype stores data in each browser separately. If you want multiple people sharing the same live counts and orders, the next step is to host this UI behind a small backend or database.

## Current Phase Three limitations

This static version now includes a live weather sync button, but it uses a browser-side weather API fetch rather than a dedicated Barry's backend or BOM-specific feed. Event detection is still operator-controlled, and invoice extraction is lightweight browser parsing only, so photos and PDFs still need manual review before learning is saved.
