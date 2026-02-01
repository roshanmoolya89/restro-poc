# Testing the Dashboard

## Prerequisites

- Backend running on http://localhost:8000
- Frontend running on http://localhost:3000
- Database seeded with restaurants, locations, cuisines, and orders

## Start the Application

### Backend (Laravel)

```bash
cd backend
php artisan serve
# Backend will run on http://localhost:8000
```

### Frontend (Next.js)

```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

## Access Points

- **Frontend Dashboard**: http://localhost:3000
- **Swagger UI Documentation**: http://localhost:8000/api/documentation
- **API Base URL**: http://localhost:8000/api

## Testing Features

### 1. Test Top 3 Restaurants

- **What to see**: Top 3 restaurants ranked by revenue
- **Expected**: Restaurants sorted by highest revenue first
- **How**: Just load the page, they appear at the top

### 2. Test Restaurant List

- **What to see**: Grid of restaurant cards
- **Expected**: All restaurants with location, cuisine, address, and revenue
- **How**: Scroll down to the "Restaurants" section

### 3. Test Search

- **Action**: Type restaurant name in search box
- **Expected**: List filters in real-time showing matching restaurants
- **Try**: Type partial names like "Pizza", "Burger", etc.

### 4. Test Location Filter

- **Action**: Select a location from dropdown
- **Expected**: Only restaurants in that location appear
- **How**: Click "All Locations" dropdown and select a location

### 5. Test Cuisine Filter

- **Action**: Select a cuisine type from dropdown
- **Expected**: Only restaurants with that cuisine type appear
- **How**: Click "All Cuisines" dropdown and select a cuisine

### 6. Test Sorting

- **Action**: Change sort field and direction
- **Expected**: Restaurants reorder accordingly
- **Try**:
  - Sort by Name (A-Z)
  - Sort by Name (Z-A)
  - Sort by Revenue (Low to High)
  - Sort by Revenue (High to Low)

### 7. Test Pagination

- **Action**: Click Previous/Next buttons
- **Expected**: Navigate through pages of restaurants
- **Note**: Buttons are disabled when at first/last page

### 8. Test Restaurant Selection

- **Action**: Click on any restaurant card
- **Expected**:
  - Card highlights with blue border
  - Order trends section appears below
  - Trends data loads for that restaurant

### 9. Test Order Trends

- **What to see**:
  - Total Orders count
  - Total Revenue amount
  - Average Order Value
  - Peak Hours grid showing hourly order counts
- **Expected**: Metrics calculate from all orders for selected restaurant

### 10. Test Date Range Filter

- **Action**:
  1. Select a restaurant
  2. Choose "From Date"
  3. Choose "To Date"
  4. Click "Apply Date Filter"
- **Expected**: Trends recalculate for the specified date range
- **Try**: Different date ranges to see how metrics change

### 11. Test Reset Filters

- **Action**: After applying various filters, click "Reset Filters"
- **Expected**: All filters return to defaults (no search, all locations, all cuisines, sort by name ascending, page 1)

## Sample Test Flow

1. **Load Page**
   - ✓ See top 3 restaurants
   - ✓ See full restaurant list

2. **Apply Filters**
   - Type "Pizza" in search
   - Select a specific location
   - Select "Italian" cuisine
   - Change sort to "Revenue" descending

3. **View Trends**
   - Click a restaurant
   - See trends appear
   - Note the metrics

4. **Filter Trends by Date**
   - Select date range (e.g., last week)
   - Click Apply
   - See metrics update

5. **Reset and Explore**
   - Click Reset Filters
   - Try different combinations

## Troubleshooting

### No Restaurants Showing

- **Check**: Backend is running
- **Check**: Database has restaurants
- **Check**: Browser console for errors
- **Try**: Run `php artisan db:seed` in backend

### Trends Not Loading

- **Check**: Restaurant has orders in database
- **Check**: Date range includes order dates
- **Check**: Network tab in browser DevTools for API errors

### Filters Not Working

- **Check**: Browser console for JavaScript errors
- **Try**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- **Check**: API responses in Network tab

### Peak Hours Not Showing

- **Reason**: No orders found for selected restaurant/date range
- **Fix**: Ensure orders exist in database for that restaurant
- **Check**: Run backend query to verify orders exist

## API Testing (Alternative)

You can also test the API directly:

```bash
# Get all restaurants
curl http://localhost:8000/api/restaurants

# Get restaurants with filters
curl "http://localhost:8000/api/restaurants?search=Pizza&sort_by=revenue&sort_direction=desc"

# Get restaurant trends
curl "http://localhost:8000/api/restaurants/1/trends?from=2024-01-01&to=2024-12-31"

# Get locations
curl http://localhost:8000/api/locations

# Get cuisines
curl http://localhost:8000/api/cuisines
```

## Expected Database Data

For full testing, ensure your database has:

- ✓ At least 10-20 restaurants
- ✓ Multiple locations (3-5)
- ✓ Multiple cuisines (5-10)
- ✓ Orders for restaurants with varying dates and times
- ✓ Orders with different amounts for revenue calculations

## Verification Checklist

- [ ] Top 3 restaurants display correctly
- [ ] Search filters restaurants
- [ ] Location filter works
- [ ] Cuisine filter works
- [ ] Sort by name works (asc/desc)
- [ ] Sort by revenue works (asc/desc)
- [ ] Pagination navigates pages
- [ ] Restaurant selection highlights card
- [ ] Trends load when restaurant selected
- [ ] Total orders shows correct count
- [ ] Total revenue shows correct sum
- [ ] Average order value calculates correctly
- [ ] Peak hours displays hourly breakdown
- [ ] Date range filter updates trends
- [ ] Reset filters clears all filters
- [ ] UI is responsive on mobile/tablet/desktop
- [ ] Loading states appear during API calls
- [ ] No console errors
