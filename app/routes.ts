import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("discover", "routes/discover.tsx"),
  route("discover/:recipeId", "routes/discover.$recipeId.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("validate-magic-link", "routes/validate-magic-link.tsx"),
  route("recipe-image", "routes/recipe-image.tsx"),
  route("cookies", "routes/cookies.ts"),
  route("theme.css", "routes/theme[.]css.tsx"),
  route("app/recipes", "routes/app/recipes.tsx"),
  route("app/recipes/new", "routes/app/recipes/new.tsx"),
  route("app/recipes/:recipeId", "routes/app/recipes/$recipeId.simple.tsx"),
  route("app/recipes/:recipeId/edit", "routes/app/recipes/$recipeId.edit-simple.tsx"),
  route("app/grocery-list", "routes/app/grocery-list.tsx"),
  route("app/pantry", "routes/app/pantry.tsx"),
  route("settings", "routes/settings.tsx"),
  route("my-recipes", "routes/my-recipes.tsx"),
  route("add-recipe", "routes/add-recipe.tsx"),
  route("grocery-list", "routes/grocery-list.tsx"),
  route("home", "routes/home.tsx"),
] satisfies RouteConfig;
