module MealPlanner.Storage

open System
open Fable.Core
open Browser
open Thoth.Json
open MealPlanner.Types

module Encode =
    let nutrition (n: Nutrition) =
        Encode.object
            [ "calories", Encode.float n.Calories; "protein", Encode.float n.Protein
              "carbs", Encode.float n.Carbs; "fat", Encode.float n.Fat ]

    let ingredient (i: Ingredient) =
        Encode.object
            [ "id", Encode.guid i.Id; "name", Encode.string i.Name
              "amount", Encode.float i.Amount; "unit", Encode.string i.Unit.Code
              "groceryCategory", Encode.string i.GroceryCategory ]

    let recipe (r: Recipe) =
        Encode.object
            [ "id", Encode.guid r.Id; "name", Encode.string r.Name
              "description", Encode.string r.Description
              "category", Encode.string r.Category.Code
              "suitableFor", r.SuitableFor |> List.map (fun m -> Encode.string m.Code) |> Encode.list
              "servings", Encode.int r.Servings
              "prepTimeMinutes", Encode.int r.PrepTimeMinutes
              "cookTimeMinutes", Encode.int r.CookTimeMinutes
              "ingredients", r.Ingredients |> List.map ingredient |> Encode.list
              "instructions", r.Instructions |> List.map Encode.string |> Encode.list
              "nutrition", nutrition r.Nutrition
              "imageEmoji", Encode.string r.ImageEmoji
              "isFavorite", Encode.bool r.IsFavorite
              "createdAt", Encode.datetime r.CreatedAt ]

    let plannedMeal (m: PlannedMeal) =
        Encode.object
            [ "id", Encode.guid m.Id; "recipeId", Encode.guid m.RecipeId
              "dayOfWeek", Encode.int m.DayOfWeek
              "mealType", Encode.string m.MealType.Code
              "servings", Encode.int m.Servings ]

    let weekPlan (w: WeekPlan) =
        Encode.object
            [ "weekStart", Encode.datetime w.WeekStart
              "meals", w.Meals |> List.map plannedMeal |> Encode.list ]

    let nutritionTarget (t: NutritionTarget) =
        Encode.object
            [ "calories", Encode.float t.Calories; "protein", Encode.float t.Protein
              "carbs", Encode.float t.Carbs; "fat", Encode.float t.Fat ]

module Decode =
    let nutrition: Decoder<Nutrition> =
        Decode.object (fun get ->
            { Calories = get.Required.Field "calories" Decode.float
              Protein = get.Required.Field "protein" Decode.float
              Carbs = get.Required.Field "carbs" Decode.float
              Fat = get.Required.Field "fat" Decode.float })

    let ingredient: Decoder<Ingredient> =
        Decode.object (fun get ->
            { Id = get.Required.Field "id" Decode.guid
              Name = get.Required.Field "name" Decode.string
              Amount = get.Required.Field "amount" Decode.float
              Unit = get.Required.Field "unit" Decode.string |> MeasureUnits.fromCode
              GroceryCategory = get.Required.Field "groceryCategory" Decode.string })

    let recipe: Decoder<Recipe> =
        Decode.object (fun get ->
            { Id = get.Required.Field "id" Decode.guid
              Name = get.Required.Field "name" Decode.string
              Description = get.Required.Field "description" Decode.string
              Category = get.Required.Field "category" Decode.string |> FoodCategories.fromCode
              SuitableFor = get.Required.Field "suitableFor" (Decode.list Decode.string) |> List.map MealTypes.fromCode
              Servings = get.Required.Field "servings" Decode.int
              PrepTimeMinutes = get.Required.Field "prepTimeMinutes" Decode.int
              CookTimeMinutes = get.Required.Field "cookTimeMinutes" Decode.int
              Ingredients = get.Required.Field "ingredients" (Decode.list ingredient)
              Instructions = get.Required.Field "instructions" (Decode.list Decode.string)
              Nutrition = get.Required.Field "nutrition" nutrition
              ImageEmoji = get.Required.Field "imageEmoji" Decode.string
              IsFavorite = get.Required.Field "isFavorite" Decode.bool
              CreatedAt = get.Required.Field "createdAt" Decode.datetime })

    let plannedMeal: Decoder<PlannedMeal> =
        Decode.object (fun get ->
            { Id = get.Required.Field "id" Decode.guid
              RecipeId = get.Required.Field "recipeId" Decode.guid
              DayOfWeek = get.Required.Field "dayOfWeek" Decode.int
              MealType = get.Required.Field "mealType" Decode.string |> MealTypes.fromCode
              Servings = get.Required.Field "servings" Decode.int })

    let weekPlan: Decoder<WeekPlan> =
        Decode.object (fun get ->
            { WeekStart = get.Required.Field "weekStart" Decode.datetime
              Meals = get.Required.Field "meals" (Decode.list plannedMeal) })

    let nutritionTarget: Decoder<NutritionTarget> =
        Decode.object (fun get ->
            { Calories = get.Required.Field "calories" Decode.float
              Protein = get.Required.Field "protein" Decode.float
              Carbs = get.Required.Field "carbs" Decode.float
              Fat = get.Required.Field "fat" Decode.float })

[<Literal>]
let private RecipesKey = "mealplanner_recipes"
[<Literal>]
let private WeekPlanKey = "mealplanner_weekplan"
[<Literal>]
let private TargetKey = "mealplanner_target"

let private save key value = window.localStorage.setItem(key, value)
let private load key = window.localStorage.getItem key |> Option.ofObj

let saveRecipes (recipes: Recipe list) =
    recipes |> List.map Encode.recipe |> Encode.list |> Encode.toString 0 |> save RecipesKey

let loadRecipes () =
    load RecipesKey
    |> Option.bind (fun j -> match Decode.fromString (Decode.list Decode.recipe) j with Ok r -> Some r | _ -> None)
    |> Option.defaultValue []

let saveWeekPlan (plan: WeekPlan) =
    plan |> Encode.weekPlan |> Encode.toString 0 |> save WeekPlanKey

let loadWeekPlan () =
    load WeekPlanKey
    |> Option.bind (fun j -> match Decode.fromString Decode.weekPlan j with Ok p -> Some p | _ -> None)

let saveTarget (t: NutritionTarget) =
    t |> Encode.nutritionTarget |> Encode.toString 0 |> save TargetKey

let loadTarget () =
    load TargetKey
    |> Option.bind (fun j -> match Decode.fromString Decode.nutritionTarget j with Ok t -> Some t | _ -> None)
    |> Option.defaultValue NutritionTarget.Default
