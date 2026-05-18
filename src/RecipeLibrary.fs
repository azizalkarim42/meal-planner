module MealPlanner.RecipeLibrary

open System
open Feliz
open MealPlanner.Types

let private recipeCard (recipe: Recipe) (dispatch: Msg -> unit) =
    let totalTime = recipe.PrepTimeMinutes + recipe.CookTimeMinutes

    Html.div [
        prop.className "recipe-card"
        prop.onClick (fun _ -> dispatch (SetView (RecipeDetailView recipe.Id)))
        prop.children [
            Html.div [
                prop.className "recipe-card-top"
                prop.children [
                    Html.span [ prop.className "recipe-emoji"; prop.text recipe.ImageEmoji ]
                    Html.div [
                        prop.className "recipe-card-badges"
                        prop.children [
                            Html.span [ prop.className "recipe-cat-badge"; prop.text (sprintf "%s %s" recipe.Category.Icon recipe.Category.Label) ]
                            if recipe.IsFavorite then
                                Html.span [ prop.className "fav-badge"; prop.text "\u2764\uFE0F" ]
                        ]
                    ]
                ]
            ]
            Html.div [
                prop.className "recipe-card-body"
                prop.children [
                    Html.h3 [ prop.className "recipe-card-name"; prop.text recipe.Name ]
                    Html.p [ prop.className "recipe-card-desc"; prop.text recipe.Description ]
                    Html.div [
                        prop.className "recipe-card-meta"
                        prop.children [
                            Html.span [ prop.text (sprintf "\u23F1 %d min" totalTime) ]
                            Html.span [ prop.text (sprintf "\U0001F37D\uFE0F %d servings" recipe.Servings) ]
                            Html.span [ prop.text (sprintf "\U0001F525 %.0f kcal" recipe.Nutrition.Calories) ]
                        ]
                    ]
                ]
            ]
        ]
    ]

let private recipeDetail (recipeId: Guid) (model: Model) (dispatch: Msg -> unit) =
    match model.Recipes |> List.tryFind (fun r -> r.Id = recipeId) with
    | None -> Html.div [ Html.p [ prop.text "Recipe not found." ] ]
    | Some recipe ->
        let totalTime = recipe.PrepTimeMinutes + recipe.CookTimeMinutes
        Html.div [
            prop.className "recipe-detail-page"
            prop.children [
                Html.button [
                    prop.className "btn-back"
                    prop.text "\u2190 Back to Recipes"
                    prop.onClick (fun _ -> dispatch (SetView RecipeListView))
                ]

                Html.div [
                    prop.className "recipe-detail-header"
                    prop.children [
                        Html.span [ prop.className "recipe-detail-emoji"; prop.text recipe.ImageEmoji ]
                        Html.h2 [ prop.text recipe.Name ]
                        Html.p [ prop.className "recipe-detail-desc"; prop.text recipe.Description ]
                        Html.div [
                            prop.className "recipe-detail-meta"
                            prop.children [
                                Html.span [ prop.text (sprintf "\u23F1 %d min total" totalTime) ]
                                Html.span [ prop.text (sprintf "%s %s" recipe.Category.Icon recipe.Category.Label) ]
                                Html.span [ prop.text (sprintf "%d servings" recipe.Servings) ]
                            ]
                        ]
                    ]
                ]

                // Nutrition card
                Html.div [
                    prop.className "nutrition-card"
                    prop.children [
                        Html.h3 [ prop.text "Nutrition per Serving" ]
                        Html.div [
                            prop.className "nutrition-grid"
                            prop.children [
                                Html.div [ prop.className "nut-item"; prop.children [ Html.div [ prop.className "nut-val"; prop.text (sprintf "%.0f" recipe.Nutrition.Calories) ]; Html.div [ prop.className "nut-label"; prop.text "kcal" ] ] ]
                                Html.div [ prop.className "nut-item"; prop.children [ Html.div [ prop.className "nut-val"; prop.text (sprintf "%.1fg" recipe.Nutrition.Protein) ]; Html.div [ prop.className "nut-label"; prop.text "Protein" ] ] ]
                                Html.div [ prop.className "nut-item"; prop.children [ Html.div [ prop.className "nut-val"; prop.text (sprintf "%.1fg" recipe.Nutrition.Carbs) ]; Html.div [ prop.className "nut-label"; prop.text "Carbs" ] ] ]
                                Html.div [ prop.className "nut-item"; prop.children [ Html.div [ prop.className "nut-val"; prop.text (sprintf "%.1fg" recipe.Nutrition.Fat) ]; Html.div [ prop.className "nut-label"; prop.text "Fat" ] ] ]
                            ]
                        ]
                    ]
                ]

                // Ingredients
                Html.div [
                    prop.className "detail-section"
                    prop.children [
                        Html.h3 [ prop.text (sprintf "Ingredients (%d)" (List.length recipe.Ingredients)) ]
                        Html.ul [
                            prop.className "ingredient-detail-list"
                            prop.children [
                                for ing in recipe.Ingredients do
                                    Html.li [ prop.text (sprintf "%.0f %s %s" ing.Amount ing.Unit.Abbrev ing.Name) ]
                            ]
                        ]
                    ]
                ]

                // Instructions
                if not recipe.Instructions.IsEmpty then
                    Html.div [
                        prop.className "detail-section"
                        prop.children [
                            Html.h3 [ prop.text "Instructions" ]
                            Html.ol [
                                prop.className "instruction-detail-list"
                                prop.children [
                                    for step in recipe.Instructions do
                                        Html.li [ prop.text step ]
                                ]
                            ]
                        ]
                    ]

                // Actions
                Html.div [
                    prop.className "detail-actions"
                    prop.children [
                        Html.button [
                            prop.className "btn btn-primary"
                            prop.text "\u270E Edit"
                            prop.onClick (fun _ -> dispatch (SetView (RecipeEditorView (Some recipe.Id))))
                        ]
                        Html.button [
                            prop.className (if recipe.IsFavorite then "btn btn-fav active" else "btn btn-fav")
                            prop.text (if recipe.IsFavorite then "\u2764\uFE0F Favorited" else "\u2661 Favorite")
                            prop.onClick (fun _ -> dispatch (ToggleFavorite recipe.Id))
                        ]
                        Html.button [
                            prop.className "btn btn-danger"
                            prop.text "Delete"
                            prop.onClick (fun _ -> dispatch (DeleteRecipe recipe.Id))
                        ]
                    ]
                ]
            ]
        ]

let view (model: Model) (dispatch: Msg -> unit) =
    let filtered =
        model.Recipes
        |> List.filter (fun r ->
            let matchesSearch =
                model.SearchQuery = ""
                || r.Name.ToLower().Contains(model.SearchQuery.ToLower())
                || r.Description.ToLower().Contains(model.SearchQuery.ToLower())
            let matchesCat =
                match model.FilterCategory with
                | Some cat -> r.Category = cat
                | None -> true
            matchesSearch && matchesCat)

    Html.div [
        prop.className "recipe-list-page"
        prop.children [
            Html.div [
                prop.className "page-header"
                prop.children [
                    Html.h2 [ prop.text "Recipes" ]
                    Html.button [
                        prop.className "btn btn-primary btn-small"
                        prop.text "+ New Recipe"
                        prop.onClick (fun _ -> dispatch (SetView (RecipeEditorView None)))
                    ]
                ]
            ]

            // Search
            Html.div [
                prop.className "search-wrap"
                prop.children [
                    Html.span [ prop.className "search-icon"; prop.text "\U0001F50D" ]
                    Html.input [
                        prop.className "search-input"
                        prop.placeholder "Search recipes..."
                        prop.value model.SearchQuery
                        prop.onChange (fun (v: string) -> dispatch (SetSearchQuery v))
                    ]
                ]
            ]

            // Category filter pills
            Html.div [
                prop.className "filter-pills"
                prop.children [
                    Html.button [
                        prop.className (if model.FilterCategory.IsNone then "filter-pill active" else "filter-pill")
                        prop.text "All"
                        prop.onClick (fun _ -> dispatch (SetFilterCategory None))
                    ]
                    for cat in FoodCategories.all do
                        Html.button [
                            prop.className (if model.FilterCategory = Some cat then "filter-pill active" else "filter-pill")
                            prop.text (sprintf "%s %s" cat.Icon cat.Label)
                            prop.onClick (fun _ -> dispatch (SetFilterCategory (Some cat)))
                        ]
                ]
            ]

            if filtered.IsEmpty then
                Html.div [
                    prop.className "empty-state"
                    prop.children [
                        Html.div [ prop.className "empty-icon"; prop.text "\U0001F373" ]
                        Html.p [ prop.text "No recipes found." ]
                        Html.p [ prop.className "empty-hint"; prop.text "Create your first recipe to start meal planning!" ]
                    ]
                ]
            else
                Html.div [
                    prop.className "recipe-grid"
                    prop.children [ for r in filtered do recipeCard r dispatch ]
                ]
        ]
    ]

let detailView = recipeDetail
