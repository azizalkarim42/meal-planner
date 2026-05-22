module MealPlanner.App

open System
open Feliz
open MealPlanner.Types
open MealPlanner.Storage

/// Get Monday of the current week
let private currentWeekMonday () =
    let today = DateTime.Now
    let diff = (int today.DayOfWeek + 6) % 7
    today.AddDays(float -diff).Date

let init () =
    let recipes = loadRecipes ()
    let target = loadTarget ()
    let weekPlan =
        loadWeekPlan ()
        |> Option.defaultValue { WeekStart = currentWeekMonday (); Meals = [] }
    { Recipes = recipes; WeekPlan = weekPlan; NutritionTarget = target
      ActiveView = PlannerView; RecipeForm = RecipeFormState.Empty
      GroceryChecked = Map.empty; SearchQuery = ""
      FilterCategory = None; SelectedDay = 0; SelectedMealType = None }

let update (msg: Msg) (model: Model) : Model =
    match msg with
    | SetView view ->
        let form =
            match view with
            | RecipeEditorView (Some id) ->
                match model.Recipes |> List.tryFind (fun r -> r.Id = id) with
                | Some r ->
                    { Name = r.Name; Description = r.Description; Category = r.Category
                      SuitableFor = r.SuitableFor; Servings = string r.Servings
                      PrepTime = string r.PrepTimeMinutes; CookTime = string r.CookTimeMinutes
                      Ingredients = r.Ingredients; NewIngName = ""; NewIngAmount = ""
                      NewIngUnit = Grams; NewIngCategory = "Produce"
                      Instructions = r.Instructions; NewInstruction = ""
                      Calories = string (int r.Nutrition.Calories)
                      Protein = string (int r.Nutrition.Protein)
                      Carbs = string (int r.Nutrition.Carbs)
                      Fat = string (int r.Nutrition.Fat)
                      ImageEmoji = r.ImageEmoji }
                | None -> RecipeFormState.Empty
            | RecipeEditorView None -> RecipeFormState.Empty
            | _ -> model.RecipeForm
        { model with ActiveView = view; RecipeForm = form }

    // Planner
    | AddMealToPlan (recipeId, day, mealType) ->
        let meal =
            { Id = Guid.NewGuid(); RecipeId = recipeId; DayOfWeek = day
              MealType = mealType; Servings = 1 }
        let newPlan = { model.WeekPlan with Meals = model.WeekPlan.Meals @ [ meal ] }
        saveWeekPlan newPlan
        { model with WeekPlan = newPlan; SelectedMealType = None }

    | RemoveMealFromPlan id ->
        let newPlan = { model.WeekPlan with Meals = model.WeekPlan.Meals |> List.filter (fun m -> m.Id <> id) }
        saveWeekPlan newPlan
        { model with WeekPlan = newPlan }

    | SetSelectedDay d -> { model with SelectedDay = d }
    | SelectMealSlot (day, mealType) -> { model with SelectedDay = day; SelectedMealType = Some mealType }
    | CancelMealSelect -> { model with SelectedMealType = None }

    | NextWeek ->
        let newStart = model.WeekPlan.WeekStart.AddDays(7.0)
        let newPlan = { WeekStart = newStart; Meals = [] }
        saveWeekPlan newPlan
        { model with WeekPlan = newPlan }

    | PrevWeek ->
        let newStart = model.WeekPlan.WeekStart.AddDays(-7.0)
        let newPlan = { WeekStart = newStart; Meals = [] }
        saveWeekPlan newPlan
        { model with WeekPlan = newPlan }

    // Recipe form
    | SetRecipeName v -> { model with RecipeForm = { model.RecipeForm with Name = v } }
    | SetRecipeDesc v -> { model with RecipeForm = { model.RecipeForm with Description = v } }
    | SetRecipeCategory c -> { model with RecipeForm = { model.RecipeForm with Category = c } }
    | ToggleSuitableFor mt ->
        let sf =
            if model.RecipeForm.SuitableFor |> List.contains mt then
                model.RecipeForm.SuitableFor |> List.filter (fun m -> m <> mt)
            else mt :: model.RecipeForm.SuitableFor
        { model with RecipeForm = { model.RecipeForm with SuitableFor = sf } }
    | SetServings v -> { model with RecipeForm = { model.RecipeForm with Servings = v } }
    | SetPrepTime v -> { model with RecipeForm = { model.RecipeForm with PrepTime = v } }
    | SetCookTime v -> { model with RecipeForm = { model.RecipeForm with CookTime = v } }
    | SetNewIngName v -> { model with RecipeForm = { model.RecipeForm with NewIngName = v } }
    | SetNewIngAmount v -> { model with RecipeForm = { model.RecipeForm with NewIngAmount = v } }
    | SetNewIngUnit u -> { model with RecipeForm = { model.RecipeForm with NewIngUnit = u } }
    | SetNewIngCategory c -> { model with RecipeForm = { model.RecipeForm with NewIngCategory = c } }
    | AddIngredient ->
        let name = model.RecipeForm.NewIngName.Trim()
        if name = "" then model
        else
            let amount = match Double.TryParse model.RecipeForm.NewIngAmount with true, v -> v | _ -> 1.0
            let ing = { Id = Guid.NewGuid(); Name = name; Amount = amount; Unit = model.RecipeForm.NewIngUnit; GroceryCategory = model.RecipeForm.NewIngCategory }
            { model with RecipeForm = { model.RecipeForm with Ingredients = model.RecipeForm.Ingredients @ [ing]; NewIngName = ""; NewIngAmount = "" } }
    | RemoveIngredient id ->
        { model with RecipeForm = { model.RecipeForm with Ingredients = model.RecipeForm.Ingredients |> List.filter (fun i -> i.Id <> id) } }
    | SetNewInstruction v -> { model with RecipeForm = { model.RecipeForm with NewInstruction = v } }
    | AddInstruction ->
        let inst = model.RecipeForm.NewInstruction.Trim()
        if inst = "" then model
        else { model with RecipeForm = { model.RecipeForm with Instructions = model.RecipeForm.Instructions @ [inst]; NewInstruction = "" } }
    | RemoveInstruction idx ->
        { model with RecipeForm = { model.RecipeForm with Instructions = model.RecipeForm.Instructions |> List.indexed |> List.filter (fun (i, _) -> i <> idx) |> List.map snd } }
    | SetCalories v -> { model with RecipeForm = { model.RecipeForm with Calories = v } }
    | SetProtein v -> { model with RecipeForm = { model.RecipeForm with Protein = v } }
    | SetCarbs v -> { model with RecipeForm = { model.RecipeForm with Carbs = v } }
    | SetFat v -> { model with RecipeForm = { model.RecipeForm with Fat = v } }
    | SetImageEmoji v -> { model with RecipeForm = { model.RecipeForm with ImageEmoji = v } }

    | SaveRecipe ->
        let f = model.RecipeForm
        if f.Name.Trim() = "" then model
        else
            let nutrition : Nutrition =
                { Calories = match Double.TryParse f.Calories with true, v -> v | _ -> 0.0
                  Protein = match Double.TryParse f.Protein with true, v -> v | _ -> 0.0
                  Carbs = match Double.TryParse f.Carbs with true, v -> v | _ -> 0.0
                  Fat = match Double.TryParse f.Fat with true, v -> v | _ -> 0.0 }
            let servings = match Int32.TryParse f.Servings with true, v -> max 1 v | _ -> 2
            let prep = match Int32.TryParse f.PrepTime with true, v -> v | _ -> 0
            let cook = match Int32.TryParse f.CookTime with true, v -> v | _ -> 0

            match model.ActiveView with
            | RecipeEditorView (Some id) ->
                let newRecipes = model.Recipes |> List.map (fun r ->
                    if r.Id = id then
                        { r with Name = f.Name.Trim(); Description = f.Description.Trim()
                                 Category = f.Category; SuitableFor = f.SuitableFor
                                 Servings = servings; PrepTimeMinutes = prep; CookTimeMinutes = cook
                                 Ingredients = f.Ingredients; Instructions = f.Instructions
                                 Nutrition = nutrition; ImageEmoji = f.ImageEmoji }
                    else r)
                saveRecipes newRecipes
                { model with Recipes = newRecipes; RecipeForm = RecipeFormState.Empty; ActiveView = RecipeListView }
            | _ ->
                let recipe =
                    { Id = Guid.NewGuid(); Name = f.Name.Trim(); Description = f.Description.Trim()
                      Category = f.Category; SuitableFor = f.SuitableFor
                      Servings = servings; PrepTimeMinutes = prep; CookTimeMinutes = cook
                      Ingredients = f.Ingredients; Instructions = f.Instructions
                      Nutrition = nutrition; ImageEmoji = f.ImageEmoji
                      IsFavorite = false; CreatedAt = DateTime.Now }
                let newRecipes = model.Recipes @ [ recipe ]
                saveRecipes newRecipes
                { model with Recipes = newRecipes; RecipeForm = RecipeFormState.Empty; ActiveView = RecipeListView }

    | CancelRecipeEdit ->
        { model with RecipeForm = RecipeFormState.Empty; ActiveView = RecipeListView }

    | ToggleFavorite id ->
        let newRecipes = model.Recipes |> List.map (fun r -> if r.Id = id then { r with IsFavorite = not r.IsFavorite } else r)
        saveRecipes newRecipes
        { model with Recipes = newRecipes }

    | DeleteRecipe id ->
        let newRecipes = model.Recipes |> List.filter (fun r -> r.Id <> id)
        saveRecipes newRecipes
        { model with Recipes = newRecipes; ActiveView = RecipeListView }

    | SetSearchQuery q -> { model with SearchQuery = q }
    | SetFilterCategory c -> { model with FilterCategory = c }

    | ToggleGroceryItem name ->
        let current = model.GroceryChecked |> Map.tryFind name |> Option.defaultValue false
        { model with GroceryChecked = model.GroceryChecked |> Map.add name (not current) }

    | ClearCheckedItems -> { model with GroceryChecked = Map.empty }

    | SetTargetCalories v ->
        let t = { model.NutritionTarget with Calories = match Double.TryParse v with true, x -> x | _ -> model.NutritionTarget.Calories }
        saveTarget t; { model with NutritionTarget = t }
    | SetTargetProtein v ->
        let t = { model.NutritionTarget with Protein = match Double.TryParse v with true, x -> x | _ -> model.NutritionTarget.Protein }
        saveTarget t; { model with NutritionTarget = t }
    | SetTargetCarbs v ->
        let t = { model.NutritionTarget with Carbs = match Double.TryParse v with true, x -> x | _ -> model.NutritionTarget.Carbs }
        saveTarget t; { model with NutritionTarget = t }
    | SetTargetFat v ->
        let t = { model.NutritionTarget with Fat = match Double.TryParse v with true, x -> x | _ -> model.NutritionTarget.Fat }
        saveTarget t; { model with NutritionTarget = t }

let private navbar (activeView: ActiveView) (dispatch: Msg -> unit) =
    Html.nav [
        prop.className "navbar"
        prop.children [
            let tab view (icon: string) (label: string) =
                Html.button [
                    prop.className (if activeView = view then "nav-tab active" else "nav-tab")
                    prop.onClick (fun _ -> dispatch (SetView view))
                    prop.children [
                        Html.span [ prop.className "nav-icon"; prop.text icon ]
                        Html.span [ prop.className "nav-label"; prop.text label ]
                    ]
                ]
            tab PlannerView "\U0001F4C5" "Planner"
            tab RecipeListView "\U0001F4D6" "Recipes"
            tab GroceryListView "\U0001F6D2" "Grocery"
            tab StatsView "\U0001F4CA" "Nutrition"
        ]
    ]

let view (model: Model) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "app-container"
        prop.children [
            Html.header [
                prop.className "app-header"
                prop.children [
                    Html.h1 [ prop.text "MealPlanner" ]
                    Html.span [ prop.className "app-subtitle"; prop.text "Weekly Meal Planning" ]
                ]
            ]
            Html.main [
                prop.className "app-main"
                prop.children [
                    Html.div [
                        prop.key (string model.ActiveView)
                        prop.className "fade-in"
                        prop.children [
                            match model.ActiveView with
                            | PlannerView -> WeekPlanner.view model dispatch
                            | RecipeListView -> RecipeLibrary.view model dispatch
                            | RecipeDetailView id -> RecipeLibrary.detailView id model dispatch
                            | RecipeEditorView id -> RecipeEditor.view id model dispatch
                            | GroceryListView -> GroceryList.view model dispatch
                            | StatsView -> Stats.view model dispatch
                        ]
                    ]
                ]
            ]
            navbar model.ActiveView dispatch
        ]
    ]
