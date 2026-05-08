# Task 3 - Bug Fix Agent: Image Carousel selectedIndex Sync

## Task
Fix the Image Carousel component where thumbnails don't navigate the carousel and selectedIndex doesn't sync with the carousel's actual position.

## Issues Found
1. `selectedIndex` state managed independently from embla carousel's internal state
2. Thumbnail clicks only called `setSelectedIndex(i)` without scrolling the carousel
3. Carousel prev/next button navigation didn't update `selectedIndex`
4. Counter display showed stale index

## Changes Made
**File**: `/home/z/my-project/src/components/shared/image-carousel.tsx`

### Key Changes:
1. **Added embla API access**: Created `api` state with `CarouselApi` type and passed `setApi` prop to Carousel component
2. **Added sync effect**: `useEffect` that listens for embla's `"select"` event and calls `setSelectedIndex(api.selectedScrollSnap())` - this keeps selectedIndex in sync when users use prev/next buttons or swipe
3. **Created `scrollToIndex` callback**: Uses `useCallback` to memoize a function that both updates `selectedIndex` and calls `api?.scrollTo(index)` - this ensures both the state and the visual carousel move together
4. **Updated thumbnail onClick**: Changed from `setSelectedIndex(i)` to `scrollToIndex(i)` so clicking a thumbnail actually scrolls the carousel
5. **Updated lightbox navigation**: Prev/next buttons in the lightbox now use `scrollToIndex()` instead of just `setSelectedIndex()`, so when the lightbox closes the main carousel is at the correct position

### Imports Added:
- `useEffect`, `useCallback` from React
- `type CarouselApi` from `@/components/ui/carousel`

## Verification
- `bun run lint` passes with no errors
