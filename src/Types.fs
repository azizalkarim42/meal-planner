(* MealPlanner.Types
   ==================
   Core domain model for the meal-planning application.

   Key types and their relationships:

   MealType      – time-of-day slot (Breakfast | Lunch | Dinner | Snack).
   FoodCategory  – dietary / cuisine category attached to a Recipe.
   MeasureUnit   – unit of measurement for Ingredient amounts (g, ml, cup, …).
   Ingredient    – a single line item in a Recipe, with amount, unit, and
                   grocery-aisle category for list generation.
   Nutrition     – macro snapshot (calories, protein, carbs, fat) per serving;
                   supports (+) so daily/weekly totals can be folded in one pass.
   Recipe        – the central aggregate: ingredients, instructions, nutrition,
                   suitable meal slots, and display metadata (emoji, favourite).
   PlannedMeal   – a Recipe placed in the weekly grid (day 0–6 × MealType).
   WeekPlan      – the full week: a Monday anchor date + list of PlannedMeals.
   GroceryItem   – ingredient line aggregated across the week plan for shopping.
   NutritionTarget – user-configured daily macro goals; defaults to a 2000 kcal
                     balanced diet.
   Model         – root Elmish model holding all application state.
   Msg           – discriminated union of every state-transition message.
*)
module MealPlanner.Types

open System

/// Meal type (time of day)
type MealType =
    | Breakfast
    | Lunch
    | Dinner
    | Snack

    member this.Label =
        match this with
        | Breakfast -> "Breakfast"
        | Lunch -> "Lunch"
        | Dinner -> "Dinner"
        | Snack -> "Snack"

    member this.Icon =
        match this with
        | Breakfast -> "\U0001F95E"
        | Lunch -> "\U0001F96A"
        | Dinner -> "\U0001F372"
        | Snack -> "\U0001F34E"

    member this.Code =
        match this with
        | Breakfast -> "breakfast"
        | Lunch -> "lunch"
        | Dinner -> "dinner"
        | Snack -> "snack"

module MealTypes =
    let all = [ Breakfast; Lunch; Dinner; Snack ]

    let fromCode (code: string) =
        all |> List.tryFind (fun m -> m.Code = code) |> Option.defaultValue Lunch

/// Food category for recipes
type FoodCategory =
    | Vegetarian
    | Vegan
    | Meat
    | Fish
    | Pasta
    | Salad
    | Soup
    | Dessert
    | Quick
    | Other

    member this.Label =
        match this with
        | Vegetarian -> "Vegetarian"
        | Vegan -> "Vegan"
        | Meat -> "Meat"
        | Fish -> "Fish"
        | Pasta -> "Pasta"
        | Salad -> "Salad"
        | Soup -> "Soup"
        | Dessert -> "Dessert"
        | Quick -> "Quick & Easy"
        | Other -> "Other"

    member this.Icon =
        match this with
        | Vegetarian -> "\U0001F966"
        | Vegan -> "\U0001F331"
        | Meat -> "\U0001F356"
        | Fish -> "\U0001F41F"
        | Pasta -> "\U0001F35D"
        | Salad -> "\U0001F957"
        | Soup -> "\U0001F35C"
        | Dessert -> "\U0001F370"
        | Quick -> "\u26A1"
        | Other -> "\U0001F37D\uFE0F"

    member this.Code =
        match this with
        | Vegetarian -> "vegetarian" | Vegan -> "vegan" | Meat -> "meat"
        | Fish -> "fish" | Pasta -> "pasta" | Salad -> "salad"
        | Soup -> "soup" | Dessert -> "dessert" | Quick -> "quick" | Other -> "other"

module FoodCategories =
    let all = [ Vegetarian; Vegan; Meat; Fish; Pasta; Salad; Soup; Dessert; Quick; Other ]
    let fromCode c = all |> List.tryFind (fun f -> f.Code = c) |> Option.defaultValue Other

/// Unit of measurement for ingredients
type MeasureUnit =
    | Grams
    | Kilograms
    | Milliliters
    | Liters
    | Tablespoon
    | Teaspoon
    | Cup
    | Piece
    | Slice

    member this.Abbrev =
        match this with
        | Grams -> "g" | Kilograms -> "kg" | Milliliters -> "ml" | Liters -> "L"
        | Tablespoon -> "tbsp" | Teaspoon -> "tsp" | Cup -> "cup"
        | Piece -> "pc" | Slice -> "slice"

    member this.Code =
        match this with
        | Grams -> "g" | Kilograms -> "kg" | Milliliters -> "ml" | Liters -> "L"
        | Tablespoon -> "tbsp" | Teaspoon -> "tsp" | Cup -> "cup"
        | Piece -> "pc" | Slice -> "slice"

module MeasureUnits =
    let all = [ Grams; Kilograms; Milliliters; Liters; Tablespoon; Teaspoon; Cup; Piece; Slice ]
    let fromCode c = all |> List.tryFind (fun u -> u.Code = c) |> Option.defaultValue Piece

/// Nutrition information per serving
type Nutrition =
    { Calories: float
      Protein: float   // grams
      Carbs: float     // grams
      Fat: float }     // grams

    static member Zero =
        { Calories = 0.0; Protein = 0.0; Carbs = 0.0; Fat = 0.0 }

    static member (+) (a: Nutrition, b: Nutrition) =
        { Calories = a.Calories + b.Calories
          Protein = a.Protein + b.Protein
          Carbs = a.Carbs + b.Carbs
          Fat = a.Fat + b.Fat }

/// A single ingredient in a recipe
type Ingredient =
    { Id: Guid
      Name: string
      Amount: float
      Unit: MeasureUnit
      GroceryCategory: string }

/// A recipe
type Recipe =
    { Id: Guid
      Name: string
      Description: string
      Category: FoodCategory
      SuitableFor: MealType list
      Servings: int
      PrepTimeMinutes: int
      CookTimeMinutes: int
      Ingredients: Ingredient list
      Instructions: string list
      Nutrition: Nutrition
      ImageEmoji: string
      IsFavorite: bool
      CreatedAt: DateTime }

/// A planned meal in the weekly schedule
type PlannedMeal =
    { Id: Guid
      RecipeId: Guid
      DayOfWeek: int       // 0=Monday, 6=Sunday
      MealType: MealType
      Servings: int }

/// A week plan
type WeekPlan =
    { WeekStart: DateTime   // Monday of the week
      Meals: PlannedMeal list }

/// Grocery list item (aggregated from planned meals)
type GroceryItem =
    { Name: string
      Amount: float
      Unit: MeasureUnit
      Category: string
      IsChecked: bool }

/// Daily nutrition target
type NutritionTarget =
    { Calories: float
      Protein: float
      Carbs: float
      Fat: float }

    static member Default =
        { Calories = 2000.0; Protein = 50.0; Carbs = 250.0; Fat = 65.0 }

/// Active view
type ActiveView =
    | PlannerView
    | RecipeListView
    | RecipeDetailView of Guid
    | RecipeEditorView of Guid option
    | GroceryListView
    | StatsView

/// Recipe form state
type RecipeFormState =
    { Name: string
      Description: string
      Category: FoodCategory
      SuitableFor: MealType list
      Servings: string
      PrepTime: string
      CookTime: string
      Ingredients: Ingredient list
      NewIngName: string
      NewIngAmount: string
      NewIngUnit: MeasureUnit
      NewIngCategory: string
      Instructions: string list
      NewInstruction: string
      Calories: string
      Protein: string
      Carbs: string
      Fat: string
      ImageEmoji: string }

    static member Empty =
        { Name = ""; Description = ""; Category = Other
          SuitableFor = [ Lunch; Dinner ]; Servings = "2"
          PrepTime = "15"; CookTime = "30"
          Ingredients = []; NewIngName = ""; NewIngAmount = ""
          NewIngUnit = Grams; NewIngCategory = "Produce"
          Instructions = []; NewInstruction = ""
          Calories = ""; Protein = ""; Carbs = ""; Fat = ""
          ImageEmoji = "\U0001F37D\uFE0F" }

/// Root application model
type Model =
    { Recipes: Recipe list
      WeekPlan: WeekPlan
      NutritionTarget: NutritionTarget
      ActiveView: ActiveView
      RecipeForm: RecipeFormState
      GroceryChecked: Map<string, bool>
      SearchQuery: string
      FilterCategory: FoodCategory option
      SelectedDay: int
      SelectedMealType: MealType option }

/// All messages
type Msg =
    | SetView of ActiveView
    // Planner
    | AddMealToPlan of recipeId: Guid * dayOfWeek: int * mealType: MealType
    | RemoveMealFromPlan of Guid
    | SetSelectedDay of int
    | SelectMealSlot of int * MealType
    | CancelMealSelect
    | NextWeek
    | PrevWeek
    // Recipe form
    | SetRecipeName of string
    | SetRecipeDesc of string
    | SetRecipeCategory of FoodCategory
    | ToggleSuitableFor of MealType
    | SetServings of string
    | SetPrepTime of string
    | SetCookTime of string
    | SetNewIngName of string
    | SetNewIngAmount of string
    | SetNewIngUnit of MeasureUnit
    | SetNewIngCategory of string
    | AddIngredient
    | RemoveIngredient of Guid
    | SetNewInstruction of string
    | AddInstruction
    | RemoveInstruction of int
    | SetCalories of string
    | SetProtein of string
    | SetCarbs of string
    | SetFat of string
    | SetImageEmoji of string
    | SaveRecipe
    | CancelRecipeEdit
    // Recipe list
    | ToggleFavorite of Guid
    | DeleteRecipe of Guid
    | SetSearchQuery of string
    | SetFilterCategory of FoodCategory option
    // Grocery
    | ToggleGroceryItem of string
    | ClearCheckedItems
    // Nutrition targets
    | SetTargetCalories of string
    | SetTargetProtein of string
    | SetTargetCarbs of string
    | SetTargetFat of string

/// Emoji options for recipes
module RecipeEmojis =
    let all =
        [| "\U0001F37D\uFE0F"; "\U0001F95E"; "\U0001F96A"; "\U0001F372"; "\U0001F34E"
           "\U0001F966"; "\U0001F356"; "\U0001F35D"; "\U0001F957"; "\U0001F35C"
           "\U0001F370"; "\U0001F41F"; "\U0001F355"; "\U0001F32E"; "\U0001F959"
           "\U0001F363"; "\U0001F961"; "\U0001F950"; "\U0001F953"; "\U0001F95A" |]

/// Grocery categories for sorting
module GroceryCategories =
    let all = [ "Produce"; "Dairy"; "Meat & Fish"; "Bakery"; "Pantry"; "Frozen"; "Beverages"; "Spices"; "Other" ]

/// Day labels
module Days =
    let labels = [| "Monday"; "Tuesday"; "Wednesday"; "Thursday"; "Friday"; "Saturday"; "Sunday" |]
    let shortLabels = [| "Mon"; "Tue"; "Wed"; "Thu"; "Fri"; "Sat"; "Sun" |]
