(* MealPlanner.NutritionCalc
   ==========================
   Pure nutrition calculation functions; no side-effects or UI dependencies.

   All functions take an immutable Recipe list and derive results from it so
   they can be called freely in the Elmish update loop or view layer.

   mealNutrition      – scales a Recipe's per-serving nutrition by the number
                        of servings in a PlannedMeal.
   dailyNutrition     – folds mealNutrition over all meals on a given day
                        (0 = Monday … 6 = Sunday).
   weeklyNutrition    – folds mealNutrition over the entire week plan.
   targetPercentage   – what fraction (0–100) of a daily target has been met;
                        capped at 100 so the UI progress bar never overflows.
   targetColor        – semantic colour for a progress indicator:
                        green ≥ 90 %, amber ≥ 60 %, red > 120 %, grey otherwise.
   formatValue        – locale-neutral numeric string for display in the Stats
                        view (avoids trailing zeros for large values).
   macroPercentages   – converts gram amounts to calorie-based percentages
                        (protein 4 kcal/g, carbs 4 kcal/g, fat 9 kcal/g) for
                        the macro-split visualisation.
*)
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
