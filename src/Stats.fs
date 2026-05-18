module MealPlanner.Stats

open System
open Feliz
open MealPlanner.Types
open MealPlanner.NutritionCalc

/// Nutrition progress ring (circular)
let private nutritionRing (label: string) (value: float) (target: float) (unit: string) (color: string) =
    let pct = targetPercentage value target
    let radius = 36.0
    let stroke = 5.0
    let circumference = 2.0 * Math.PI * radius
    let offset = circumference * (1.0 - pct / 100.0)
    let size = (radius + stroke) * 2.0
    let center = radius + stroke

    Html.div [
        prop.className "nut-ring"
        prop.children [
            Svg.svg [
                svg.width (int size); svg.height (int size)
                svg.viewBox (0, 0, int size, int size)
                svg.children [
                    Svg.circle [
                        svg.cx center; svg.cy center; svg.r radius
                        svg.fill "none"; svg.stroke "rgba(255,255,255,0.06)"; svg.strokeWidth stroke
                    ]
                    Svg.circle [
                        svg.cx center; svg.cy center; svg.r radius
                        svg.fill "none"; svg.stroke color; svg.strokeWidth stroke
                        svg.strokeLineCap "round"
                        svg.custom("strokeDasharray", sprintf "%g %g" circumference circumference)
                        svg.strokeDashoffset offset
                        svg.custom("transform", sprintf "rotate(-90 %g %g)" center center)
                    ]
                    Svg.text [
                        svg.x center; svg.y (center - 4.0)
                        svg.fill "white"; svg.fontSize 13; svg.custom("fontWeight", "bold")
                        svg.textAnchor.middle; svg.dominantBaseline.central
                        svg.children [ Html.text (sprintf "%.0f" value) ]
                    ]
                    Svg.text [
                        svg.x center; svg.y (center + 12.0)
                        svg.fill "rgba(255,255,255,0.5)"; svg.fontSize 9
                        svg.textAnchor.middle; svg.dominantBaseline.central
                        svg.children [ Html.text unit ]
                    ]
                ]
            ]
            Html.div [
                prop.className "nut-ring-label"
                prop.text label
            ]
        ]
    ]

/// Daily nutrition bars for the week
let private weeklyChart (recipes: Recipe list) (meals: PlannedMeal list) (target: NutritionTarget) =
    Html.div [
        prop.className "weekly-chart"
        prop.children [
            Html.h3 [ prop.text "Daily Calories" ]
            Html.div [
                prop.className "weekly-bars"
                prop.children [
                    for day in 0 .. 6 do
                        let dayNut = dailyNutrition recipes meals day
                        let pct = targetPercentage dayNut.Calories target.Calories
                        Html.div [
                            prop.className "weekly-bar-col"
                            prop.children [
                                Html.div [
                                    prop.className "weekly-bar-value"
                                    prop.text (if dayNut.Calories > 0.0 then sprintf "%.0f" dayNut.Calories else "")
                                ]
                                Html.div [
                                    prop.className "weekly-bar-track"
                                    prop.children [
                                        Html.div [
                                            prop.className "weekly-bar-fill"
                                            prop.style [
                                                style.height (length.percent (min pct 100.0))
                                                style.backgroundColor (targetColor dayNut.Calories target.Calories)
                                            ]
                                        ]
                                        // Target line
                                        Html.div [
                                            prop.className "target-line"
                                        ]
                                    ]
                                ]
                                Html.span [ prop.className "weekly-bar-label"; prop.text Days.shortLabels.[day] ]
                            ]
                        ]
                ]
            ]
        ]
    ]

/// Macro distribution bar
let private macroBar (nutrition: Nutrition) =
    let (protPct, carbPct, fatPct) = macroPercentages nutrition

    Html.div [
        prop.className "macro-section"
        prop.children [
            Html.h3 [ prop.text "Macro Distribution" ]
            Html.div [
                prop.className "macro-bar"
                prop.children [
                    if protPct > 0.0 then
                        Html.div [ prop.className "macro-seg protein"; prop.style [ style.width (length.percent protPct) ] ]
                    if carbPct > 0.0 then
                        Html.div [ prop.className "macro-seg carbs"; prop.style [ style.width (length.percent carbPct) ] ]
                    if fatPct > 0.0 then
                        Html.div [ prop.className "macro-seg fat"; prop.style [ style.width (length.percent fatPct) ] ]
                ]
            ]
            Html.div [
                prop.className "macro-legend"
                prop.children [
                    Html.span [ prop.className "macro-legend-item"; prop.children [ Html.span [ prop.className "macro-dot protein" ]; Html.text (sprintf "Protein %.0f%%" protPct) ] ]
                    Html.span [ prop.className "macro-legend-item"; prop.children [ Html.span [ prop.className "macro-dot carbs" ]; Html.text (sprintf "Carbs %.0f%%" carbPct) ] ]
                    Html.span [ prop.className "macro-legend-item"; prop.children [ Html.span [ prop.className "macro-dot fat" ]; Html.text (sprintf "Fat %.0f%%" fatPct) ] ]
                ]
            ]
        ]
    ]

/// Nutrition target settings
let private targetSettings (target: NutritionTarget) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "target-settings"
        prop.children [
            Html.h3 [ prop.text "Daily Targets" ]
            Html.div [
                prop.className "target-grid"
                prop.children [
                    Html.div [ prop.className "target-field"; prop.children [
                        Html.label [ prop.text "Calories" ]
                        Html.input [ prop.className "text-input small-input"; prop.type'.number; prop.value (string (int target.Calories)); prop.onChange (fun (v: string) -> dispatch (SetTargetCalories v)) ]
                    ]]
                    Html.div [ prop.className "target-field"; prop.children [
                        Html.label [ prop.text "Protein (g)" ]
                        Html.input [ prop.className "text-input small-input"; prop.type'.number; prop.value (string (int target.Protein)); prop.onChange (fun (v: string) -> dispatch (SetTargetProtein v)) ]
                    ]]
                    Html.div [ prop.className "target-field"; prop.children [
                        Html.label [ prop.text "Carbs (g)" ]
                        Html.input [ prop.className "text-input small-input"; prop.type'.number; prop.value (string (int target.Carbs)); prop.onChange (fun (v: string) -> dispatch (SetTargetCarbs v)) ]
                    ]]
                    Html.div [ prop.className "target-field"; prop.children [
                        Html.label [ prop.text "Fat (g)" ]
                        Html.input [ prop.className "text-input small-input"; prop.type'.number; prop.value (string (int target.Fat)); prop.onChange (fun (v: string) -> dispatch (SetTargetFat v)) ]
                    ]]
                ]
            ]
        ]
    ]

/// Main stats view
let view (model: Model) (dispatch: Msg -> unit) =
    let weekNut = weeklyNutrition model.Recipes model.WeekPlan.Meals
    let avgDaily =
        let daysWithMeals =
            [ 0..6 ]
            |> List.filter (fun d ->
                model.WeekPlan.Meals |> List.exists (fun m -> m.DayOfWeek = d))
            |> List.length
        if daysWithMeals = 0 then Nutrition.Zero
        else
            { Calories = weekNut.Calories / float daysWithMeals
              Protein = weekNut.Protein / float daysWithMeals
              Carbs = weekNut.Carbs / float daysWithMeals
              Fat = weekNut.Fat / float daysWithMeals }

    Html.div [
        prop.className "stats-page"
        prop.children [
            Html.h2 [ prop.text "Nutrition Overview" ]

            // Average daily rings
            Html.div [
                prop.className "nut-rings"
                prop.children [
                    nutritionRing "Calories" avgDaily.Calories model.NutritionTarget.Calories "kcal" "#ef4444"
                    nutritionRing "Protein" avgDaily.Protein model.NutritionTarget.Protein "g" "#3b82f6"
                    nutritionRing "Carbs" avgDaily.Carbs model.NutritionTarget.Carbs "g" "#f59e0b"
                    nutritionRing "Fat" avgDaily.Fat model.NutritionTarget.Fat "g" "#22c55e"
                ]
            ]

            Html.p [ prop.className "stats-subtitle"; prop.text "Daily average for this week" ]

            // Weekly calorie chart
            weeklyChart model.Recipes model.WeekPlan.Meals model.NutritionTarget

            // Macro distribution
            if weekNut.Calories > 0.0 then
                macroBar avgDaily

            // Targets
            targetSettings model.NutritionTarget dispatch

            // Week summary
            Html.div [
                prop.className "week-summary"
                prop.children [
                    Html.h3 [ prop.text "Week Total" ]
                    Html.div [
                        prop.className "summary-grid"
                        prop.children [
                            Html.div [ prop.className "summary-item"; prop.children [ Html.span [ prop.className "summary-val"; prop.text (sprintf "%.0f" weekNut.Calories) ]; Html.span [ prop.className "summary-label"; prop.text "Total kcal" ] ] ]
                            Html.div [ prop.className "summary-item"; prop.children [ Html.span [ prop.className "summary-val"; prop.text (string (List.length model.WeekPlan.Meals)) ]; Html.span [ prop.className "summary-label"; prop.text "Meals planned" ] ] ]
                            Html.div [ prop.className "summary-item"; prop.children [ Html.span [ prop.className "summary-val"; prop.text (string (List.length model.Recipes)) ]; Html.span [ prop.className "summary-label"; prop.text "Recipes" ] ] ]
                        ]
                    ]
                ]
            ]
        ]
    ]
