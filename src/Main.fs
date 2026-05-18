module MealPlanner.Main

open Feliz
open Browser
open MealPlanner.Types
open MealPlanner.App

[<ReactComponent>]
let AppComponent () =
    let (model, dispatch) = React.useReducer((fun m msg -> update msg m), init ())

    React.useEffect (
        (fun () ->
            let title =
                match model.ActiveView with
                | PlannerView -> "Week Planner"
                | RecipeListView -> "Recipes"
                | RecipeDetailView _ -> "Recipe"
                | RecipeEditorView _ -> "Edit Recipe"
                | GroceryListView -> "Grocery List"
                | StatsView -> "Nutrition"
            document.title <- sprintf "%s | MealPlanner" title
        ),
        [| box model.ActiveView |]
    )

    view model dispatch

let root = ReactDOM.createRoot (document.getElementById "app")
root.render (AppComponent ())
