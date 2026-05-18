import { addDays, date, dayOfWeek, now } from "./fable_modules/fable-library-js.4.24.0/Date.js";
import { tryParse as tryParse_1, op_UnaryNegation_Int32 } from "./fable_modules/fable-library-js.4.24.0/Int32.js";
import { saveTarget, saveRecipes, saveWeekPlan, loadWeekPlan, loadTarget, loadRecipes } from "./Storage.fs.js";
import { defaultArg } from "./fable_modules/fable-library-js.4.24.0/Option.js";
import { ofArray, tryFind as tryFind_1, indexed, map, cons, contains, filter, singleton, append, empty } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { Msg, MeasureUnit, NutritionTarget, Recipe, Nutrition, Ingredient, RecipeFormState, PlannedMeal, Model, RecipeFormState_get_Empty, ActiveView as ActiveView_4, WeekPlan } from "./Types.fs.js";
import { add, tryFind, empty as empty_1 } from "./fable_modules/fable-library-js.4.24.0/Map.js";
import { createObj, int32ToString, safeHash, equals, comparePrimitives } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { newGuid } from "./fable_modules/fable-library-js.4.24.0/Guid.js";
import { max, tryParse } from "./fable_modules/fable-library-js.4.24.0/Double.js";
import { FSharpRef } from "./fable_modules/fable-library-js.4.24.0/Types.js";
import { createElement } from "react";
import { singleton as singleton_1, append as append_1, delay, toList } from "./fable_modules/fable-library-js.4.24.0/Seq.js";
import { reactApi } from "./fable_modules/Feliz.2.9.0/./Interop.fs.js";
import { detailView, view as view_2 } from "./RecipeLibrary.fs.js";
import { view as view_3 } from "./RecipeEditor.fs.js";
import { view as view_4 } from "./GroceryList.fs.js";
import { view as view_5 } from "./Stats.fs.js";
import { view as view_6 } from "./WeekPlanner.fs.js";

function currentWeekMonday() {
    const today = now();
    const diff = ((dayOfWeek(today) + 6) % 7) | 0;
    return date(addDays(today, op_UnaryNegation_Int32(diff)));
}

export function init() {
    const recipes = loadRecipes();
    const target = loadTarget();
    const weekPlan = defaultArg(loadWeekPlan(), new WeekPlan(currentWeekMonday(), empty()));
    return new Model(recipes, weekPlan, target, new ActiveView_4(0, []), RecipeFormState_get_Empty(), empty_1({
        Compare: comparePrimitives,
    }), "", undefined, 0, undefined);
}

export function update(msg, model) {
    let bind$0040_2, bind$0040_3, bind$0040_4, bind$0040_5, bind$0040_6, bind$0040_7, bind$0040_8, bind$0040_9, bind$0040_10, bind$0040_11, bind$0040_12, bind$0040_13, bind$0040_14, bind$0040_15, bind$0040_16, bind$0040_17, bind$0040_18, bind$0040_19, bind$0040_20, bind$0040_21, bind$0040_22, matchValue_2, outArg_1, v_16, matchValue_3, outArg_2, v_18, matchValue_4, outArg_3, v_20, matchValue_5, outArg_4, v_22, matchValue_10, outArg_8, x_2, matchValue_11, outArg_9, x_3, matchValue_12, outArg_10, x_4, matchValue_13, outArg_11, x_5;
    switch (msg.tag) {
        case 1: {
            const recipeId = msg.fields[0];
            const mealType = msg.fields[2];
            const day = msg.fields[1] | 0;
            const meal = new PlannedMeal(newGuid(), recipeId, day, mealType, 1);
            const newPlan = new WeekPlan(model.WeekPlan.WeekStart, append(model.WeekPlan.Meals, singleton(meal)));
            saveWeekPlan(newPlan);
            return new Model(model.Recipes, newPlan, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, undefined);
        }
        case 2: {
            const id_1 = msg.fields[0];
            const newPlan_1 = new WeekPlan(model.WeekPlan.WeekStart, filter((m) => (m.Id !== id_1), model.WeekPlan.Meals));
            saveWeekPlan(newPlan_1);
            return new Model(model.Recipes, newPlan_1, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 3: {
            const d = msg.fields[0] | 0;
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, d, model.SelectedMealType);
        }
        case 4: {
            const mealType_1 = msg.fields[1];
            const day_1 = msg.fields[0] | 0;
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, day_1, mealType_1);
        }
        case 5:
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, undefined);
        case 6: {
            const newStart = addDays(model.WeekPlan.WeekStart, 7);
            const newPlan_2 = new WeekPlan(newStart, empty());
            saveWeekPlan(newPlan_2);
            return new Model(model.Recipes, newPlan_2, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 7: {
            const newStart_1 = addDays(model.WeekPlan.WeekStart, -7);
            const newPlan_3 = new WeekPlan(newStart_1, empty());
            saveWeekPlan(newPlan_3);
            return new Model(model.Recipes, newPlan_3, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 8: {
            const v = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_2 = model.RecipeForm, new RecipeFormState(v, bind$0040_2.Description, bind$0040_2.Category, bind$0040_2.SuitableFor, bind$0040_2.Servings, bind$0040_2.PrepTime, bind$0040_2.CookTime, bind$0040_2.Ingredients, bind$0040_2.NewIngName, bind$0040_2.NewIngAmount, bind$0040_2.NewIngUnit, bind$0040_2.NewIngCategory, bind$0040_2.Instructions, bind$0040_2.NewInstruction, bind$0040_2.Calories, bind$0040_2.Protein, bind$0040_2.Carbs, bind$0040_2.Fat, bind$0040_2.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 9: {
            const v_1 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_3 = model.RecipeForm, new RecipeFormState(bind$0040_3.Name, v_1, bind$0040_3.Category, bind$0040_3.SuitableFor, bind$0040_3.Servings, bind$0040_3.PrepTime, bind$0040_3.CookTime, bind$0040_3.Ingredients, bind$0040_3.NewIngName, bind$0040_3.NewIngAmount, bind$0040_3.NewIngUnit, bind$0040_3.NewIngCategory, bind$0040_3.Instructions, bind$0040_3.NewInstruction, bind$0040_3.Calories, bind$0040_3.Protein, bind$0040_3.Carbs, bind$0040_3.Fat, bind$0040_3.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 10: {
            const c = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_4 = model.RecipeForm, new RecipeFormState(bind$0040_4.Name, bind$0040_4.Description, c, bind$0040_4.SuitableFor, bind$0040_4.Servings, bind$0040_4.PrepTime, bind$0040_4.CookTime, bind$0040_4.Ingredients, bind$0040_4.NewIngName, bind$0040_4.NewIngAmount, bind$0040_4.NewIngUnit, bind$0040_4.NewIngCategory, bind$0040_4.Instructions, bind$0040_4.NewInstruction, bind$0040_4.Calories, bind$0040_4.Protein, bind$0040_4.Carbs, bind$0040_4.Fat, bind$0040_4.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 11: {
            const mt = msg.fields[0];
            const sf = contains(mt, model.RecipeForm.SuitableFor, {
                Equals: equals,
                GetHashCode: safeHash,
            }) ? filter((m_1) => !equals(m_1, mt), model.RecipeForm.SuitableFor) : cons(mt, model.RecipeForm.SuitableFor);
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_5 = model.RecipeForm, new RecipeFormState(bind$0040_5.Name, bind$0040_5.Description, bind$0040_5.Category, sf, bind$0040_5.Servings, bind$0040_5.PrepTime, bind$0040_5.CookTime, bind$0040_5.Ingredients, bind$0040_5.NewIngName, bind$0040_5.NewIngAmount, bind$0040_5.NewIngUnit, bind$0040_5.NewIngCategory, bind$0040_5.Instructions, bind$0040_5.NewInstruction, bind$0040_5.Calories, bind$0040_5.Protein, bind$0040_5.Carbs, bind$0040_5.Fat, bind$0040_5.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 12: {
            const v_2 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_6 = model.RecipeForm, new RecipeFormState(bind$0040_6.Name, bind$0040_6.Description, bind$0040_6.Category, bind$0040_6.SuitableFor, v_2, bind$0040_6.PrepTime, bind$0040_6.CookTime, bind$0040_6.Ingredients, bind$0040_6.NewIngName, bind$0040_6.NewIngAmount, bind$0040_6.NewIngUnit, bind$0040_6.NewIngCategory, bind$0040_6.Instructions, bind$0040_6.NewInstruction, bind$0040_6.Calories, bind$0040_6.Protein, bind$0040_6.Carbs, bind$0040_6.Fat, bind$0040_6.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 13: {
            const v_3 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_7 = model.RecipeForm, new RecipeFormState(bind$0040_7.Name, bind$0040_7.Description, bind$0040_7.Category, bind$0040_7.SuitableFor, bind$0040_7.Servings, v_3, bind$0040_7.CookTime, bind$0040_7.Ingredients, bind$0040_7.NewIngName, bind$0040_7.NewIngAmount, bind$0040_7.NewIngUnit, bind$0040_7.NewIngCategory, bind$0040_7.Instructions, bind$0040_7.NewInstruction, bind$0040_7.Calories, bind$0040_7.Protein, bind$0040_7.Carbs, bind$0040_7.Fat, bind$0040_7.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 14: {
            const v_4 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_8 = model.RecipeForm, new RecipeFormState(bind$0040_8.Name, bind$0040_8.Description, bind$0040_8.Category, bind$0040_8.SuitableFor, bind$0040_8.Servings, bind$0040_8.PrepTime, v_4, bind$0040_8.Ingredients, bind$0040_8.NewIngName, bind$0040_8.NewIngAmount, bind$0040_8.NewIngUnit, bind$0040_8.NewIngCategory, bind$0040_8.Instructions, bind$0040_8.NewInstruction, bind$0040_8.Calories, bind$0040_8.Protein, bind$0040_8.Carbs, bind$0040_8.Fat, bind$0040_8.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 15: {
            const v_5 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_9 = model.RecipeForm, new RecipeFormState(bind$0040_9.Name, bind$0040_9.Description, bind$0040_9.Category, bind$0040_9.SuitableFor, bind$0040_9.Servings, bind$0040_9.PrepTime, bind$0040_9.CookTime, bind$0040_9.Ingredients, v_5, bind$0040_9.NewIngAmount, bind$0040_9.NewIngUnit, bind$0040_9.NewIngCategory, bind$0040_9.Instructions, bind$0040_9.NewInstruction, bind$0040_9.Calories, bind$0040_9.Protein, bind$0040_9.Carbs, bind$0040_9.Fat, bind$0040_9.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 16: {
            const v_6 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_10 = model.RecipeForm, new RecipeFormState(bind$0040_10.Name, bind$0040_10.Description, bind$0040_10.Category, bind$0040_10.SuitableFor, bind$0040_10.Servings, bind$0040_10.PrepTime, bind$0040_10.CookTime, bind$0040_10.Ingredients, bind$0040_10.NewIngName, v_6, bind$0040_10.NewIngUnit, bind$0040_10.NewIngCategory, bind$0040_10.Instructions, bind$0040_10.NewInstruction, bind$0040_10.Calories, bind$0040_10.Protein, bind$0040_10.Carbs, bind$0040_10.Fat, bind$0040_10.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 17: {
            const u = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_11 = model.RecipeForm, new RecipeFormState(bind$0040_11.Name, bind$0040_11.Description, bind$0040_11.Category, bind$0040_11.SuitableFor, bind$0040_11.Servings, bind$0040_11.PrepTime, bind$0040_11.CookTime, bind$0040_11.Ingredients, bind$0040_11.NewIngName, bind$0040_11.NewIngAmount, u, bind$0040_11.NewIngCategory, bind$0040_11.Instructions, bind$0040_11.NewInstruction, bind$0040_11.Calories, bind$0040_11.Protein, bind$0040_11.Carbs, bind$0040_11.Fat, bind$0040_11.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 18: {
            const c_1 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_12 = model.RecipeForm, new RecipeFormState(bind$0040_12.Name, bind$0040_12.Description, bind$0040_12.Category, bind$0040_12.SuitableFor, bind$0040_12.Servings, bind$0040_12.PrepTime, bind$0040_12.CookTime, bind$0040_12.Ingredients, bind$0040_12.NewIngName, bind$0040_12.NewIngAmount, bind$0040_12.NewIngUnit, c_1, bind$0040_12.Instructions, bind$0040_12.NewInstruction, bind$0040_12.Calories, bind$0040_12.Protein, bind$0040_12.Carbs, bind$0040_12.Fat, bind$0040_12.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 19: {
            const name = model.RecipeForm.NewIngName.trim();
            if (name === "") {
                return model;
            }
            else {
                let amount;
                let matchValue_1;
                let outArg = 0;
                matchValue_1 = [tryParse(model.RecipeForm.NewIngAmount, new FSharpRef(() => outArg, (v_7) => {
                    outArg = v_7;
                })), outArg];
                if (matchValue_1[0]) {
                    const v_8 = matchValue_1[1];
                    amount = v_8;
                }
                else {
                    amount = 1;
                }
                const ing = new Ingredient(newGuid(), name, amount, model.RecipeForm.NewIngUnit, model.RecipeForm.NewIngCategory);
                return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_13 = model.RecipeForm, new RecipeFormState(bind$0040_13.Name, bind$0040_13.Description, bind$0040_13.Category, bind$0040_13.SuitableFor, bind$0040_13.Servings, bind$0040_13.PrepTime, bind$0040_13.CookTime, append(model.RecipeForm.Ingredients, singleton(ing)), "", "", bind$0040_13.NewIngUnit, bind$0040_13.NewIngCategory, bind$0040_13.Instructions, bind$0040_13.NewInstruction, bind$0040_13.Calories, bind$0040_13.Protein, bind$0040_13.Carbs, bind$0040_13.Fat, bind$0040_13.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
            }
        }
        case 20: {
            const id_2 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_14 = model.RecipeForm, new RecipeFormState(bind$0040_14.Name, bind$0040_14.Description, bind$0040_14.Category, bind$0040_14.SuitableFor, bind$0040_14.Servings, bind$0040_14.PrepTime, bind$0040_14.CookTime, filter((i) => (i.Id !== id_2), model.RecipeForm.Ingredients), bind$0040_14.NewIngName, bind$0040_14.NewIngAmount, bind$0040_14.NewIngUnit, bind$0040_14.NewIngCategory, bind$0040_14.Instructions, bind$0040_14.NewInstruction, bind$0040_14.Calories, bind$0040_14.Protein, bind$0040_14.Carbs, bind$0040_14.Fat, bind$0040_14.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 21: {
            const v_9 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_15 = model.RecipeForm, new RecipeFormState(bind$0040_15.Name, bind$0040_15.Description, bind$0040_15.Category, bind$0040_15.SuitableFor, bind$0040_15.Servings, bind$0040_15.PrepTime, bind$0040_15.CookTime, bind$0040_15.Ingredients, bind$0040_15.NewIngName, bind$0040_15.NewIngAmount, bind$0040_15.NewIngUnit, bind$0040_15.NewIngCategory, bind$0040_15.Instructions, v_9, bind$0040_15.Calories, bind$0040_15.Protein, bind$0040_15.Carbs, bind$0040_15.Fat, bind$0040_15.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 22: {
            const inst = model.RecipeForm.NewInstruction.trim();
            if (inst === "") {
                return model;
            }
            else {
                return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_16 = model.RecipeForm, new RecipeFormState(bind$0040_16.Name, bind$0040_16.Description, bind$0040_16.Category, bind$0040_16.SuitableFor, bind$0040_16.Servings, bind$0040_16.PrepTime, bind$0040_16.CookTime, bind$0040_16.Ingredients, bind$0040_16.NewIngName, bind$0040_16.NewIngAmount, bind$0040_16.NewIngUnit, bind$0040_16.NewIngCategory, append(model.RecipeForm.Instructions, singleton(inst)), "", bind$0040_16.Calories, bind$0040_16.Protein, bind$0040_16.Carbs, bind$0040_16.Fat, bind$0040_16.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
            }
        }
        case 23: {
            const idx = msg.fields[0] | 0;
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_17 = model.RecipeForm, new RecipeFormState(bind$0040_17.Name, bind$0040_17.Description, bind$0040_17.Category, bind$0040_17.SuitableFor, bind$0040_17.Servings, bind$0040_17.PrepTime, bind$0040_17.CookTime, bind$0040_17.Ingredients, bind$0040_17.NewIngName, bind$0040_17.NewIngAmount, bind$0040_17.NewIngUnit, bind$0040_17.NewIngCategory, map((tuple) => tuple[1], filter((tupledArg) => {
                const i_1 = tupledArg[0] | 0;
                return i_1 !== idx;
            }, indexed(model.RecipeForm.Instructions))), bind$0040_17.NewInstruction, bind$0040_17.Calories, bind$0040_17.Protein, bind$0040_17.Carbs, bind$0040_17.Fat, bind$0040_17.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 24: {
            const v_10 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_18 = model.RecipeForm, new RecipeFormState(bind$0040_18.Name, bind$0040_18.Description, bind$0040_18.Category, bind$0040_18.SuitableFor, bind$0040_18.Servings, bind$0040_18.PrepTime, bind$0040_18.CookTime, bind$0040_18.Ingredients, bind$0040_18.NewIngName, bind$0040_18.NewIngAmount, bind$0040_18.NewIngUnit, bind$0040_18.NewIngCategory, bind$0040_18.Instructions, bind$0040_18.NewInstruction, v_10, bind$0040_18.Protein, bind$0040_18.Carbs, bind$0040_18.Fat, bind$0040_18.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 25: {
            const v_11 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_19 = model.RecipeForm, new RecipeFormState(bind$0040_19.Name, bind$0040_19.Description, bind$0040_19.Category, bind$0040_19.SuitableFor, bind$0040_19.Servings, bind$0040_19.PrepTime, bind$0040_19.CookTime, bind$0040_19.Ingredients, bind$0040_19.NewIngName, bind$0040_19.NewIngAmount, bind$0040_19.NewIngUnit, bind$0040_19.NewIngCategory, bind$0040_19.Instructions, bind$0040_19.NewInstruction, bind$0040_19.Calories, v_11, bind$0040_19.Carbs, bind$0040_19.Fat, bind$0040_19.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 26: {
            const v_12 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_20 = model.RecipeForm, new RecipeFormState(bind$0040_20.Name, bind$0040_20.Description, bind$0040_20.Category, bind$0040_20.SuitableFor, bind$0040_20.Servings, bind$0040_20.PrepTime, bind$0040_20.CookTime, bind$0040_20.Ingredients, bind$0040_20.NewIngName, bind$0040_20.NewIngAmount, bind$0040_20.NewIngUnit, bind$0040_20.NewIngCategory, bind$0040_20.Instructions, bind$0040_20.NewInstruction, bind$0040_20.Calories, bind$0040_20.Protein, v_12, bind$0040_20.Fat, bind$0040_20.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 27: {
            const v_13 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_21 = model.RecipeForm, new RecipeFormState(bind$0040_21.Name, bind$0040_21.Description, bind$0040_21.Category, bind$0040_21.SuitableFor, bind$0040_21.Servings, bind$0040_21.PrepTime, bind$0040_21.CookTime, bind$0040_21.Ingredients, bind$0040_21.NewIngName, bind$0040_21.NewIngAmount, bind$0040_21.NewIngUnit, bind$0040_21.NewIngCategory, bind$0040_21.Instructions, bind$0040_21.NewInstruction, bind$0040_21.Calories, bind$0040_21.Protein, bind$0040_21.Carbs, v_13, bind$0040_21.ImageEmoji)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 28: {
            const v_14 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, (bind$0040_22 = model.RecipeForm, new RecipeFormState(bind$0040_22.Name, bind$0040_22.Description, bind$0040_22.Category, bind$0040_22.SuitableFor, bind$0040_22.Servings, bind$0040_22.PrepTime, bind$0040_22.CookTime, bind$0040_22.Ingredients, bind$0040_22.NewIngName, bind$0040_22.NewIngAmount, bind$0040_22.NewIngUnit, bind$0040_22.NewIngCategory, bind$0040_22.Instructions, bind$0040_22.NewInstruction, bind$0040_22.Calories, bind$0040_22.Protein, bind$0040_22.Carbs, bind$0040_22.Fat, v_14)), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 29: {
            const f = model.RecipeForm;
            if (f.Name.trim() === "") {
                return model;
            }
            else {
                const nutrition = new Nutrition((matchValue_2 = ((outArg_1 = 0, [tryParse(f.Calories, new FSharpRef(() => outArg_1, (v_15) => {
                    outArg_1 = v_15;
                })), outArg_1])), matchValue_2[0] ? ((v_16 = matchValue_2[1], v_16)) : 0), (matchValue_3 = ((outArg_2 = 0, [tryParse(f.Protein, new FSharpRef(() => outArg_2, (v_17) => {
                    outArg_2 = v_17;
                })), outArg_2])), matchValue_3[0] ? ((v_18 = matchValue_3[1], v_18)) : 0), (matchValue_4 = ((outArg_3 = 0, [tryParse(f.Carbs, new FSharpRef(() => outArg_3, (v_19) => {
                    outArg_3 = v_19;
                })), outArg_3])), matchValue_4[0] ? ((v_20 = matchValue_4[1], v_20)) : 0), (matchValue_5 = ((outArg_4 = 0, [tryParse(f.Fat, new FSharpRef(() => outArg_4, (v_21) => {
                    outArg_4 = v_21;
                })), outArg_4])), matchValue_5[0] ? ((v_22 = matchValue_5[1], v_22)) : 0));
                let servings;
                let matchValue_6;
                let outArg_5 = 0;
                matchValue_6 = [tryParse_1(f.Servings, 511, false, 32, new FSharpRef(() => outArg_5, (v_23) => {
                    outArg_5 = (v_23 | 0);
                })), outArg_5];
                if (matchValue_6[0]) {
                    const v_24 = matchValue_6[1] | 0;
                    servings = max(1, v_24);
                }
                else {
                    servings = 2;
                }
                let prep;
                let matchValue_7;
                let outArg_6 = 0;
                matchValue_7 = [tryParse_1(f.PrepTime, 511, false, 32, new FSharpRef(() => outArg_6, (v_25) => {
                    outArg_6 = (v_25 | 0);
                })), outArg_6];
                if (matchValue_7[0]) {
                    const v_26 = matchValue_7[1] | 0;
                    prep = v_26;
                }
                else {
                    prep = 0;
                }
                let cook;
                let matchValue_8;
                let outArg_7 = 0;
                matchValue_8 = [tryParse_1(f.CookTime, 511, false, 32, new FSharpRef(() => outArg_7, (v_27) => {
                    outArg_7 = (v_27 | 0);
                })), outArg_7];
                if (matchValue_8[0]) {
                    const v_28 = matchValue_8[1] | 0;
                    cook = v_28;
                }
                else {
                    cook = 0;
                }
                const matchValue_9 = model.ActiveView;
                let matchResult, id_3;
                if (matchValue_9.tag === 3) {
                    if (matchValue_9.fields[0] != null) {
                        matchResult = 0;
                        id_3 = matchValue_9.fields[0];
                    }
                    else {
                        matchResult = 1;
                    }
                }
                else {
                    matchResult = 1;
                }
                switch (matchResult) {
                    case 0: {
                        const newRecipes = map((r_2) => {
                            if (r_2.Id === id_3) {
                                return new Recipe(r_2.Id, f.Name.trim(), f.Description.trim(), f.Category, f.SuitableFor, servings, prep, cook, f.Ingredients, f.Instructions, nutrition, f.ImageEmoji, r_2.IsFavorite, r_2.CreatedAt);
                            }
                            else {
                                return r_2;
                            }
                        }, model.Recipes);
                        saveRecipes(newRecipes);
                        return new Model(newRecipes, model.WeekPlan, model.NutritionTarget, new ActiveView_4(1, []), RecipeFormState_get_Empty(), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
                    }
                    default: {
                        const recipe = new Recipe(newGuid(), f.Name.trim(), f.Description.trim(), f.Category, f.SuitableFor, servings, prep, cook, f.Ingredients, f.Instructions, nutrition, f.ImageEmoji, false, now());
                        const newRecipes_1 = append(model.Recipes, singleton(recipe));
                        saveRecipes(newRecipes_1);
                        return new Model(newRecipes_1, model.WeekPlan, model.NutritionTarget, new ActiveView_4(1, []), RecipeFormState_get_Empty(), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
                    }
                }
            }
        }
        case 30:
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, new ActiveView_4(1, []), RecipeFormState_get_Empty(), model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        case 31: {
            const id_4 = msg.fields[0];
            const newRecipes_2 = map((r_3) => {
                if (r_3.Id === id_4) {
                    return new Recipe(r_3.Id, r_3.Name, r_3.Description, r_3.Category, r_3.SuitableFor, r_3.Servings, r_3.PrepTimeMinutes, r_3.CookTimeMinutes, r_3.Ingredients, r_3.Instructions, r_3.Nutrition, r_3.ImageEmoji, !r_3.IsFavorite, r_3.CreatedAt);
                }
                else {
                    return r_3;
                }
            }, model.Recipes);
            saveRecipes(newRecipes_2);
            return new Model(newRecipes_2, model.WeekPlan, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 32: {
            const id_5 = msg.fields[0];
            const newRecipes_3 = filter((r_4) => (r_4.Id !== id_5), model.Recipes);
            saveRecipes(newRecipes_3);
            return new Model(newRecipes_3, model.WeekPlan, model.NutritionTarget, new ActiveView_4(1, []), model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 33: {
            const q = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, q, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 34: {
            const c_2 = msg.fields[0];
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, c_2, model.SelectedDay, model.SelectedMealType);
        }
        case 35: {
            const name_1 = msg.fields[0];
            const current = defaultArg(tryFind(name_1, model.GroceryChecked), false);
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, model.RecipeForm, add(name_1, !current, model.GroceryChecked), model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 36:
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, model.ActiveView, model.RecipeForm, empty_1({
                Compare: comparePrimitives,
            }), model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        case 37: {
            const v_29 = msg.fields[0];
            let t;
            const bind$0040_23 = model.NutritionTarget;
            t = (new NutritionTarget((matchValue_10 = ((outArg_8 = 0, [tryParse(v_29, new FSharpRef(() => outArg_8, (v_30) => {
                outArg_8 = v_30;
            })), outArg_8])), matchValue_10[0] ? ((x_2 = matchValue_10[1], x_2)) : model.NutritionTarget.Calories), bind$0040_23.Protein, bind$0040_23.Carbs, bind$0040_23.Fat));
            saveTarget(t);
            return new Model(model.Recipes, model.WeekPlan, t, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 38: {
            const v_31 = msg.fields[0];
            let t_1;
            const bind$0040_24 = model.NutritionTarget;
            t_1 = (new NutritionTarget(bind$0040_24.Calories, (matchValue_11 = ((outArg_9 = 0, [tryParse(v_31, new FSharpRef(() => outArg_9, (v_32) => {
                outArg_9 = v_32;
            })), outArg_9])), matchValue_11[0] ? ((x_3 = matchValue_11[1], x_3)) : model.NutritionTarget.Protein), bind$0040_24.Carbs, bind$0040_24.Fat));
            saveTarget(t_1);
            return new Model(model.Recipes, model.WeekPlan, t_1, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 39: {
            const v_33 = msg.fields[0];
            let t_2;
            const bind$0040_25 = model.NutritionTarget;
            t_2 = (new NutritionTarget(bind$0040_25.Calories, bind$0040_25.Protein, (matchValue_12 = ((outArg_10 = 0, [tryParse(v_33, new FSharpRef(() => outArg_10, (v_34) => {
                outArg_10 = v_34;
            })), outArg_10])), matchValue_12[0] ? ((x_4 = matchValue_12[1], x_4)) : model.NutritionTarget.Carbs), bind$0040_25.Fat));
            saveTarget(t_2);
            return new Model(model.Recipes, model.WeekPlan, t_2, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        case 40: {
            const v_35 = msg.fields[0];
            let t_3;
            const bind$0040_26 = model.NutritionTarget;
            t_3 = (new NutritionTarget(bind$0040_26.Calories, bind$0040_26.Protein, bind$0040_26.Carbs, (matchValue_13 = ((outArg_11 = 0, [tryParse(v_35, new FSharpRef(() => outArg_11, (v_36) => {
                outArg_11 = v_36;
            })), outArg_11])), matchValue_13[0] ? ((x_5 = matchValue_13[1], x_5)) : model.NutritionTarget.Fat)));
            saveTarget(t_3);
            return new Model(model.Recipes, model.WeekPlan, t_3, model.ActiveView, model.RecipeForm, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
        default: {
            const view_1 = msg.fields[0];
            let form;
            if (view_1.tag === 3) {
                if (view_1.fields[0] == null) {
                    form = RecipeFormState_get_Empty();
                }
                else {
                    const id = view_1.fields[0];
                    const matchValue = tryFind_1((r) => (r.Id === id), model.Recipes);
                    if (matchValue == null) {
                        form = RecipeFormState_get_Empty();
                    }
                    else {
                        const r_1 = matchValue;
                        form = (new RecipeFormState(r_1.Name, r_1.Description, r_1.Category, r_1.SuitableFor, int32ToString(r_1.Servings), int32ToString(r_1.PrepTimeMinutes), int32ToString(r_1.CookTimeMinutes), r_1.Ingredients, "", "", new MeasureUnit(0, []), "Produce", r_1.Instructions, "", int32ToString(~~r_1.Nutrition.Calories), int32ToString(~~r_1.Nutrition.Protein), int32ToString(~~r_1.Nutrition.Carbs), int32ToString(~~r_1.Nutrition.Fat), r_1.ImageEmoji));
                    }
                }
            }
            else {
                form = model.RecipeForm;
            }
            return new Model(model.Recipes, model.WeekPlan, model.NutritionTarget, view_1, form, model.GroceryChecked, model.SearchQuery, model.FilterCategory, model.SelectedDay, model.SelectedMealType);
        }
    }
}

function navbar(activeView, dispatch) {
    let elems_1;
    return createElement("nav", createObj(ofArray([["className", "navbar"], (elems_1 = toList(delay(() => {
        const tab = (view_1, icon, label) => {
            let elems;
            return createElement("button", createObj(ofArray([["className", equals(activeView, view_1) ? "nav-tab active" : "nav-tab"], ["onClick", (_arg) => {
                dispatch(new Msg(0, [view_1]));
            }], (elems = [createElement("span", {
                className: "nav-icon",
                children: icon,
            }), createElement("span", {
                className: "nav-label",
                children: label,
            })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
        };
        return append_1(singleton_1(tab(new ActiveView_4(0, []), "📅", "Planner")), delay(() => append_1(singleton_1(tab(new ActiveView_4(1, []), "📖", "Recipes")), delay(() => append_1(singleton_1(tab(new ActiveView_4(4, []), "🛒", "Grocery")), delay(() => singleton_1(tab(new ActiveView_4(5, []), "📊", "Nutrition"))))))));
    })), ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
}

export function view(model, dispatch) {
    let elems_2, elems, elems_1;
    return createElement("div", createObj(ofArray([["className", "app-container"], (elems_2 = [createElement("header", createObj(ofArray([["className", "app-header"], (elems = [createElement("h1", {
        children: "MealPlanner",
    }), createElement("span", {
        className: "app-subtitle",
        children: "Weekly Meal Planning",
    })], ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("main", createObj(ofArray([["className", "app-main"], (elems_1 = toList(delay(() => {
        const matchValue = model.ActiveView;
        switch (matchValue.tag) {
            case 1:
                return singleton_1(view_2(model, dispatch));
            case 2: {
                const id = matchValue.fields[0];
                return singleton_1(detailView(id)(model)(dispatch));
            }
            case 3: {
                const id_1 = matchValue.fields[0];
                return singleton_1(view_3(id_1, model, dispatch));
            }
            case 4:
                return singleton_1(view_4(model, dispatch));
            case 5:
                return singleton_1(view_5(model, dispatch));
            default:
                return singleton_1(view_6(model, dispatch));
        }
    })), ["children", reactApi.Children.toArray(Array.from(elems_1))])]))), navbar(model.ActiveView, dispatch)], ["children", reactApi.Children.toArray(Array.from(elems_2))])])));
}

