export interface ApiDocCodeSample {
    label: string;
    language: string;
    code: string;
}

export interface ApiDocEndpointField {
    name: string;
    type: string;
    required?: boolean;
    description: string;
}

export interface ApiDocEndpoint {
    id: string;
    title: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    summary: string;
    description: string;
    auth: string;
    headers?: ApiDocEndpointField[];
    queryParams?: ApiDocEndpointField[];
    bodyFields?: ApiDocEndpointField[];
    notes?: string[];
    responseExample: string;
    samples: ApiDocCodeSample[];
}

export interface ApiDocSection {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    endpoints: ApiDocEndpoint[];
}

export const API_DOCS_BASE_URL = 'https://api.foodbot.io/api/v1';

export const API_DOCS_HIGHLIGHTS = [
    {
        title: 'Private client access',
        description: 'API keys are issued manually after a discovery call, onboarding review, and approved use case.'
    },
    {
        title: 'Structured JSON',
        description: 'Every endpoint returns a consistent envelope with success, data, meta, and errors.'
    },
    {
        title: 'Built for nutrition workflows',
        description: 'Recipes, planning, nutrition, and shopping endpoints map directly to FoodBot product flows.'
    }
];

export const API_DOCS_AUTH_STEPS = [
    'Book a short integration call with the FoodBot team.',
    'We agree the endpoints, scope, rate limit, and environment you need.',
    'FoodBot generates an API key for your workspace and shares it once.',
    'You send the key in the X-API-Key header for approved client-facing endpoints.'
];

export const API_DOCS_ERRORS = [
    { code: '400', title: 'Bad Request', description: 'The request shape, parameters, or body values are invalid.' },
    { code: '401', title: 'Unauthorized', description: 'The API key is missing, invalid, expired, or revoked.' },
    { code: '403', title: 'Forbidden', description: 'Your key exists but does not have access to this endpoint or scope.' },
    { code: '404', title: 'Not Found', description: 'The requested resource could not be found.' },
    { code: '429', title: 'Rate Limited', description: 'Your client exceeded the agreed request budget.' }
];

export const API_DOCS_SECTIONS: ApiDocSection[] = [
    {
        id: 'recipes',
        eyebrow: 'Content API',
        title: 'Recipes',
        description: 'Fetch public recipes and search FoodBot recipe content for client applications, partner portals, or discovery tools.',
        endpoints: [
            {
                id: 'recipes-list',
                title: 'List recipes',
                method: 'GET',
                path: '/recipes?page=1&pageSize=12&tags=high-protein&tags=quick',
                summary: 'Returns paginated public recipes with optional tag filtering.',
                description: 'Use this endpoint to populate recipe carousels, content feeds, or category-specific discovery experiences.',
                auth: 'Approved API key',
                headers: [
                    { name: 'X-API-Key', type: 'string', required: true, description: 'Your issued FoodBot client API key.' }
                ],
                queryParams: [
                    { name: 'page', type: 'number', description: 'Page number starting from 1.' },
                    { name: 'pageSize', type: 'number', description: 'Items per page.' },
                    { name: 'tags', type: 'string[]', description: 'Repeatable tag filters such as high-protein or quick.' }
                ],
                notes: [
                    'Results are returned inside the standard API envelope.',
                    'Pagination details are placed in the meta object.'
                ],
                responseExample: `{
  "success": true,
  "data": [
    {
      "name": "Chicken Suya Rice Bowl",
      "slug": "chicken-suya-rice-bowl",
      "description": "A high-protein bowl with smoky spice and quick prep.",
      "dietaryTags": ["high-protein", "quick"],
      "prepTimeMin": 15,
      "cookTimeMin": 20,
      "servings": 2
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 12,
    "total": 48
  },
  "errors": []
}`,
                samples: [
                    {
                        label: 'cURL',
                        language: 'bash',
                        code: `curl --request GET \\
  '${API_DOCS_BASE_URL}/recipes?page=1&pageSize=12&tags=high-protein&tags=quick' \\
  --header 'X-API-Key: fb_live_your_key_here'`
                    },
                    {
                        label: 'JavaScript',
                        language: 'javascript',
                        code: `const response = await fetch(
  '${API_DOCS_BASE_URL}/recipes?page=1&pageSize=12&tags=high-protein&tags=quick',
  {
    headers: {
      'X-API-Key': 'fb_live_your_key_here'
    }
  }
);

const payload = await response.json();`
                    },
                    {
                        label: 'Python',
                        language: 'python',
                        code: `import requests

response = requests.get(
    '${API_DOCS_BASE_URL}/recipes',
    params={'page': 1, 'pageSize': 12, 'tags': ['high-protein', 'quick']},
    headers={'X-API-Key': 'fb_live_your_key_here'}
)

payload = response.json()`
                    }
                ]
            },
            {
                id: 'recipes-search',
                title: 'Search recipes',
                method: 'GET',
                path: '/recipes/search?q=jollof&limit=10',
                summary: 'Searches public recipes by text query.',
                description: 'Use this for autocomplete, ingredient-led search, or keyword-led recipe discovery experiences.',
                auth: 'Approved API key',
                headers: [
                    { name: 'X-API-Key', type: 'string', required: true, description: 'Your issued FoodBot client API key.' }
                ],
                queryParams: [
                    { name: 'q', type: 'string', required: true, description: 'Search term such as jollof, bean stew, or chicken.' },
                    { name: 'limit', type: 'number', description: 'Maximum number of results to return.' }
                ],
                responseExample: `{
  "success": true,
  "data": [
    {
      "name": "Classic Jollof Rice",
      "slug": "classic-jollof-rice"
    },
    {
      "name": "Party Jollof Chicken Tray",
      "slug": "party-jollof-chicken-tray"
    }
  ],
  "meta": null,
  "errors": []
}`,
                samples: [
                    {
                        label: 'cURL',
                        language: 'bash',
                        code: `curl --request GET \\
  '${API_DOCS_BASE_URL}/recipes/search?q=jollof&limit=10' \\
  --header 'X-API-Key: fb_live_your_key_here'`
                    },
                    {
                        label: 'C#',
                        language: 'csharp',
                        code: `using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "fb_live_your_key_here");

var payload = await client.GetStringAsync(
    "${API_DOCS_BASE_URL}/recipes/search?q=jollof&limit=10"
);`
                    }
                ]
            }
        ]
    },
    {
        id: 'planning',
        eyebrow: 'Planning API',
        title: 'Meal planning',
        description: 'Generate or fetch meal planning data that can be embedded into partner dashboards or health workflows.',
        endpoints: [
            {
                id: 'mealplans-current',
                title: 'Get current meal plan',
                method: 'GET',
                path: '/mealplans/current',
                summary: 'Returns the active meal plan for the approved client context.',
                description: 'Use this to sync the latest active FoodBot meal plan into a customer dashboard or wellness workflow.',
                auth: 'Approved API key',
                headers: [
                    { name: 'X-API-Key', type: 'string', required: true, description: 'Your issued FoodBot client API key.' }
                ],
                responseExample: `{
  "success": true,
  "data": {
    "name": "High Protein Week",
    "weekStart": "2026-03-16T00:00:00Z",
    "days": [
      {
        "dayOfWeek": "Monday",
        "meals": [
          { "mealType": "Breakfast", "name": "Greek yogurt parfait" }
        ]
      }
    ]
  },
  "meta": null,
  "errors": []
}`,
                samples: [
                    {
                        label: 'cURL',
                        language: 'bash',
                        code: `curl --request GET \\
  '${API_DOCS_BASE_URL}/mealplans/current' \\
  --header 'X-API-Key: fb_live_your_key_here'`
                    },
                    {
                        label: 'JavaScript',
                        language: 'javascript',
                        code: `const response = await fetch('${API_DOCS_BASE_URL}/mealplans/current', {
  headers: {
    'X-API-Key': 'fb_live_your_key_here'
  }
});

const payload = await response.json();`
                    }
                ]
            },
            {
                id: 'mealplans-generate',
                title: 'Generate meal plan',
                method: 'POST',
                path: '/mealplans/generate',
                summary: 'Builds a meal plan from goals and planning preferences.',
                description: 'Use this when your client flow needs FoodBot to generate a fresh plan from goal and preference inputs.',
                auth: 'Approved API key',
                headers: [
                    { name: 'X-API-Key', type: 'string', required: true, description: 'Your issued FoodBot client API key.' },
                    { name: 'Content-Type', type: 'string', required: true, description: 'Set to application/json.' }
                ],
                bodyFields: [
                    { name: 'goal', type: 'string', required: true, description: 'Examples include weight-loss, maintenance, or muscle-gain.' },
                    { name: 'days', type: 'number', required: true, description: 'Number of planning days to generate.' },
                    { name: 'preferences', type: 'string[]', description: 'Optional dietary or cuisine preferences.' }
                ],
                responseExample: `{
  "success": true,
  "data": {
    "name": "Weight Loss Plan",
    "days": [
      {
        "dayOfWeek": "Monday",
        "meals": [
          { "mealType": "Lunch", "name": "Suya chicken wrap" }
        ]
      }
    ]
  },
  "meta": null,
  "errors": []
}`,
                samples: [
                    {
                        label: 'cURL',
                        language: 'bash',
                        code: `curl --request POST '${API_DOCS_BASE_URL}/mealplans/generate' \\
  --header 'X-API-Key: fb_live_your_key_here' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "goal": "maintenance",
    "days": 7,
    "preferences": ["high-protein", "west-african"]
  }'`
                    },
                    {
                        label: 'Python',
                        language: 'python',
                        code: `import requests

response = requests.post(
    '${API_DOCS_BASE_URL}/mealplans/generate',
    headers={
        'X-API-Key': 'fb_live_your_key_here',
        'Content-Type': 'application/json'
    },
    json={
        'goal': 'maintenance',
        'days': 7,
        'preferences': ['high-protein', 'west-african']
    }
)

payload = response.json()`
                    }
                ]
            }
        ]
    },
    {
        id: 'nutrition',
        eyebrow: 'Tracking API',
        title: 'Nutrition tracking',
        description: 'Read daily nutrition state or send tracking data to FoodBot for downstream analytics and coaching.',
        endpoints: [
            {
                id: 'nutrition-today',
                title: 'Get nutrition snapshot',
                method: 'GET',
                path: '/nutrition/today',
                summary: 'Returns today’s meal entries together with active macro goals.',
                description: 'Useful for wellness dashboards, summary widgets, or external client portals that need a single daily nutrition snapshot.',
                auth: 'Approved API key',
                headers: [
                    { name: 'X-API-Key', type: 'string', required: true, description: 'Your issued FoodBot client API key.' }
                ],
                responseExample: `{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "67d90db06d99f0d53cde4301",
        "name": "Oats and eggs",
        "type": "breakfast",
        "calories": 420,
        "protein": 24
      }
    ],
    "goals": {
      "calories": 2200,
      "protein": 160,
      "carbs": 210,
      "fat": 70
    },
    "date": "2026-03-19T00:00:00Z"
  },
  "meta": null,
  "errors": []
}`,
                samples: [
                    {
                        label: 'cURL',
                        language: 'bash',
                        code: `curl --request GET \\
  '${API_DOCS_BASE_URL}/nutrition/today' \\
  --header 'X-API-Key: fb_live_your_key_here'`
                    }
                ]
            },
            {
                id: 'nutrition-log',
                title: 'Log a meal',
                method: 'POST',
                path: '/nutrition/log',
                summary: 'Creates a nutrition log entry for downstream analytics and coaching.',
                description: 'Send normalized meal totals from your client app so FoodBot can keep dashboards, streaks, and insights current.',
                auth: 'Approved API key',
                headers: [
                    { name: 'X-API-Key', type: 'string', required: true, description: 'Your issued FoodBot client API key.' },
                    { name: 'Content-Type', type: 'string', required: true, description: 'Set to application/json.' }
                ],
                bodyFields: [
                    { name: 'name', type: 'string', required: true, description: 'Meal name displayed in dashboards and recent logs.' },
                    { name: 'type', type: 'string', required: true, description: 'Meal category such as breakfast, lunch, dinner, or snack.' },
                    { name: 'calories', type: 'number', required: true, description: 'Calories for the meal.' },
                    { name: 'protein', type: 'number', required: true, description: 'Protein in grams.' },
                    { name: 'carbs', type: 'number', required: true, description: 'Carbohydrates in grams.' },
                    { name: 'fat', type: 'number', required: true, description: 'Fat in grams.' }
                ],
                responseExample: `{
  "success": true,
  "data": {
    "id": "67d90db06d99f0d53cde4301",
    "recipeName": "Oats and eggs",
    "calories": 420,
    "proteinG": 24
  },
  "meta": null,
  "errors": []
}`,
                samples: [
                    {
                        label: 'cURL',
                        language: 'bash',
                        code: `curl --request POST '${API_DOCS_BASE_URL}/nutrition/log' \\
  --header 'X-API-Key: fb_live_your_key_here' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "name": "Oats and eggs",
    "type": "breakfast",
    "calories": 420,
    "protein": 24,
    "carbs": 38,
    "fat": 15
  }'`
                    }
                ]
            },
            {
                id: 'nutrition-exercise-import',
                title: 'Import exercise records',
                method: 'POST',
                path: '/nutrition/exercise-import',
                summary: 'Imports one or more exercise records into FoodBot in a deduplicated batch.',
                description: 'Use this when your client app or partner sync wants to push normalized workout data into FoodBot so dashboards and insights update automatically without manual entry.',
                auth: 'Bearer JWT for a paid FoodBot account',
                headers: [
                    { name: 'Authorization', type: 'string', required: true, description: 'Bearer token for a Pro or Nutrition Coach user.' },
                    { name: 'Content-Type', type: 'string', required: true, description: 'Set to application/json.' }
                ],
                bodyFields: [
                    { name: 'source', type: 'string', required: true, description: 'Sync source identifier such as health_connect, strava, or client_app.' },
                    { name: 'records', type: 'object[]', required: true, description: 'List of normalized exercise records to import.' },
                    { name: 'records[].externalId', type: 'string', required: true, description: 'Stable source-side id used for deduplication.' },
                    { name: 'records[].activity', type: 'string', required: true, description: 'Workout type such as Running, Walking, Cycling, or Strength.' },
                    { name: 'records[].durationMin', type: 'number', required: true, description: 'Workout duration in minutes.' },
                    { name: 'records[].caloriesBurned', type: 'number', description: 'Calories burned if the source provides it.' },
                    { name: 'records[].occurredAtUtc', type: 'string', description: 'Optional UTC timestamp for when the workout happened.' }
                ],
                notes: [
                    'This endpoint is available only to paid FoodBot plans.',
                    'Records are deduplicated by source and externalId.',
                    'Manual entries should continue using the normal exercise log endpoint.'
                ],
                responseExample: `{
  "success": true,
  "data": {
    "source": "client_app",
    "importedCount": 2,
    "skippedCount": 1,
    "failedCount": 0,
    "failures": []
  },
  "meta": null,
  "errors": []
}`,
                samples: [
                    {
                        label: 'cURL',
                        language: 'bash',
                        code: `curl --request POST '${API_DOCS_BASE_URL}/nutrition/exercise-import' \\
  --header 'Authorization: Bearer your_paid_user_token' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "source": "client_app",
    "records": [
      {
        "externalId": "workout_20260320_001",
        "activity": "Running",
        "durationMin": 42,
        "caloriesBurned": 380,
        "occurredAtUtc": "2026-03-20T06:15:00Z"
      }
    ]
  }'`
                    },
                    {
                        label: 'JavaScript',
                        language: 'javascript',
                        code: `const response = await fetch('${API_DOCS_BASE_URL}/nutrition/exercise-import', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer your_paid_user_token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    source: 'client_app',
    records: [
      {
        externalId: 'workout_20260320_001',
        activity: 'Running',
        durationMin: 42,
        caloriesBurned: 380,
        occurredAtUtc: '2026-03-20T06:15:00Z'
      }
    ]
  })
});

const payload = await response.json();`
                    }
                ]
            }
        ]
    },
    {
        id: 'shopping',
        eyebrow: 'Operations API',
        title: 'Shopping lists',
        description: 'Generate grocery output from active meal plans and keep completion state in sync across client experiences.',
        endpoints: [
            {
                id: 'shopping-latest',
                title: 'Get latest shopping list',
                method: 'GET',
                path: '/shoppinglist/latest',
                summary: 'Returns the latest generated shopping list with flat item data.',
                description: 'Use this to render grouped grocery views or mirror FoodBot shopping state into a partner product.',
                auth: 'Approved API key',
                headers: [
                    { name: 'X-API-Key', type: 'string', required: true, description: 'Your issued FoodBot client API key.' }
                ],
                responseExample: `{
  "success": true,
  "data": {
    "id": "67d910d26d99f0d53cde43aa",
    "generatedAt": "2026-03-19T10:20:00Z",
    "items": [
      {
        "id": "d34f1a95-928f-42f0-bc9d-1f6921519136",
        "category": "Produce",
        "emoji": "leaf",
        "name": "Spinach",
        "quantity": "400g",
        "isChecked": false
      }
    ]
  },
  "meta": null,
  "errors": []
}`,
                samples: [
                    {
                        label: 'cURL',
                        language: 'bash',
                        code: `curl --request GET \\
  '${API_DOCS_BASE_URL}/shoppinglist/latest' \\
  --header 'X-API-Key: fb_live_your_key_here'`
                    }
                ]
            },
            {
                id: 'shopping-category',
                title: 'Update a full section',
                method: 'PUT',
                path: '/shoppinglist/categories/check-state',
                summary: 'Sets every item in a shopping list category to checked or unchecked.',
                description: 'Use this to drive section-level toggles in external grocery or shopping checklist experiences.',
                auth: 'Approved API key',
                headers: [
                    { name: 'X-API-Key', type: 'string', required: true, description: 'Your issued FoodBot client API key.' },
                    { name: 'Content-Type', type: 'string', required: true, description: 'Set to application/json.' }
                ],
                bodyFields: [
                    { name: 'category', type: 'string', required: true, description: 'The category name to update, such as Produce.' },
                    { name: 'isChecked', type: 'boolean', required: true, description: 'The target checked state for every item in the category.' }
                ],
                responseExample: `{
  "success": true,
  "data": {
    "category": "Produce",
    "isChecked": true,
    "updatedCount": 12
  },
  "meta": null,
  "errors": []
}`,
                samples: [
                    {
                        label: 'cURL',
                        language: 'bash',
                        code: `curl --request PUT '${API_DOCS_BASE_URL}/shoppinglist/categories/check-state' \\
  --header 'X-API-Key: fb_live_your_key_here' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "category": "Produce",
    "isChecked": true
  }'`
                    }
                ]
            }
        ]
    }
];
