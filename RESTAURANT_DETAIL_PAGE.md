# Restaurant Detail Page

## Overview

A comprehensive restaurant detail page that displays restaurant information and all associated orders with filtering and pagination.

## Features

### Restaurant Information

- Restaurant name, location, cuisine
- Full address, phone, email
- Total revenue display

### Orders Management

- **Paginated Orders List**: Browse through all orders for the restaurant
- **Filter Options**:
  - Date Range (From/To)
  - Amount Range (Min/Max)
- **Order Details Display**:
  - Order ID
  - Order Time (formatted as locale date/time)
  - Order Amount (formatted as currency)

## API Endpoints Added to Swagger

### 1. GET Restaurant Orders

```
POST /api/restaurants/{id}/orders
```

**Parameters:**

- `id` (path): Restaurant ID
- Request Body:
  - `page`: Page number
  - `from`: Start date (optional)
  - `to`: End date (optional)
  - `min_amount`: Minimum order amount (optional)
  - `max_amount`: Maximum order amount (optional)

**Response:**

```json
{
  "status": boolean,
  "message": string,
  "data": {
    "current_page": number,
    "data": Order[],
    "total": number,
    "per_page": number
  }
}
```

### 2. GET All Orders

```
POST /api/orders
```

**Parameters:**

- Request Body:
  - `page`: Page number
  - `restaurant_id`: Filter by restaurant (optional)
  - `from`: Start date (optional)
  - `to`: End date (optional)
  - `min_amount`: Minimum order amount (optional)
  - `max_amount`: Maximum order amount (optional)

## Navigation

### From Dashboard to Restaurant Detail

1. Click on any Top 3 Restaurant card
2. Click "View Details & Orders" button on any restaurant card
3. URL format: `/restaurants/{id}`

### From Restaurant Detail to Dashboard

- Click "← Back to Dashboard" link at the top

## Files Created/Modified

### Created:

1. `/frontend/src/components/RestaurantDetail/index.tsx` - Restaurant detail component
2. `/frontend/src/app/restaurants/[id]/page.tsx` - Dynamic route page

### Modified:

1. `/backend/public/swagger.json` - Added Orders API endpoints
2. `/frontend/src/components/Dashboard/index.tsx` - Added navigation links
3. Auto-generated API client files with new endpoints

## Usage Example

```typescript
// Navigate to restaurant detail page
<Link href={`/restaurants/${restaurant.id}`}>
  View Restaurant
</Link>

// Or use the component directly
<RestaurantDetail restaurantId={123} />
```

## UI Components

### Restaurant Info Card

- Gradient background (blue-50 to white)
- Two-column layout for info
- Displays all restaurant details with labels

### Filters Section

- 4-column grid layout (responsive)
- Date inputs for date range
- Number inputs for amount range
- Apply and Reset buttons

### Orders Table

- Clean table layout with headers
- Hover effect on rows
- Formatted order ID, time, and amount
- Empty state message when no orders found

### Pagination

- Shows current page and total pages
- Previous/Next buttons with disabled states
- Info text showing record range (e.g., "Showing 1 to 10 of 45 orders")
- Top and bottom pagination controls

## Testing

1. **View Restaurant Details**
   - Navigate to `/restaurants/1`
   - Verify restaurant info displays correctly

2. **Browse Orders**
   - Check orders are listed in table
   - Navigate through pages

3. **Filter by Date**
   - Set From and To dates
   - Click Apply Filters
   - Verify only orders in range appear

4. **Filter by Amount**
   - Set Min and Max amounts
   - Click Apply Filters
   - Verify only orders in range appear

5. **Combined Filters**
   - Apply multiple filters together
   - Verify all filters work together

6. **Reset Filters**
   - Apply some filters
   - Click Reset Filters
   - Verify all filters clear and page resets to 1

7. **Navigation**
   - Click Back to Dashboard
   - Verify returns to dashboard
   - Click restaurant card from dashboard
   - Verify navigates to detail page
