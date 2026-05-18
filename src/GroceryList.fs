module MealPlanner.GroceryList

open System
open Fable.Core.JsInterop
open Feliz
open MealPlanner.Types

/// Aggregate ingredients from all planned meals into a grocery list
let generateGroceryList (recipes: Recipe list) (meals: PlannedMeal list) : GroceryItem list =
    meals
    |> List.choose (fun meal ->
        recipes |> List.tryFind (fun r -> r.Id = meal.RecipeId)
        |> Option.map (fun r ->
            let factor = float meal.Servings / float (max 1 r.Servings)
            r.Ingredients |> List.map (fun ing ->
                (ing.Name.ToLower(), ing.Unit, ing.GroceryCategory, ing.Amount * factor))))
    |> List.concat
    |> List.groupBy (fun (name, unit, cat, _) -> (name, unit, cat))
    |> List.map (fun ((name, unit, cat), items) ->
        let totalAmount = items |> List.sumBy (fun (_, _, _, amt) -> amt)
        { Name = name.Substring(0, 1).ToUpper() + name.Substring(1)
          Amount = totalAmount
          Unit = unit
          Category = cat
          IsChecked = false })
    |> List.sortBy (fun item -> (item.Category, item.Name))

/// Render a single grocery item
let private groceryItem (item: GroceryItem) (isChecked: bool) (dispatch: Msg -> unit) =
    Html.div [
        prop.className (if isChecked then "grocery-item checked" else "grocery-item")
        prop.onClick (fun _ -> dispatch (ToggleGroceryItem item.Name))
        prop.children [
            Html.div [
                prop.className "grocery-checkbox"
                prop.text (if isChecked then "\u2611" else "\u2610")
            ]
            Html.div [
                prop.className "grocery-info"
                prop.children [
                    Html.span [
                        prop.className "grocery-name"
                        prop.text item.Name
                    ]
                    Html.span [
                        prop.className "grocery-amount"
                        prop.text (sprintf "%.0f %s" item.Amount item.Unit.Abbrev)
                    ]
                ]
            ]
        ]
    ]

/// Copy grocery list to clipboard as text
let private copyToClipboard (items: GroceryItem list) =
    let text =
        items
        |> List.groupBy (fun i -> i.Category)
        |> List.map (fun (cat, items) ->
            let header = sprintf "== %s ==" cat
            let lines =
                items |> List.map (fun i ->
                    sprintf "  [ ] %.0f %s %s" i.Amount i.Unit.Abbrev i.Name)
            header :: lines |> String.concat "\n")
        |> String.concat "\n\n"
    Browser.Dom.window?navigator?clipboard?writeText(text) |> ignore

/// Main grocery list view
let view (model: Model) (dispatch: Msg -> unit) =
    let items = generateGroceryList model.Recipes model.WeekPlan.Meals
    let grouped = items |> List.groupBy (fun i -> i.Category)
    let checkedCount =
        items |> List.filter (fun i ->
            model.GroceryChecked |> Map.tryFind i.Name |> Option.defaultValue false)
        |> List.length

    Html.div [
        prop.className "grocery-page"
        prop.children [
            Html.div [
                prop.className "page-header"
                prop.children [
                    Html.h2 [ prop.text "Grocery List" ]
                    if not items.IsEmpty then
                        Html.div [
                            prop.className "grocery-header-actions"
                            prop.children [
                                Html.span [
                                    prop.className "grocery-count"
                                    prop.text (sprintf "%d/%d items" checkedCount (List.length items))
                                ]
                                Html.button [
                                    prop.className "btn btn-secondary btn-small"
                                    prop.text "\U0001F4CB Copy"
                                    prop.onClick (fun _ -> copyToClipboard items)
                                ]
                                if checkedCount > 0 then
                                    Html.button [
                                        prop.className "btn btn-secondary btn-small"
                                        prop.text "Clear \u2713"
                                        prop.onClick (fun _ -> dispatch ClearCheckedItems)
                                    ]
                            ]
                        ]
                ]
            ]

            if items.IsEmpty then
                Html.div [
                    prop.className "empty-state"
                    prop.children [
                        Html.div [ prop.className "empty-icon"; prop.text "\U0001F6D2" ]
                        Html.p [ prop.text "Your grocery list is empty." ]
                        Html.p [ prop.className "empty-hint"; prop.text "Plan some meals for the week to generate a shopping list!" ]
                    ]
                ]
            else
                Html.div [
                    prop.className "grocery-sections"
                    prop.children [
                        for (category, catItems) in grouped do
                            Html.div [
                                prop.className "grocery-section"
                                prop.children [
                                    Html.h3 [ prop.className "grocery-cat-header"; prop.text category ]
                                    for item in catItems do
                                        let isChecked =
                                            model.GroceryChecked
                                            |> Map.tryFind item.Name
                                            |> Option.defaultValue false
                                        groceryItem item isChecked dispatch
                                ]
                            ]
                    ]
                ]
        ]
    ]
