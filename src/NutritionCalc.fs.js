import { fold, filter, map, tryFind } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { Nutrition_op_Addition_A34CB20, Nutrition, Nutrition_get_Zero } from "./Types.fs.js";
import { min, max } from "./fable_modules/fable-library-js.4.24.0/Double.js";
import { printf, toText } from "./fable_modules/fable-library-js.4.24.0/String.js";

/**
 * Calculate nutrition for a planned meal (adjusting for servings)
 */
export function mealNutrition(recipes, meal) {
    const matchValue = tryFind((r) => (r.Id === meal.RecipeId), recipes);
    if (matchValue == null) {
        return Nutrition_get_Zero();
    }
    else {
        const recipe = matchValue;
        const factor = meal.Servings / max(1, recipe.Servings);
        return new Nutrition(recipe.Nutrition.Calories * factor, recipe.Nutrition.Protein * factor, recipe.Nutrition.Carbs * factor, recipe.Nutrition.Fat * factor);
    }
}

/**
 * Calculate total nutrition for a day
 */
export function dailyNutrition(recipes, meals, dayOfWeek) {
    const list_2 = map((meal) => mealNutrition(recipes, meal), filter((m) => (m.DayOfWeek === dayOfWeek), meals));
    return fold(Nutrition_op_Addition_A34CB20, Nutrition_get_Zero(), list_2);
}

/**
 * Calculate total nutrition for the week
 */
export function weeklyNutrition(recipes, meals) {
    const list_1 = map((meal) => mealNutrition(recipes, meal), meals);
    return fold(Nutrition_op_Addition_A34CB20, Nutrition_get_Zero(), list_1);
}

/**
 * Calculate percentage of target met
 */
export function targetPercentage(actual, target) {
    if (target <= 0) {
        return 0;
    }
    else {
        return min(100, (actual / target) * 100);
    }
}

/**
 * Get a color based on how close to target (green = on target, red = over, yellow = under)
 */
export function targetColor(actual, target) {
    const pct = (actual / max(1, target)) * 100;
    if (pct > 120) {
        return "#ef4444";
    }
    else if (pct > 90) {
        return "#22c55e";
    }
    else if (pct > 60) {
        return "#f59e0b";
    }
    else {
        return "#94a3b8";
    }
}

/**
 * Format a nutrition value for display
 */
export function formatValue(value, unit) {
    if (value >= 1000) {
        return toText(printf("%.0f%s"))(value)(unit);
    }
    else if (value >= 100) {
        return toText(printf("%.0f%s"))(value)(unit);
    }
    else if (value >= 10) {
        return toText(printf("%.1f%s"))(value)(unit);
    }
    else {
        return toText(printf("%.1f%s"))(value)(unit);
    }
}

/**
 * Macro percentages for pie-chart-like display
 */
export function macroPercentages(n) {
    const proteinCal = n.Protein * 4;
    const carbsCal = n.Carbs * 4;
    const fatCal = n.Fat * 9;
    const total = (proteinCal + carbsCal) + fatCal;
    if (total === 0) {
        return [0, 0, 0];
    }
    else {
        return [(proteinCal / total) * 100, (carbsCal / total) * 100, (fatCal / total) * 100];
    }
}

