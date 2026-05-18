module MealPlanner.NutritionCalc

open System
open MealPlanner.Types

/// Calculate nutrition for a planned meal (adjusting for servings)
let mealNutrition (recipes: Recipe list) (meal: PlannedMeal) : Nutrition =
    match recipes |> List.tryFind (fun r -> r.Id = meal.RecipeId) with
    | Some recipe ->
        let factor = float meal.Servings / float (max 1 recipe.Servings)
        { Calories = recipe.Nutrition.Calories * factor
          Protein = recipe.Nutrition.Protein * factor
          Carbs = recipe.Nutrition.Carbs * factor
          Fat = recipe.Nutrition.Fat * factor }
    | None -> Nutrition.Zero

/// Calculate total nutrition for a day
let dailyNutrition (recipes: Recipe list) (meals: PlannedMeal list) (dayOfWeek: int) : Nutrition =
    meals
    |> List.filter (fun m -> m.DayOfWeek = dayOfWeek)
    |> List.map (mealNutrition recipes)
    |> List.fold (+) Nutrition.Zero

/// Calculate total nutrition for the week
let weeklyNutrition (recipes: Recipe list) (meals: PlannedMeal list) : Nutrition =
    meals
    |> List.map (mealNutrition recipes)
    |> List.fold (+) Nutrition.Zero

/// Calculate percentage of target met
let targetPercentage (actual: float) (target: float) =
    if target <= 0.0 then 0.0
    else min 100.0 (actual / target * 100.0)

/// Get a color based on how close to target (green = on target, red = over, yellow = under)
let targetColor (actual: float) (target: float) =
    let pct = actual / (max 1.0 target) * 100.0
    if pct > 120.0 then "#ef4444"       // Over by 20%+
    elif pct > 90.0 then "#22c55e"      // On target (90-120%)
    elif pct > 60.0 then "#f59e0b"      // Getting there
    else "#94a3b8"                       // Under

/// Format a nutrition value for display
let formatValue (value: float) (unit: string) =
    if value >= 1000.0 then sprintf "%.0f%s" value unit
    elif value >= 100.0 then sprintf "%.0f%s" value unit
    elif value >= 10.0 then sprintf "%.1f%s" value unit
    else sprintf "%.1f%s" value unit

/// Macro percentages for pie-chart-like display
let macroPercentages (n: Nutrition) =
    let proteinCal = n.Protein * 4.0
    let carbsCal = n.Carbs * 4.0
    let fatCal = n.Fat * 9.0
    let total = proteinCal + carbsCal + fatCal
    if total = 0.0 then (0.0, 0.0, 0.0)
    else
        (proteinCal / total * 100.0,
         carbsCal / total * 100.0,
         fatCal / total * 100.0)
