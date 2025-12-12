# Development Guidelines

## Codebase Standards

### 1. Component Structure
We have recently refactored the application to use a **One Folder Per Component** structure. Do not create loose files in `src/components/`.

**Correct:**
```
src/components/my-feature/
  ├── my-feature.ts
  ├── my-feature.html
  └── my-feature.css
```

**Incorrect:**
```
src/components/
  ├── my-feature.ts  (DO NOT DO THIS)
```

### 2. Creating a New Component
1. Create a new folder in `src/components/`.
2. Creates the three files (`.ts`, `.html`, `.css`).
3. In the `.ts` file:
   - Use `templateUrl: './[name].html'`
   - Use `styleUrls: ['./[name].css']`
   - Add `standalone: true`
4. Register the component in `src/main.ts` routing configuration.

### 3. Styling
- Use **Tailwind CSS** utility classes for 90% of styling.
- Use the component's `.css` file only for:
  - Custom animations (e.g., `@keyframes`).
  - Complex selectors that are hard to express in Tailwind.
  - Specific overrides.

### 4. State Management
- For simple local state, use component properties.
- For shared state (User Auth), use `AuthService`.
- Avoid prop drilling; use Services for data sharing.

## Workflow
1. **Plan**: Define the feature in terms of components.
2. **Scaffold**: Create the file structure.
3. **Implement**: Write the logic and template.
4. **Register**: Add to `main.ts` routes.
5. **Test**: Verify locally.
