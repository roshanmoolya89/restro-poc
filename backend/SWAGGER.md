# Swagger API Documentation

## Overview

This project uses a manual Swagger UI setup for API documentation. The documentation is fully customizable and doesn't require any PHP packages.

## Files Structure

```
backend/
├── public/
│   └── swagger.json          # OpenAPI 3.0 specification file
├── resources/
│   └── views/
│       └── swagger.blade.php # Swagger UI view
└── routes/
    └── web.php               # Route for /api/documentation
```

## Accessing the Documentation

Once your Laravel server is running, access the Swagger UI at:

```
http://localhost:8000/api/documentation
```

## Updating the Documentation

To update the API documentation, edit the `swagger.json` file located at:

```
backend/public/swagger.json
```

This file follows the OpenAPI 3.0 specification format.

## Features

- ✅ Interactive API testing directly from the browser
- ✅ Complete request/response examples
- ✅ Parameter validation and documentation
- ✅ Organized by tags (General, Locations, Restaurants, Orders)
- ✅ Try-it-out functionality enabled
- ✅ Request duration display
- ✅ Persistent authorization
- ✅ Searchable/filterable endpoints

## Customization

### Swagger UI Configuration

Edit the JavaScript configuration in `resources/views/swagger.blade.php`:

```javascript
const ui = SwaggerUIBundle({
    url: "{{ asset('swagger.json') }}",
    dom_id: "#swagger-ui",
    deepLinking: true,
    // ... other options
});
```

Available options:

- `docExpansion`: "list" | "full" | "none"
- `filter`: true | false (enables search box)
- `defaultModelsExpandDepth`: number
- `tryItOutEnabled`: true | false

### Styling

The Swagger UI uses the official Swagger UI CSS from CDN. You can customize the appearance by:

1. Adding custom CSS in the `<style>` section of `swagger.blade.php`
2. Using Swagger UI themes
3. Downloading and hosting Swagger UI assets locally

## OpenAPI Specification

The `swagger.json` file includes:

### API Information

- Title: KitchenSpurs API
- Version: 1.0.0
- Description and contact information

### Servers

- Local development: `http://localhost:8000`
- Docker: `http://localhost`

### Endpoints

#### General

- `GET /` - Welcome endpoint

#### Locations

- `GET /locations` - Get all locations
- `GET /locations/{id}` - Get location by ID

#### Restaurants

- `GET /restaurants` - Get all restaurants
- `GET /restaurants/{id}` - Get restaurant by ID
- `GET /restaurants/{id}/trends` - Get order trends
- `POST /restaurants/{id}/orders` - Get restaurant orders
- `GET /restaurants/{id}/orders/{order_id}` - Get specific order

#### Orders

- `POST /orders` - Get all orders
- `GET /orders/{id}` - Get order by ID

## Adding New Endpoints

To add a new endpoint to the documentation:

1. Open `public/swagger.json`
2. Add a new path under the `paths` object:

```json
"/your-endpoint": {
  "get": {
    "summary": "Endpoint description",
    "tags": ["YourTag"],
    "parameters": [...],
    "responses": {
      "200": {
        "description": "Success",
        "content": {
          "application/json": {
            "schema": {...}
          }
        }
      }
    }
  }
}
```

3. Refresh the documentation page in your browser

## No Build Required

This setup requires no build steps or package installations. The Swagger UI assets are loaded from CDN:

- Swagger UI CSS: v5.11.0
- Swagger UI Bundle: v5.11.0
- Swagger UI Standalone Preset: v5.11.0

## Benefits of Manual Setup

1. **No Dependencies**: Doesn't add Composer packages to your project
2. **Full Control**: Complete control over the OpenAPI specification
3. **Easy Updates**: Simply edit the JSON file
4. **Version Control**: Easy to track changes in git
5. **Performance**: No PHP processing needed for documentation
6. **Portable**: Can be copied to any Laravel project

## Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Swagger Editor Online](https://editor.swagger.io/) - Validate your swagger.json
