import { toString, datetime, list as list_3, guid, object } from "./fable_modules/Thoth.Json.10.2.0/Encode.fs.js";
import { NutritionTarget_get_Default, NutritionTarget, WeekPlan, PlannedMeal, Recipe, MealTypes_fromCode, FoodCategories_fromCode, Ingredient, MeasureUnits_fromCode, Nutrition, MealType__get_Code, FoodCategory__get_Code, MeasureUnit__get_Code } from "./Types.fs.js";
import { empty, map } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { fromString, datetime as datetime_1, bool, int, list as list_4, string, guid as guid_1, float, object as object_1 } from "./fable_modules/Thoth.Json.10.2.0/Decode.fs.js";
import { uncurry2 } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { bind, defaultArg, ofNullable } from "./fable_modules/fable-library-js.4.24.0/Option.js";

export function Encode_nutrition(n) {
    return object([["calories", n.Calories], ["protein", n.Protein], ["carbs", n.Carbs], ["fat", n.Fat]]);
}

export function Encode_ingredient(i) {
    return object([["id", guid(i.Id)], ["name", i.Name], ["amount", i.Amount], ["unit", MeasureUnit__get_Code(i.Unit)], ["groceryCategory", i.GroceryCategory]]);
}

export function Encode_recipe(r) {
    return object([["id", guid(r.Id)], ["name", r.Name], ["description", r.Description], ["category", FoodCategory__get_Code(r.Category)], ["suitableFor", list_3(map(MealType__get_Code, r.SuitableFor))], ["servings", r.Servings], ["prepTimeMinutes", r.PrepTimeMinutes], ["cookTimeMinutes", r.CookTimeMinutes], ["ingredients", list_3(map(Encode_ingredient, r.Ingredients))], ["instructions", list_3(map((value_7) => value_7, r.Instructions))], ["nutrition", Encode_nutrition(r.Nutrition)], ["imageEmoji", r.ImageEmoji], ["isFavorite", r.IsFavorite], ["createdAt", datetime(r.CreatedAt)]]);
}

export function Encode_plannedMeal(m) {
    return object([["id", guid(m.Id)], ["recipeId", guid(m.RecipeId)], ["dayOfWeek", m.DayOfWeek], ["mealType", MealType__get_Code(m.MealType)], ["servings", m.Servings]]);
}

export function Encode_weekPlan(w) {
    return object([["weekStart", datetime(w.WeekStart)], ["meals", list_3(map(Encode_plannedMeal, w.Meals))]]);
}

export function Encode_nutritionTarget(t) {
    return object([["calories", t.Calories], ["protein", t.Protein], ["carbs", t.Carbs], ["fat", t.Fat]]);
}

export const Decode_nutrition = (path_4) => ((v) => object_1((get$) => {
    let objectArg, objectArg_1, objectArg_2, objectArg_3;
    return new Nutrition((objectArg = get$.Required, objectArg.Field("calories", float)), (objectArg_1 = get$.Required, objectArg_1.Field("protein", float)), (objectArg_2 = get$.Required, objectArg_2.Field("carbs", float)), (objectArg_3 = get$.Required, objectArg_3.Field("fat", float)));
}, path_4, v));

export const Decode_ingredient = (path_5) => ((v) => object_1((get$) => {
    let objectArg, objectArg_1, objectArg_2, objectArg_3, objectArg_4;
    return new Ingredient((objectArg = get$.Required, objectArg.Field("id", guid_1)), (objectArg_1 = get$.Required, objectArg_1.Field("name", string)), (objectArg_2 = get$.Required, objectArg_2.Field("amount", float)), MeasureUnits_fromCode((objectArg_3 = get$.Required, objectArg_3.Field("unit", string))), (objectArg_4 = get$.Required, objectArg_4.Field("groceryCategory", string)));
}, path_5, v));

export const Decode_recipe = (path_12) => ((v) => object_1((get$) => {
    let objectArg, objectArg_1, objectArg_2, objectArg_3, objectArg_4, objectArg_5, objectArg_6, objectArg_7, objectArg_8, objectArg_9, objectArg_10, objectArg_11, objectArg_12, objectArg_13;
    return new Recipe((objectArg = get$.Required, objectArg.Field("id", guid_1)), (objectArg_1 = get$.Required, objectArg_1.Field("name", string)), (objectArg_2 = get$.Required, objectArg_2.Field("description", string)), FoodCategories_fromCode((objectArg_3 = get$.Required, objectArg_3.Field("category", string))), map(MealTypes_fromCode, (objectArg_4 = get$.Required, objectArg_4.Field("suitableFor", (path_5, value_5) => list_4(string, path_5, value_5)))), (objectArg_5 = get$.Required, objectArg_5.Field("servings", uncurry2(int))), (objectArg_6 = get$.Required, objectArg_6.Field("prepTimeMinutes", uncurry2(int))), (objectArg_7 = get$.Required, objectArg_7.Field("cookTimeMinutes", uncurry2(int))), (objectArg_8 = get$.Required, objectArg_8.Field("ingredients", (path_6, value_6) => list_4(uncurry2(Decode_ingredient), path_6, value_6))), (objectArg_9 = get$.Required, objectArg_9.Field("instructions", (path_8, value_8) => list_4(string, path_8, value_8))), (objectArg_10 = get$.Required, objectArg_10.Field("nutrition", uncurry2(Decode_nutrition))), (objectArg_11 = get$.Required, objectArg_11.Field("imageEmoji", string)), (objectArg_12 = get$.Required, objectArg_12.Field("isFavorite", bool)), (objectArg_13 = get$.Required, objectArg_13.Field("createdAt", datetime_1)));
}, path_12, v));

export const Decode_plannedMeal = (path_3) => ((v) => object_1((get$) => {
    let objectArg, objectArg_1, objectArg_2, objectArg_3, objectArg_4;
    return new PlannedMeal((objectArg = get$.Required, objectArg.Field("id", guid_1)), (objectArg_1 = get$.Required, objectArg_1.Field("recipeId", guid_1)), (objectArg_2 = get$.Required, objectArg_2.Field("dayOfWeek", uncurry2(int))), MealTypes_fromCode((objectArg_3 = get$.Required, objectArg_3.Field("mealType", string))), (objectArg_4 = get$.Required, objectArg_4.Field("servings", uncurry2(int))));
}, path_3, v));

export const Decode_weekPlan = (path_2) => ((v) => object_1((get$) => {
    let objectArg, objectArg_1;
    return new WeekPlan((objectArg = get$.Required, objectArg.Field("weekStart", datetime_1)), (objectArg_1 = get$.Required, objectArg_1.Field("meals", (path_1, value_1) => list_4(uncurry2(Decode_plannedMeal), path_1, value_1))));
}, path_2, v));

export const Decode_nutritionTarget = (path_4) => ((v) => object_1((get$) => {
    let objectArg, objectArg_1, objectArg_2, objectArg_3;
    return new NutritionTarget((objectArg = get$.Required, objectArg.Field("calories", float)), (objectArg_1 = get$.Required, objectArg_1.Field("protein", float)), (objectArg_2 = get$.Required, objectArg_2.Field("carbs", float)), (objectArg_3 = get$.Required, objectArg_3.Field("fat", float)));
}, path_4, v));

function save(key, value) {
    window.localStorage.setItem(key, value);
}

function load(key) {
    return ofNullable(window.localStorage.getItem(key));
}

export function saveRecipes(recipes) {
    save("mealplanner_recipes", toString(0, list_3(map(Encode_recipe, recipes))));
}

export function loadRecipes() {
    return defaultArg(bind((j) => {
        const matchValue = fromString((path, value) => list_4(uncurry2(Decode_recipe), path, value), j);
        if (matchValue.tag === 0) {
            return matchValue.fields[0];
        }
        else {
            return undefined;
        }
    }, load("mealplanner_recipes")), empty());
}

export function saveWeekPlan(plan) {
    save("mealplanner_weekplan", toString(0, Encode_weekPlan(plan)));
}

export function loadWeekPlan() {
    return bind((j) => {
        const matchValue = fromString(uncurry2(Decode_weekPlan), j);
        if (matchValue.tag === 0) {
            return matchValue.fields[0];
        }
        else {
            return undefined;
        }
    }, load("mealplanner_weekplan"));
}

export function saveTarget(t) {
    save("mealplanner_target", toString(0, Encode_nutritionTarget(t)));
}

export function loadTarget() {
    return defaultArg(bind((j) => {
        const matchValue = fromString(uncurry2(Decode_nutritionTarget), j);
        if (matchValue.tag === 0) {
            return matchValue.fields[0];
        }
        else {
            return undefined;
        }
    }, load("mealplanner_target")), NutritionTarget_get_Default());
}

