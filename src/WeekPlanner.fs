module MealPlanner.WeekPlanner

open System
open Feliz
open MealPlanner.Types
open MealPlanner.NutritionCalc

/// Format the week range for display
let private weekLabel (start: DateTime) =
    let endDate = start.AddDays(6.0)
    sprintf "%s %d - %s %d" (start.ToString("MMM")) start.Day (endDate.ToString("MMM")) endDate.Day

/// Render a meal slot in the planner grid
let private mealSlot (recipes: Recipe list) (meals: PlannedMeal list) (day: int) (mealType: MealType) (dispatch: Msg -> unit) =
    let slotMeals = meals |> List.filter (fun m -> m.DayOfWeek = day && m.MealType = mealType)

    Html.div [
        prop.className "meal-slot"
        prop.children [
            if slotMeals.IsEmpty then
                Html.div [
                    prop.className "meal-slot-empty"
                    prop.onClick (fun _ -> dispatch (SelectMealSlot (day, mealType)))
                    prop.children [
                        Html.span [ prop.className "slot-plus"; prop.text "+" ]
                    ]
                ]
            else
                for meal in slotMeals do
                    let recipe = recipes |> List.tryFind (fun r -> r.Id = meal.RecipeId)
                    match recipe with
                    | Some r ->
                        Html.div [
                            prop.className "meal-slot-filled"
                            prop.children [
                                Html.span [ prop.className "meal-emoji"; prop.text r.ImageEmoji ]
                                Html.span [ prop.className "meal-name"; prop.text r.Name ]
                                Html.button [
                                    prop.className "meal-remove"
                                    prop.text "\u00D7"
                                    prop.onClick (fun e ->
                                        e.stopPropagation ()
                                        dispatch (RemoveMealFromPlan meal.Id))
                                ]
                            ]
                        ]
                    | None -> ()
        ]
    ]

/// Nutrition summary bar for a day
let private dayNutritionBar (nutrition: Nutrition) (target: NutritionTarget) =
    let calPct = targetPercentage nutrition.Calories target.Calories
    Html.div [
        prop.className "day-nutrition"
        prop.children [
            Html.div [
                prop.className "day-cal-bar-track"
                prop.children [
                    Html.div [
                        prop.className "day-cal-bar-fill"
                        prop.style [
                            style.width (length.percent (min calPct 100.0))
                            style.backgroundColor (targetColor nutrition.Calories target.Calories)
                        ]
                    ]
                ]
            ]
            Html.span [
                prop.className "day-cal-text"
                prop.text (sprintf "%.0f / %.0f kcal" nutrition.Calories target.Calories)
            ]
        ]
    ]

/// Recipe picker overlay for adding meals
let private recipePicker (recipes: Recipe list) (day: int) (mealType: MealType) (dispatch: Msg -> unit) =
    let suitableRecipes =
        recipes |> List.filter (fun r -> r.SuitableFor |> List.contains mealType)
    let otherRecipes =
        recipes |> List.filter (fun r -> not (r.SuitableFor |> List.contains mealType))

    Html.div [
        prop.className "picker-overlay"
        prop.onClick (fun _ -> dispatch CancelMealSelect)
        prop.children [
            Html.div [
                prop.className "picker-modal"
                prop.onClick (fun e -> e.stopPropagation ())
                prop.children [
                    Html.h3 [ prop.text (sprintf "Add %s for %s" mealType.Label Days.labels.[day]) ]

                    if recipes.IsEmpty then
                        Html.p [ prop.className "empty-hint"; prop.text "No recipes yet. Create one first!" ]
                    else
                        if not suitableRecipes.IsEmpty then
                            Html.h4 [ prop.className "picker-section-label"; prop.text "Recommended" ]
                            Html.div [
                                prop.className "picker-list"
                                prop.children [
                                    for r in suitableRecipes do
                                        Html.div [
                                            prop.className "picker-item"
                                            prop.onClick (fun _ -> dispatch (AddMealToPlan (r.Id, day, mealType)))
                                            prop.children [
                                                Html.span [ prop.className "picker-emoji"; prop.text r.ImageEmoji ]
                                                Html.div [
                                                    prop.className "picker-info"
                                                    prop.children [
                                                        Html.span [ prop.className "picker-name"; prop.text r.Name ]
                                                        Html.span [ prop.className "picker-meta"; prop.text (sprintf "%.0f kcal \u2022 %d min" r.Nutrition.Calories (r.PrepTimeMinutes + r.CookTimeMinutes)) ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                ]
                            ]
                        if not otherRecipes.IsEmpty then
                            Html.h4 [ prop.className "picker-section-label"; prop.text "Other Recipes" ]
                            Html.div [
                                prop.className "picker-list"
                                prop.children [
                                    for r in otherRecipes do
                                        Html.div [
                                            prop.className "picker-item"
                                            prop.onClick (fun _ -> dispatch (AddMealToPlan (r.Id, day, mealType)))
                                            prop.children [
                                                Html.span [ prop.className "picker-emoji"; prop.text r.ImageEmoji ]
                                                Html.div [
                                                    prop.className "picker-info"
                                                    prop.children [
                                                        Html.span [ prop.className "picker-name"; prop.text r.Name ]
                                                        Html.span [ prop.className "picker-meta"; prop.text (sprintf "%.0f kcal" r.Nutrition.Calories) ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                ]
                            ]

                    Html.button [
                        prop.className "btn btn-secondary"
                        prop.text "Cancel"
                        prop.onClick (fun _ -> dispatch CancelMealSelect)
                    ]
                ]
            ]
        ]
    ]

/// Main week planner view
let view (model: Model) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "planner-page"
        prop.children [
            // Week navigation
            Html.div [
                prop.className "week-nav"
                prop.children [
                    Html.button [
                        prop.className "btn btn-secondary btn-small"
                        prop.text "\u2190"
                        prop.onClick (fun _ -> dispatch PrevWeek)
                    ]
                    Html.h2 [ prop.className "week-title"; prop.text (weekLabel model.WeekPlan.WeekStart) ]
                    Html.button [
                        prop.className "btn btn-secondary btn-small"
                        prop.text "\u2192"
                        prop.onClick (fun _ -> dispatch NextWeek)
                    ]
                ]
            ]

            // Day columns
            Html.div [
                prop.className "planner-grid"
                prop.children [
                    for day in 0 .. 6 do
                        let dayNut = dailyNutrition model.Recipes model.WeekPlan.Meals day
                        Html.div [
                            prop.className (if day = model.SelectedDay then "day-column selected" else "day-column")
                            prop.children [
                                Html.div [
                                    prop.className "day-header"
                                    prop.text Days.shortLabels.[day]
                                ]
                                dayNutritionBar dayNut model.NutritionTarget
                                for mt in MealTypes.all do
                                    Html.div [
                                        prop.className "meal-type-label"
                                        prop.text (sprintf "%s" mt.Icon)
                                    ]
                                    mealSlot model.Recipes model.WeekPlan.Meals day mt dispatch
                            ]
                        ]
                ]
            ]

            // Recipe picker modal
            match model.SelectedMealType with
            | Some mealType ->
                recipePicker model.Recipes model.SelectedDay mealType dispatch
            | None -> ()
        ]
    ]
