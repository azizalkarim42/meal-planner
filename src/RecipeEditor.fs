module MealPlanner.RecipeEditor

open System
open Feliz
open MealPlanner.Types

let private emojiPicker (selected: string) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "emoji-picker"
        prop.children [
            for emoji in RecipeEmojis.all do
                Html.button [
                    prop.className (if emoji = selected then "emoji-btn selected" else "emoji-btn")
                    prop.text emoji
                    prop.onClick (fun _ -> dispatch (SetImageEmoji emoji))
                ]
        ]
    ]

let private categorySelector (selected: FoodCategory) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "cat-pills"
        prop.children [
            for cat in FoodCategories.all do
                Html.button [
                    prop.className (if cat = selected then "cat-pill active" else "cat-pill")
                    prop.text (sprintf "%s %s" cat.Icon cat.Label)
                    prop.onClick (fun _ -> dispatch (SetRecipeCategory cat))
                ]
        ]
    ]

let private mealTypeToggles (selected: MealType list) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "meal-toggles"
        prop.children [
            for mt in MealTypes.all do
                Html.button [
                    prop.className (if selected |> List.contains mt then "meal-toggle active" else "meal-toggle")
                    prop.text (sprintf "%s %s" mt.Icon mt.Label)
                    prop.onClick (fun _ -> dispatch (ToggleSuitableFor mt))
                ]
        ]
    ]

let private ingredientForm (model: Model) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "ingredient-form"
        prop.children [
            Html.input [
                prop.className "text-input ing-name"
                prop.placeholder "Ingredient name"
                prop.value model.RecipeForm.NewIngName
                prop.onChange (fun (v: string) -> dispatch (SetNewIngName v))
            ]
            Html.input [
                prop.className "text-input ing-amount"
                prop.placeholder "Qty"
                prop.type'.number
                prop.value model.RecipeForm.NewIngAmount
                prop.onChange (fun (v: string) -> dispatch (SetNewIngAmount v))
            ]
            Html.select [
                prop.className "select-input ing-unit"
                prop.value model.RecipeForm.NewIngUnit.Code
                prop.onChange (fun (v: string) -> dispatch (SetNewIngUnit (MeasureUnits.fromCode v)))
                prop.children [
                    for u in MeasureUnits.all do
                        Html.option [ prop.value u.Code; prop.text u.Abbrev ]
                ]
            ]
            Html.select [
                prop.className "select-input ing-cat"
                prop.value model.RecipeForm.NewIngCategory
                prop.onChange (fun (v: string) -> dispatch (SetNewIngCategory v))
                prop.children [
                    for c in GroceryCategories.all do
                        Html.option [ prop.value c; prop.text c ]
                ]
            ]
            Html.button [
                prop.className "btn btn-primary btn-small"
                prop.text "+"
                prop.disabled (model.RecipeForm.NewIngName.Trim() = "")
                prop.onClick (fun _ -> dispatch AddIngredient)
            ]
        ]
    ]

let private ingredientList (ingredients: Ingredient list) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "ingredient-list"
        prop.children [
            for ing in ingredients do
                Html.div [
                    prop.className "ingredient-item"
                    prop.children [
                        Html.span [
                            prop.className "ing-text"
                            prop.text (sprintf "%.0f %s %s" ing.Amount ing.Unit.Abbrev ing.Name)
                        ]
                        Html.span [ prop.className "ing-category"; prop.text ing.GroceryCategory ]
                        Html.button [
                            prop.className "btn-icon btn-delete"
                            prop.text "\u00D7"
                            prop.onClick (fun _ -> dispatch (RemoveIngredient ing.Id))
                        ]
                    ]
                ]
        ]
    ]

let private instructionEditor (instructions: string list) (newInst: string) (dispatch: Msg -> unit) =
    Html.div [
        prop.className "instruction-editor"
        prop.children [
            for i in 0 .. instructions.Length - 1 do
                Html.div [
                    prop.className "instruction-item"
                    prop.children [
                        Html.span [ prop.className "step-num"; prop.text (sprintf "%d." (i + 1)) ]
                        Html.span [ prop.className "step-text"; prop.text instructions.[i] ]
                        Html.button [
                            prop.className "btn-icon btn-delete"
                            prop.text "\u00D7"
                            prop.onClick (fun _ -> dispatch (RemoveInstruction i))
                        ]
                    ]
                ]
            Html.div [
                prop.className "add-instruction"
                prop.children [
                    Html.input [
                        prop.className "text-input"
                        prop.placeholder "Add a step..."
                        prop.value newInst
                        prop.onChange (fun (v: string) -> dispatch (SetNewInstruction v))
                        prop.onKeyDown (fun e ->
                            if e.key = "Enter" && newInst.Trim() <> "" then dispatch AddInstruction)
                    ]
                    Html.button [
                        prop.className "btn btn-primary btn-small"
                        prop.text "Add Step"
                        prop.disabled (newInst.Trim() = "")
                        prop.onClick (fun _ -> dispatch AddInstruction)
                    ]
                ]
            ]
        ]
    ]

let view (recipeId: Guid option) (model: Model) (dispatch: Msg -> unit) =
    let isEditing = recipeId.IsSome
    let canSave =
        model.RecipeForm.Name.Trim() <> ""
        && not model.RecipeForm.Ingredients.IsEmpty

    Html.div [
        prop.className "recipe-editor-page"
        prop.children [
            Html.button [
                prop.className "btn-back"
                prop.text "\u2190 Back to Recipes"
                prop.onClick (fun _ -> dispatch CancelRecipeEdit)
            ]
            Html.h2 [ prop.text (if isEditing then "Edit Recipe" else "New Recipe") ]

            // Name and emoji
            Html.div [
                prop.className "form-field"
                prop.children [
                    Html.label [ prop.className "form-label"; prop.text "Recipe Name" ]
                    Html.input [
                        prop.className "text-input"
                        prop.placeholder "e.g. Chicken Pasta Salad"
                        prop.value model.RecipeForm.Name
                        prop.autoFocus true
                        prop.onChange (fun (v: string) -> dispatch (SetRecipeName v))
                    ]
                ]
            ]

            Html.div [
                prop.className "form-field"
                prop.children [
                    Html.label [ prop.className "form-label"; prop.text "Description" ]
                    Html.textarea [
                        prop.className "text-input"
                        prop.placeholder "Brief description..."
                        prop.value model.RecipeForm.Description
                        prop.rows 2
                        prop.onChange (fun (v: string) -> dispatch (SetRecipeDesc v))
                    ]
                ]
            ]

            // Emoji picker
            Html.div [
                prop.className "form-field"
                prop.children [
                    Html.label [ prop.className "form-label"; prop.text "Icon" ]
                    emojiPicker model.RecipeForm.ImageEmoji dispatch
                ]
            ]

            // Category
            Html.div [
                prop.className "form-field"
                prop.children [
                    Html.label [ prop.className "form-label"; prop.text "Category" ]
                    categorySelector model.RecipeForm.Category dispatch
                ]
            ]

            // Suitable meal types
            Html.div [
                prop.className "form-field"
                prop.children [
                    Html.label [ prop.className "form-label"; prop.text "Suitable For" ]
                    mealTypeToggles model.RecipeForm.SuitableFor dispatch
                ]
            ]

            // Time and servings
            Html.div [
                prop.className "time-servings-row"
                prop.children [
                    Html.div [
                        prop.className "form-field-inline"
                        prop.children [
                            Html.label [ prop.className "form-label"; prop.text "Servings" ]
                            Html.input [
                                prop.className "text-input small-input"
                                prop.type'.number; prop.value model.RecipeForm.Servings
                                prop.onChange (fun (v: string) -> dispatch (SetServings v))
                            ]
                        ]
                    ]
                    Html.div [
                        prop.className "form-field-inline"
                        prop.children [
                            Html.label [ prop.className "form-label"; prop.text "Prep (min)" ]
                            Html.input [
                                prop.className "text-input small-input"
                                prop.type'.number; prop.value model.RecipeForm.PrepTime
                                prop.onChange (fun (v: string) -> dispatch (SetPrepTime v))
                            ]
                        ]
                    ]
                    Html.div [
                        prop.className "form-field-inline"
                        prop.children [
                            Html.label [ prop.className "form-label"; prop.text "Cook (min)" ]
                            Html.input [
                                prop.className "text-input small-input"
                                prop.type'.number; prop.value model.RecipeForm.CookTime
                                prop.onChange (fun (v: string) -> dispatch (SetCookTime v))
                            ]
                        ]
                    ]
                ]
            ]

            // Nutrition per serving
            Html.div [
                prop.className "form-field"
                prop.children [
                    Html.label [ prop.className "form-label"; prop.text "Nutrition (per serving)" ]
                    Html.div [
                        prop.className "nutrition-inputs"
                        prop.children [
                            Html.input [ prop.className "text-input small-input"; prop.placeholder "kcal"; prop.type'.number; prop.value model.RecipeForm.Calories; prop.onChange (fun (v: string) -> dispatch (SetCalories v)) ]
                            Html.input [ prop.className "text-input small-input"; prop.placeholder "Protein g"; prop.type'.number; prop.value model.RecipeForm.Protein; prop.onChange (fun (v: string) -> dispatch (SetProtein v)) ]
                            Html.input [ prop.className "text-input small-input"; prop.placeholder "Carbs g"; prop.type'.number; prop.value model.RecipeForm.Carbs; prop.onChange (fun (v: string) -> dispatch (SetCarbs v)) ]
                            Html.input [ prop.className "text-input small-input"; prop.placeholder "Fat g"; prop.type'.number; prop.value model.RecipeForm.Fat; prop.onChange (fun (v: string) -> dispatch (SetFat v)) ]
                        ]
                    ]
                ]
            ]

            // Ingredients
            Html.div [
                prop.className "form-field"
                prop.children [
                    Html.label [ prop.className "form-label"; prop.text "Ingredients" ]
                    ingredientForm model dispatch
                    ingredientList model.RecipeForm.Ingredients dispatch
                ]
            ]

            // Instructions
            Html.div [
                prop.className "form-field"
                prop.children [
                    Html.label [ prop.className "form-label"; prop.text "Instructions" ]
                    instructionEditor model.RecipeForm.Instructions model.RecipeForm.NewInstruction dispatch
                ]
            ]

            // Save/Cancel
            Html.div [
                prop.className "form-actions"
                prop.children [
                    Html.button [
                        prop.className "btn btn-primary btn-large"
                        prop.text (if isEditing then "Save Changes" else "Create Recipe")
                        prop.disabled (not canSave)
                        prop.onClick (fun _ -> dispatch SaveRecipe)
                    ]
                    Html.button [
                        prop.className "btn btn-secondary"
                        prop.text "Cancel"
                        prop.onClick (fun _ -> dispatch CancelRecipeEdit)
                    ]
                ]
            ]
        ]
    ]
