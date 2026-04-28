# Task: Implement Pricing and Editing for Data Packages

The goal is to allow admins to set and update prices for data packages. While basic pricing exists in the type definition, the UI needs to be enhanced to support full CRUD operations, specifically editing existing packages and setting all relevant fields (including duration).

## 1. Update Types (Verification)
- `src/lib/types.ts` already has the `price` field. No changes needed unless the user wants a different currency or structure.

## 2. Enhance Package Management UI
- **Modify `src/components/Admin/PackageList.tsx`**:
    - Add "Duration (Hours)" input to the "New Package" form.
    - Implement state for editing an existing package.
    - Add an "Edit Package" modal or inline form.
    - Connect the "Edit" button to the update logic.
    - Connect the "Save" button in edit mode to `updatePackage` from `NetworkContext`.

## 3. Update Network Context (Verification)
- `src/context/NetworkContext.tsx` already has `updatePackage` and `addPackage` which handle `price`.
- Ensure `INITIAL_PACKAGES` and session logic correctly use the pricing data.

## 4. UI/UX Improvements
- Use `lucide-react` icons for better visual feedback.
- Use `sonner` for notifications (already being used in context, but ensure UI feedback is clear).
- Maintain the dark dashboard theme.
