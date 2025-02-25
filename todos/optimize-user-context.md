# User Context Optimization Tasks

## Problem: Multiple `/api/users/me` API Calls

When loading the `/companies` page, we're making 5 redundant calls to `/api/users/me` - one for each company card displayed. This happens because the `useUserRole` hook makes a separate API call for each company to check if the user is an admin.

## Optimization Tasks

### Option 1: Create a User Context Provider
- [ ] Create a `UserContext.tsx` file in the context directory
- [ ] Implement a context provider that fetches user data once
- [ ] Add user role checking functions to the context
- [ ] Update the `useUserRole` hook to use the context instead of making API calls
- [ ] Wrap the application with the UserContext provider in App.tsx

### Option 2: Modify `useUserRole` Hook
- [ ] Refactor the hook to accept a user data object parameter
- [ ] Create a parent hook that fetches user data once
- [ ] Update the CompanyList component to fetch user data once and pass it to each CompanyCard

### Option 3: Implement Request Deduplication
- [ ] Install a data fetching library (SWR or React Query)
- [ ] Refactor the user data fetching to use the library
- [ ] Configure request deduplication settings
- [ ] Update components to use the new data fetching approach

### Option 4: Batch Company Role Checking
- [ ] Create a new API endpoint that accepts multiple company IDs
- [ ] Update the backend to return admin status for all companies in a single request
- [ ] Modify the frontend to use this new endpoint
- [ ] Update the CompanyList component to make a single API call with all company IDs

## Implementation Notes

- The main issue is in `CompanyList.tsx` where each CompanyCard independently calls `useUserRole(company.id)`
- The `useUserRole` hook is defined in `src/hooks/useUserRole.ts` and makes a direct API call to `getCurrentUser` 
- There's currently no caching mechanism for user data across components 