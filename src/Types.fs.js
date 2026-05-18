import { Record, Union } from "./fable_modules/fable-library-js.4.24.0/Types.js";
import { option_type, bool_type, int32_type, list_type, string_type, class_type, record_type, float64_type, union_type } from "./fable_modules/fable-library-js.4.24.0/Reflection.js";
import { empty, tryFind, ofArray } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { defaultArg } from "./fable_modules/fable-library-js.4.24.0/Option.js";

export class MealType extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Breakfast", "Lunch", "Dinner", "Snack"];
    }
}

export function MealType_$reflection() {
    return union_type("MealPlanner.Types.MealType", [], MealType, () => [[], [], [], []]);
}

export function MealType__get_Label(this$) {
    switch (this$.tag) {
        case 1:
            return "Lunch";
        case 2:
            return "Dinner";
        case 3:
            return "Snack";
        default:
            return "Breakfast";
    }
}

export function MealType__get_Icon(this$) {
    switch (this$.tag) {
        case 1:
            return "🥪";
        case 2:
            return "🍲";
        case 3:
            return "🍎";
        default:
            return "🥞";
    }
}

export function MealType__get_Code(this$) {
    switch (this$.tag) {
        case 1:
            return "lunch";
        case 2:
            return "dinner";
        case 3:
            return "snack";
        default:
            return "breakfast";
    }
}

export const MealTypes_all = ofArray([new MealType(0, []), new MealType(1, []), new MealType(2, []), new MealType(3, [])]);

export function MealTypes_fromCode(code) {
    return defaultArg(tryFind((m) => (MealType__get_Code(m) === code), MealTypes_all), new MealType(1, []));
}

export class FoodCategory extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Vegetarian", "Vegan", "Meat", "Fish", "Pasta", "Salad", "Soup", "Dessert", "Quick", "Other"];
    }
}

export function FoodCategory_$reflection() {
    return union_type("MealPlanner.Types.FoodCategory", [], FoodCategory, () => [[], [], [], [], [], [], [], [], [], []]);
}

export function FoodCategory__get_Label(this$) {
    switch (this$.tag) {
        case 1:
            return "Vegan";
        case 2:
            return "Meat";
        case 3:
            return "Fish";
        case 4:
            return "Pasta";
        case 5:
            return "Salad";
        case 6:
            return "Soup";
        case 7:
            return "Dessert";
        case 8:
            return "Quick & Easy";
        case 9:
            return "Other";
        default:
            return "Vegetarian";
    }
}

export function FoodCategory__get_Icon(this$) {
    switch (this$.tag) {
        case 1:
            return "🌱";
        case 2:
            return "🍖";
        case 3:
            return "🐟";
        case 4:
            return "🍝";
        case 5:
            return "🥗";
        case 6:
            return "🍜";
        case 7:
            return "🍰";
        case 8:
            return "⚡";
        case 9:
            return "🍽️";
        default:
            return "🥦";
    }
}

export function FoodCategory__get_Code(this$) {
    switch (this$.tag) {
        case 1:
            return "vegan";
        case 2:
            return "meat";
        case 3:
            return "fish";
        case 4:
            return "pasta";
        case 5:
            return "salad";
        case 6:
            return "soup";
        case 7:
            return "dessert";
        case 8:
            return "quick";
        case 9:
            return "other";
        default:
            return "vegetarian";
    }
}

export const FoodCategories_all = ofArray([new FoodCategory(0, []), new FoodCategory(1, []), new FoodCategory(2, []), new FoodCategory(3, []), new FoodCategory(4, []), new FoodCategory(5, []), new FoodCategory(6, []), new FoodCategory(7, []), new FoodCategory(8, []), new FoodCategory(9, [])]);

export function FoodCategories_fromCode(c) {
    return defaultArg(tryFind((f) => (FoodCategory__get_Code(f) === c), FoodCategories_all), new FoodCategory(9, []));
}

export class MeasureUnit extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Grams", "Kilograms", "Milliliters", "Liters", "Tablespoon", "Teaspoon", "Cup", "Piece", "Slice"];
    }
}

export function MeasureUnit_$reflection() {
    return union_type("MealPlanner.Types.MeasureUnit", [], MeasureUnit, () => [[], [], [], [], [], [], [], [], []]);
}

export function MeasureUnit__get_Abbrev(this$) {
    switch (this$.tag) {
        case 1:
            return "kg";
        case 2:
            return "ml";
        case 3:
            return "L";
        case 4:
            return "tbsp";
        case 5:
            return "tsp";
        case 6:
            return "cup";
        case 7:
            return "pc";
        case 8:
            return "slice";
        default:
            return "g";
    }
}

export function MeasureUnit__get_Code(this$) {
    switch (this$.tag) {
        case 1:
            return "kg";
        case 2:
            return "ml";
        case 3:
            return "L";
        case 4:
            return "tbsp";
        case 5:
            return "tsp";
        case 6:
            return "cup";
        case 7:
            return "pc";
        case 8:
            return "slice";
        default:
            return "g";
    }
}

export const MeasureUnits_all = ofArray([new MeasureUnit(0, []), new MeasureUnit(1, []), new MeasureUnit(2, []), new MeasureUnit(3, []), new MeasureUnit(4, []), new MeasureUnit(5, []), new MeasureUnit(6, []), new MeasureUnit(7, []), new MeasureUnit(8, [])]);

export function MeasureUnits_fromCode(c) {
    return defaultArg(tryFind((u) => (MeasureUnit__get_Code(u) === c), MeasureUnits_all), new MeasureUnit(7, []));
}

export class Nutrition extends Record {
    constructor(Calories, Protein, Carbs, Fat) {
        super();
        this.Calories = Calories;
        this.Protein = Protein;
        this.Carbs = Carbs;
        this.Fat = Fat;
    }
}

export function Nutrition_$reflection() {
    return record_type("MealPlanner.Types.Nutrition", [], Nutrition, () => [["Calories", float64_type], ["Protein", float64_type], ["Carbs", float64_type], ["Fat", float64_type]]);
}

export function Nutrition_get_Zero() {
    return new Nutrition(0, 0, 0, 0);
}

export function Nutrition_op_Addition_A34CB20(a, b) {
    return new Nutrition(a.Calories + b.Calories, a.Protein + b.Protein, a.Carbs + b.Carbs, a.Fat + b.Fat);
}

export class Ingredient extends Record {
    constructor(Id, Name, Amount, Unit, GroceryCategory) {
        super();
        this.Id = Id;
        this.Name = Name;
        this.Amount = Amount;
        this.Unit = Unit;
        this.GroceryCategory = GroceryCategory;
    }
}

export function Ingredient_$reflection() {
    return record_type("MealPlanner.Types.Ingredient", [], Ingredient, () => [["Id", class_type("System.Guid")], ["Name", string_type], ["Amount", float64_type], ["Unit", MeasureUnit_$reflection()], ["GroceryCategory", string_type]]);
}

export class Recipe extends Record {
    constructor(Id, Name, Description, Category, SuitableFor, Servings, PrepTimeMinutes, CookTimeMinutes, Ingredients, Instructions, Nutrition, ImageEmoji, IsFavorite, CreatedAt) {
        super();
        this.Id = Id;
        this.Name = Name;
        this.Description = Description;
        this.Category = Category;
        this.SuitableFor = SuitableFor;
        this.Servings = (Servings | 0);
        this.PrepTimeMinutes = (PrepTimeMinutes | 0);
        this.CookTimeMinutes = (CookTimeMinutes | 0);
        this.Ingredients = Ingredients;
        this.Instructions = Instructions;
        this.Nutrition = Nutrition;
        this.ImageEmoji = ImageEmoji;
        this.IsFavorite = IsFavorite;
        this.CreatedAt = CreatedAt;
    }
}

export function Recipe_$reflection() {
    return record_type("MealPlanner.Types.Recipe", [], Recipe, () => [["Id", class_type("System.Guid")], ["Name", string_type], ["Description", string_type], ["Category", FoodCategory_$reflection()], ["SuitableFor", list_type(MealType_$reflection())], ["Servings", int32_type], ["PrepTimeMinutes", int32_type], ["CookTimeMinutes", int32_type], ["Ingredients", list_type(Ingredient_$reflection())], ["Instructions", list_type(string_type)], ["Nutrition", Nutrition_$reflection()], ["ImageEmoji", string_type], ["IsFavorite", bool_type], ["CreatedAt", class_type("System.DateTime")]]);
}

export class PlannedMeal extends Record {
    constructor(Id, RecipeId, DayOfWeek, MealType, Servings) {
        super();
        this.Id = Id;
        this.RecipeId = RecipeId;
        this.DayOfWeek = (DayOfWeek | 0);
        this.MealType = MealType;
        this.Servings = (Servings | 0);
    }
}

export function PlannedMeal_$reflection() {
    return record_type("MealPlanner.Types.PlannedMeal", [], PlannedMeal, () => [["Id", class_type("System.Guid")], ["RecipeId", class_type("System.Guid")], ["DayOfWeek", int32_type], ["MealType", MealType_$reflection()], ["Servings", int32_type]]);
}

export class WeekPlan extends Record {
    constructor(WeekStart, Meals) {
        super();
        this.WeekStart = WeekStart;
        this.Meals = Meals;
    }
}

export function WeekPlan_$reflection() {
    return record_type("MealPlanner.Types.WeekPlan", [], WeekPlan, () => [["WeekStart", class_type("System.DateTime")], ["Meals", list_type(PlannedMeal_$reflection())]]);
}

export class GroceryItem extends Record {
    constructor(Name, Amount, Unit, Category, IsChecked) {
        super();
        this.Name = Name;
        this.Amount = Amount;
        this.Unit = Unit;
        this.Category = Category;
        this.IsChecked = IsChecked;
    }
}

export function GroceryItem_$reflection() {
    return record_type("MealPlanner.Types.GroceryItem", [], GroceryItem, () => [["Name", string_type], ["Amount", float64_type], ["Unit", MeasureUnit_$reflection()], ["Category", string_type], ["IsChecked", bool_type]]);
}

export class NutritionTarget extends Record {
    constructor(Calories, Protein, Carbs, Fat) {
        super();
        this.Calories = Calories;
        this.Protein = Protein;
        this.Carbs = Carbs;
        this.Fat = Fat;
    }
}

export function NutritionTarget_$reflection() {
    return record_type("MealPlanner.Types.NutritionTarget", [], NutritionTarget, () => [["Calories", float64_type], ["Protein", float64_type], ["Carbs", float64_type], ["Fat", float64_type]]);
}

export function NutritionTarget_get_Default() {
    return new NutritionTarget(2000, 50, 250, 65);
}

export class ActiveView extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["PlannerView", "RecipeListView", "RecipeDetailView", "RecipeEditorView", "GroceryListView", "StatsView"];
    }
}

export function ActiveView_$reflection() {
    return union_type("MealPlanner.Types.ActiveView", [], ActiveView, () => [[], [], [["Item", class_type("System.Guid")]], [["Item", option_type(class_type("System.Guid"))]], [], []]);
}

export class RecipeFormState extends Record {
    constructor(Name, Description, Category, SuitableFor, Servings, PrepTime, CookTime, Ingredients, NewIngName, NewIngAmount, NewIngUnit, NewIngCategory, Instructions, NewInstruction, Calories, Protein, Carbs, Fat, ImageEmoji) {
        super();
        this.Name = Name;
        this.Description = Description;
        this.Category = Category;
        this.SuitableFor = SuitableFor;
        this.Servings = Servings;
        this.PrepTime = PrepTime;
        this.CookTime = CookTime;
        this.Ingredients = Ingredients;
        this.NewIngName = NewIngName;
        this.NewIngAmount = NewIngAmount;
        this.NewIngUnit = NewIngUnit;
        this.NewIngCategory = NewIngCategory;
        this.Instructions = Instructions;
        this.NewInstruction = NewInstruction;
        this.Calories = Calories;
        this.Protein = Protein;
        this.Carbs = Carbs;
        this.Fat = Fat;
        this.ImageEmoji = ImageEmoji;
    }
}

export function RecipeFormState_$reflection() {
    return record_type("MealPlanner.Types.RecipeFormState", [], RecipeFormState, () => [["Name", string_type], ["Description", string_type], ["Category", FoodCategory_$reflection()], ["SuitableFor", list_type(MealType_$reflection())], ["Servings", string_type], ["PrepTime", string_type], ["CookTime", string_type], ["Ingredients", list_type(Ingredient_$reflection())], ["NewIngName", string_type], ["NewIngAmount", string_type], ["NewIngUnit", MeasureUnit_$reflection()], ["NewIngCategory", string_type], ["Instructions", list_type(string_type)], ["NewInstruction", string_type], ["Calories", string_type], ["Protein", string_type], ["Carbs", string_type], ["Fat", string_type], ["ImageEmoji", string_type]]);
}

export function RecipeFormState_get_Empty() {
    return new RecipeFormState("", "", new FoodCategory(9, []), ofArray([new MealType(1, []), new MealType(2, [])]), "2", "15", "30", empty(), "", "", new MeasureUnit(0, []), "Produce", empty(), "", "", "", "", "", "🍽️");
}

export class Model extends Record {
    constructor(Recipes, WeekPlan, NutritionTarget, ActiveView, RecipeForm, GroceryChecked, SearchQuery, FilterCategory, SelectedDay, SelectedMealType) {
        super();
        this.Recipes = Recipes;
        this.WeekPlan = WeekPlan;
        this.NutritionTarget = NutritionTarget;
        this.ActiveView = ActiveView;
        this.RecipeForm = RecipeForm;
        this.GroceryChecked = GroceryChecked;
        this.SearchQuery = SearchQuery;
        this.FilterCategory = FilterCategory;
        this.SelectedDay = (SelectedDay | 0);
        this.SelectedMealType = SelectedMealType;
    }
}

export function Model_$reflection() {
    return record_type("MealPlanner.Types.Model", [], Model, () => [["Recipes", list_type(Recipe_$reflection())], ["WeekPlan", WeekPlan_$reflection()], ["NutritionTarget", NutritionTarget_$reflection()], ["ActiveView", ActiveView_$reflection()], ["RecipeForm", RecipeFormState_$reflection()], ["GroceryChecked", class_type("Microsoft.FSharp.Collections.FSharpMap`2", [string_type, bool_type])], ["SearchQuery", string_type], ["FilterCategory", option_type(FoodCategory_$reflection())], ["SelectedDay", int32_type], ["SelectedMealType", option_type(MealType_$reflection())]]);
}

export class Msg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["SetView", "AddMealToPlan", "RemoveMealFromPlan", "SetSelectedDay", "SelectMealSlot", "CancelMealSelect", "NextWeek", "PrevWeek", "SetRecipeName", "SetRecipeDesc", "SetRecipeCategory", "ToggleSuitableFor", "SetServings", "SetPrepTime", "SetCookTime", "SetNewIngName", "SetNewIngAmount", "SetNewIngUnit", "SetNewIngCategory", "AddIngredient", "RemoveIngredient", "SetNewInstruction", "AddInstruction", "RemoveInstruction", "SetCalories", "SetProtein", "SetCarbs", "SetFat", "SetImageEmoji", "SaveRecipe", "CancelRecipeEdit", "ToggleFavorite", "DeleteRecipe", "SetSearchQuery", "SetFilterCategory", "ToggleGroceryItem", "ClearCheckedItems", "SetTargetCalories", "SetTargetProtein", "SetTargetCarbs", "SetTargetFat"];
    }
}

export function Msg_$reflection() {
    return union_type("MealPlanner.Types.Msg", [], Msg, () => [[["Item", ActiveView_$reflection()]], [["recipeId", class_type("System.Guid")], ["dayOfWeek", int32_type], ["mealType", MealType_$reflection()]], [["Item", class_type("System.Guid")]], [["Item", int32_type]], [["Item1", int32_type], ["Item2", MealType_$reflection()]], [], [], [], [["Item", string_type]], [["Item", string_type]], [["Item", FoodCategory_$reflection()]], [["Item", MealType_$reflection()]], [["Item", string_type]], [["Item", string_type]], [["Item", string_type]], [["Item", string_type]], [["Item", string_type]], [["Item", MeasureUnit_$reflection()]], [["Item", string_type]], [], [["Item", class_type("System.Guid")]], [["Item", string_type]], [], [["Item", int32_type]], [["Item", string_type]], [["Item", string_type]], [["Item", string_type]], [["Item", string_type]], [["Item", string_type]], [], [], [["Item", class_type("System.Guid")]], [["Item", class_type("System.Guid")]], [["Item", string_type]], [["Item", option_type(FoodCategory_$reflection())]], [["Item", string_type]], [], [["Item", string_type]], [["Item", string_type]], [["Item", string_type]], [["Item", string_type]]]);
}

export const RecipeEmojis_all = ["🍽️", "🥞", "🥪", "🍲", "🍎", "🥦", "🍖", "🍝", "🥗", "🍜", "🍰", "🐟", "🍕", "🌮", "🥙", "🍣", "🥡", "🥐", "🥓", "🥚"];

export const GroceryCategories_all = ofArray(["Produce", "Dairy", "Meat & Fish", "Bakery", "Pantry", "Frozen", "Beverages", "Spices", "Other"]);

export const Days_labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const Days_shortLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

