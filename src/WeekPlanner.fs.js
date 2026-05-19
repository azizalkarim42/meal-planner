import { day as day_1, toString, addDays } from "./fable_modules/fable-library-js.4.24.0/Date.js";
import { printf, toText } from "./fable_modules/fable-library-js.4.24.0/String.js";
import { contains, tryFind, ofArray, isEmpty, filter } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { safeHash, createObj, equals } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { createElement } from "react";
import { map, append, empty, collect, singleton, delay, toList } from "./fable_modules/fable-library-js.4.24.0/Seq.js";
import { MealTypes_all, MealType__get_Icon, Days_shortLabels, Days_labels, MealType__get_Label, Msg } from "./Types.fs.js";
import { reactApi } from "./fable_modules/Feliz.2.9.0/./Interop.fs.js";
import { min } from "./fable_modules/fable-library-js.4.24.0/Double.js";
import { dailyNutrition, targetColor, targetPercentage } from "./NutritionCalc.fs.js";
import { item } from "./fable_modules/fable-library-js.4.24.0/Array.js";
import { rangeDouble } from "./fable_modules/fable-library-js.4.24.0/Range.js";

function weekLabel(start) {
    const endDate = addDays(start, 6);
    const arg = toString(start, "MMM");
    const arg_1 = day_1(start) | 0;
    const arg_2 = toString(endDate, "MMM");
    const arg_3 = day_1(endDate) | 0;
    return toText(printf("%s %d - %s %d"))(arg)(arg_1)(arg_2)(arg_3);
}

function mealSlot(recipes, meals, day, mealType, dispatch) {
    let elems_2;
    const slotMeals = filter((m) => {
        if (m.DayOfWeek === day) {
            return equals(m.MealType, mealType);
        }
        else {
            return false;
        }
    }, meals);
    return createElement("div", createObj(ofArray([["className", "meal-slot"], (elems_2 = toList(delay(() => {
        let elems;
        return isEmpty(slotMeals) ? singleton(createElement("div", createObj(ofArray([["className", "meal-slot-empty"], ["onClick", (_arg) => {
            dispatch(new Msg(4, [day, mealType]));
        }], (elems = [createElement("span", {
            className: "slot-plus",
            children: "+",
        })], ["children", reactApi.Children.toArray(Array.from(elems))])])))) : collect((meal) => {
            let elems_1;
            const matchValue = tryFind((r) => (r.Id === meal.RecipeId), recipes);
            if (matchValue == null) {
                return empty();
            }
            else {
                const r_1 = matchValue;
                return singleton(createElement("div", createObj(ofArray([["className", "meal-slot-filled"], (elems_1 = [createElement("span", {
                    className: "meal-emoji",
                    children: r_1.ImageEmoji,
                }), createElement("span", {
                    className: "meal-name",
                    children: r_1.Name,
                }), createElement("button", {
                    className: "meal-remove",
                    children: "×",
                    onClick: (e) => {
                        e.stopPropagation();
                        dispatch(new Msg(2, [meal.Id]));
                    },
                })], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))));
            }
        }, slotMeals);
    })), ["children", reactApi.Children.toArray(Array.from(elems_2))])])));
}

function dayNutritionBar(nutrition, target) {
    let elems_1, elems;
    return createElement("div", createObj(ofArray([["className", "day-nutrition"], (elems_1 = [createElement("div", createObj(ofArray([["className", "day-cal-bar-track"], (elems = [createElement("div", {
        className: "day-cal-bar-fill",
        style: {
            width: min(targetPercentage(nutrition.Calories, target.Calories), 100) + "%",
            backgroundColor: targetColor(nutrition.Calories, target.Calories),
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("span", {
        className: "day-cal-text",
        children: toText(printf("%.0f / %.0f kcal"))(nutrition.Calories)(target.Calories),
    })], ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
}

function recipePicker(recipes, day, mealType, dispatch) {
    let elems_7, elems_6;
    const suitableRecipes = filter((r) => contains(mealType, r.SuitableFor, {
        Equals: equals,
        GetHashCode: safeHash,
    }), recipes);
    const otherRecipes = filter((r_1) => !contains(mealType, r_1.SuitableFor, {
        Equals: equals,
        GetHashCode: safeHash,
    }), recipes);
    return createElement("div", createObj(ofArray([["className", "picker-overlay"], ["onClick", (_arg) => {
        dispatch(new Msg(5, []));
    }], (elems_7 = [createElement("div", createObj(ofArray([["className", "picker-modal"], ["onClick", (e) => {
        e.stopPropagation();
    }], (elems_6 = toList(delay(() => {
        let arg, arg_1;
        return append(singleton(createElement("h3", {
            children: (arg = MealType__get_Label(mealType), (arg_1 = item(day, Days_labels), toText(printf("Add %s for %s"))(arg)(arg_1))),
        })), delay(() => append(isEmpty(recipes) ? singleton(createElement("p", {
            className: "empty-hint",
            children: "No recipes yet. Create one first!",
        })) : append(!isEmpty(suitableRecipes) ? append(singleton(createElement("h4", {
            className: "picker-section-label",
            children: "Recommended",
        })), delay(() => {
            let elems_2;
            return singleton(createElement("div", createObj(ofArray([["className", "picker-list"], (elems_2 = toList(delay(() => map((r_2) => {
                let elems_1, elems, arg_3;
                return createElement("div", createObj(ofArray([["className", "picker-item"], ["onClick", (_arg_1) => {
                    dispatch(new Msg(1, [r_2.Id, day, mealType]));
                }], (elems_1 = [createElement("span", {
                    className: "picker-emoji",
                    children: r_2.ImageEmoji,
                }), createElement("div", createObj(ofArray([["className", "picker-info"], (elems = [createElement("span", {
                    className: "picker-name",
                    children: r_2.Name,
                }), createElement("span", {
                    className: "picker-meta",
                    children: (arg_3 = ((r_2.PrepTimeMinutes + r_2.CookTimeMinutes) | 0), toText(printf("%.0f kcal • %d min"))(r_2.Nutrition.Calories)(arg_3)),
                })], ["children", reactApi.Children.toArray(Array.from(elems))])])))], ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
            }, suitableRecipes))), ["children", reactApi.Children.toArray(Array.from(elems_2))])]))));
        })) : empty(), delay(() => (!isEmpty(otherRecipes) ? append(singleton(createElement("h4", {
            className: "picker-section-label",
            children: "Other Recipes",
        })), delay(() => {
            let elems_5;
            return singleton(createElement("div", createObj(ofArray([["className", "picker-list"], (elems_5 = toList(delay(() => map((r_3) => {
                let elems_4, elems_3;
                return createElement("div", createObj(ofArray([["className", "picker-item"], ["onClick", (_arg_2) => {
                    dispatch(new Msg(1, [r_3.Id, day, mealType]));
                }], (elems_4 = [createElement("span", {
                    className: "picker-emoji",
                    children: r_3.ImageEmoji,
                }), createElement("div", createObj(ofArray([["className", "picker-info"], (elems_3 = [createElement("span", {
                    className: "picker-name",
                    children: r_3.Name,
                }), createElement("span", {
                    className: "picker-meta",
                    children: toText(printf("%.0f kcal"))(r_3.Nutrition.Calories),
                })], ["children", reactApi.Children.toArray(Array.from(elems_3))])])))], ["children", reactApi.Children.toArray(Array.from(elems_4))])])));
            }, otherRecipes))), ["children", reactApi.Children.toArray(Array.from(elems_5))])]))));
        })) : empty()))), delay(() => singleton(createElement("button", {
            className: "btn btn-secondary",
            children: "Cancel",
            onClick: (_arg_3) => {
                dispatch(new Msg(5, []));
            },
        }))))));
    })), ["children", reactApi.Children.toArray(Array.from(elems_6))])])))], ["children", reactApi.Children.toArray(Array.from(elems_7))])])));
}

/**
 * Main week planner view
 */
export function view(model, dispatch) {
    let elems_3;
    return createElement("div", createObj(ofArray([["className", "planner-page"], (elems_3 = toList(delay(() => {
        let elems;
        return append(singleton(createElement("div", createObj(ofArray([["className", "week-nav"], (elems = [createElement("button", {
            className: "btn btn-secondary btn-small",
            children: "←",
            onClick: (_arg) => {
                dispatch(new Msg(7, []));
            },
        }), createElement("h2", {
            className: "week-title",
            children: weekLabel(model.WeekPlan.WeekStart),
        }), createElement("button", {
            className: "btn btn-secondary btn-small",
            children: "→",
            onClick: (_arg_1) => {
                dispatch(new Msg(6, []));
            },
        })], ["children", reactApi.Children.toArray(Array.from(elems))])])))), delay(() => {
            let elems_2;
            return append(singleton(createElement("div", createObj(ofArray([["className", "planner-grid"], (elems_2 = toList(delay(() => collect((day) => {
                let elems_1;
                const dayNut = dailyNutrition(model.Recipes, model.WeekPlan.Meals, day);
                return singleton(createElement("div", createObj(ofArray([["className", (day === model.SelectedDay) ? "day-column selected" : "day-column"], (elems_1 = toList(delay(() => append(singleton(createElement("div", {
                    className: "day-header",
                    children: item(day, Days_shortLabels),
                })), delay(() => append(singleton(dayNutritionBar(dayNut, model.NutritionTarget)), delay(() => collect((mt) => {
                    let arg;
                    return append(singleton(createElement("div", {
                        className: "meal-type-label",
                        children: (arg = MealType__get_Icon(mt), toText(printf("%s"))(arg)),
                    })), delay(() => singleton(mealSlot(model.Recipes, model.WeekPlan.Meals, day, mt, dispatch))));
                }, MealTypes_all))))))), ["children", reactApi.Children.toArray(Array.from(elems_1))])]))));
            }, rangeDouble(0, 1, 6)))), ["children", reactApi.Children.toArray(Array.from(elems_2))])])))), delay(() => {
                const matchValue = model.SelectedMealType;
                if (matchValue == null) {
                    return empty();
                }
                else {
                    return singleton(recipePicker(model.Recipes, model.SelectedDay, matchValue, dispatch));
                }
            }));
        }));
    })), ["children", reactApi.Children.toArray(Array.from(elems_3))])])));
}

