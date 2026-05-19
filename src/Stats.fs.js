import { weeklyNutrition, macroPercentages, targetColor, dailyNutrition, targetPercentage } from "./NutritionCalc.fs.js";
import { createElement } from "react";
import { int32ToString, createObj } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { printf, toText } from "./fable_modules/fable-library-js.4.24.0/String.js";
import { exists, filter, length, ofArray, singleton } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { reactApi } from "./fable_modules/Feliz.2.9.0/./Interop.fs.js";
import { empty, append, singleton as singleton_1, collect, delay, toList } from "./fable_modules/fable-library-js.4.24.0/Seq.js";
import { min } from "./fable_modules/fable-library-js.4.24.0/Double.js";
import { item } from "./fable_modules/fable-library-js.4.24.0/Array.js";
import { Nutrition, Nutrition_get_Zero, Msg, Days_shortLabels } from "./Types.fs.js";
import { rangeDouble } from "./fable_modules/fable-library-js.4.24.0/Range.js";

function nutritionRing(label, value, target, unit, color) {
    let elems_3, elements_2, elements;
    const circumference = (2 * 3.141592653589793) * 36;
    const offset = circumference * (1 - (targetPercentage(value, target) / 100));
    const size = (36 + 5) * 2;
    const center = 36 + 5;
    return createElement("div", createObj(ofArray([["className", "nut-ring"], (elems_3 = [createElement("svg", createObj(ofArray([["width", ~~size], ["height", ~~size], ["viewBox", (((((0 + " ") + 0) + " ") + ~~size) + " ") + ~~size], (elements_2 = ofArray([createElement("circle", {
        cx: center,
        cy: center,
        r: 36,
        fill: "none",
        stroke: "rgba(255,255,255,0.06)",
        strokeWidth: 5,
    }), createElement("circle", {
        cx: center,
        cy: center,
        r: 36,
        fill: "none",
        stroke: color,
        strokeWidth: 5,
        strokeLinecap: "round",
        strokeDasharray: toText(printf("%g %g"))(circumference)(circumference),
        strokeDashoffset: offset,
        transform: toText(printf("rotate(-90 %g %g)"))(center)(center),
    }), createElement("text", createObj(ofArray([["x", center], ["y", center - 4], ["fill", "white"], ["fontSize", 13], ["fontWeight", "bold"], ["textAnchor", "middle"], ["dominantBaseline", "central"], (elements = singleton(toText(printf("%.0f"))(value)), ["children", reactApi.Children.toArray(Array.from(elements))])]))), createElement("text", {
        x: center,
        y: center + 12,
        fill: "rgba(255,255,255,0.5)",
        fontSize: 9,
        textAnchor: "middle",
        dominantBaseline: "central",
        children: reactApi.Children.toArray([unit]),
    })]), ["children", reactApi.Children.toArray(Array.from(elements_2))])]))), createElement("div", {
        className: "nut-ring-label",
        children: label,
    })], ["children", reactApi.Children.toArray(Array.from(elems_3))])])));
}

function weeklyChart(recipes, meals, target) {
    let elems_3, elems_2;
    return createElement("div", createObj(ofArray([["className", "weekly-chart"], (elems_3 = [createElement("h3", {
        children: "Daily Calories",
    }), createElement("div", createObj(ofArray([["className", "weekly-bars"], (elems_2 = toList(delay(() => collect((day) => {
        let elems_1, elems;
        const dayNut = dailyNutrition(recipes, meals, day);
        const pct = targetPercentage(dayNut.Calories, target.Calories);
        return singleton_1(createElement("div", createObj(ofArray([["className", "weekly-bar-col"], (elems_1 = [createElement("div", {
            className: "weekly-bar-value",
            children: (dayNut.Calories > 0) ? toText(printf("%.0f"))(dayNut.Calories) : "",
        }), createElement("div", createObj(ofArray([["className", "weekly-bar-track"], (elems = [createElement("div", {
            className: "weekly-bar-fill",
            style: {
                height: min(pct, 100) + "%",
                backgroundColor: targetColor(dayNut.Calories, target.Calories),
            },
        }), createElement("div", {
            className: "target-line",
        })], ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("span", {
            className: "weekly-bar-label",
            children: item(day, Days_shortLabels),
        })], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))));
    }, rangeDouble(0, 1, 6)))), ["children", reactApi.Children.toArray(Array.from(elems_2))])])))], ["children", reactApi.Children.toArray(Array.from(elems_3))])])));
}

function macroBar(nutrition) {
    let elems_5, elems, elems_4, elems_1, elems_2, elems_3;
    const patternInput = macroPercentages(nutrition);
    const protPct = patternInput[0];
    const fatPct = patternInput[2];
    const carbPct = patternInput[1];
    return createElement("div", createObj(ofArray([["className", "macro-section"], (elems_5 = [createElement("h3", {
        children: "Macro Distribution",
    }), createElement("div", createObj(ofArray([["className", "macro-bar"], (elems = toList(delay(() => append((protPct > 0) ? singleton_1(createElement("div", {
        className: "macro-seg protein",
        style: {
            width: protPct + "%",
        },
    })) : empty(), delay(() => append((carbPct > 0) ? singleton_1(createElement("div", {
        className: "macro-seg carbs",
        style: {
            width: carbPct + "%",
        },
    })) : empty(), delay(() => ((fatPct > 0) ? singleton_1(createElement("div", {
        className: "macro-seg fat",
        style: {
            width: fatPct + "%",
        },
    })) : empty()))))))), ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("div", createObj(ofArray([["className", "macro-legend"], (elems_4 = [createElement("span", createObj(ofArray([["className", "macro-legend-item"], (elems_1 = [createElement("span", {
        className: "macro-dot protein",
    }), toText(printf("Protein %.0f%%"))(protPct)], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))), createElement("span", createObj(ofArray([["className", "macro-legend-item"], (elems_2 = [createElement("span", {
        className: "macro-dot carbs",
    }), toText(printf("Carbs %.0f%%"))(carbPct)], ["children", reactApi.Children.toArray(Array.from(elems_2))])]))), createElement("span", createObj(ofArray([["className", "macro-legend-item"], (elems_3 = [createElement("span", {
        className: "macro-dot fat",
    }), toText(printf("Fat %.0f%%"))(fatPct)], ["children", reactApi.Children.toArray(Array.from(elems_3))])])))], ["children", reactApi.Children.toArray(Array.from(elems_4))])])))], ["children", reactApi.Children.toArray(Array.from(elems_5))])])));
}

function targetSettings(target, dispatch) {
    let elems_5, elems_4, elems, elems_1, elems_2, elems_3;
    return createElement("div", createObj(ofArray([["className", "target-settings"], (elems_5 = [createElement("h3", {
        children: "Daily Targets",
    }), createElement("div", createObj(ofArray([["className", "target-grid"], (elems_4 = [createElement("div", createObj(ofArray([["className", "target-field"], (elems = [createElement("label", {
        children: "Calories",
    }), createElement("input", {
        className: "text-input small-input",
        type: "number",
        value: int32ToString(~~target.Calories),
        onChange: (ev) => {
            dispatch(new Msg(37, [ev.target.value]));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("div", createObj(ofArray([["className", "target-field"], (elems_1 = [createElement("label", {
        children: "Protein (g)",
    }), createElement("input", {
        className: "text-input small-input",
        type: "number",
        value: int32ToString(~~target.Protein),
        onChange: (ev_1) => {
            dispatch(new Msg(38, [ev_1.target.value]));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))), createElement("div", createObj(ofArray([["className", "target-field"], (elems_2 = [createElement("label", {
        children: "Carbs (g)",
    }), createElement("input", {
        className: "text-input small-input",
        type: "number",
        value: int32ToString(~~target.Carbs),
        onChange: (ev_2) => {
            dispatch(new Msg(39, [ev_2.target.value]));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_2))])]))), createElement("div", createObj(ofArray([["className", "target-field"], (elems_3 = [createElement("label", {
        children: "Fat (g)",
    }), createElement("input", {
        className: "text-input small-input",
        type: "number",
        value: int32ToString(~~target.Fat),
        onChange: (ev_3) => {
            dispatch(new Msg(40, [ev_3.target.value]));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_3))])])))], ["children", reactApi.Children.toArray(Array.from(elems_4))])])))], ["children", reactApi.Children.toArray(Array.from(elems_5))])])));
}

/**
 * Main stats view
 */
export function view(model, dispatch) {
    let elems_6;
    const weekNut = weeklyNutrition(model.Recipes, model.WeekPlan.Meals);
    let avgDaily;
    const daysWithMeals = length(filter((d) => exists((m) => (m.DayOfWeek === d), model.WeekPlan.Meals), toList(rangeDouble(0, 1, 6)))) | 0;
    avgDaily = ((daysWithMeals === 0) ? Nutrition_get_Zero() : (new Nutrition(weekNut.Calories / daysWithMeals, weekNut.Protein / daysWithMeals, weekNut.Carbs / daysWithMeals, weekNut.Fat / daysWithMeals)));
    return createElement("div", createObj(ofArray([["className", "stats-page"], (elems_6 = toList(delay(() => append(singleton_1(createElement("h2", {
        children: "Nutrition Overview",
    })), delay(() => {
        let elems;
        return append(singleton_1(createElement("div", createObj(ofArray([["className", "nut-rings"], (elems = [nutritionRing("Calories", avgDaily.Calories, model.NutritionTarget.Calories, "kcal", "#ef4444"), nutritionRing("Protein", avgDaily.Protein, model.NutritionTarget.Protein, "g", "#3b82f6"), nutritionRing("Carbs", avgDaily.Carbs, model.NutritionTarget.Carbs, "g", "#f59e0b"), nutritionRing("Fat", avgDaily.Fat, model.NutritionTarget.Fat, "g", "#22c55e")], ["children", reactApi.Children.toArray(Array.from(elems))])])))), delay(() => append(singleton_1(createElement("p", {
            className: "stats-subtitle",
            children: "Daily average for this week",
        })), delay(() => append(singleton_1(weeklyChart(model.Recipes, model.WeekPlan.Meals, model.NutritionTarget)), delay(() => append((weekNut.Calories > 0) ? singleton_1(macroBar(avgDaily)) : empty(), delay(() => append(singleton_1(targetSettings(model.NutritionTarget, dispatch)), delay(() => {
            let elems_5, elems_4, elems_1, elems_2, elems_3;
            return singleton_1(createElement("div", createObj(ofArray([["className", "week-summary"], (elems_5 = [createElement("h3", {
                children: "Week Total",
            }), createElement("div", createObj(ofArray([["className", "summary-grid"], (elems_4 = [createElement("div", createObj(ofArray([["className", "summary-item"], (elems_1 = [createElement("span", {
                className: "summary-val",
                children: toText(printf("%.0f"))(weekNut.Calories),
            }), createElement("span", {
                className: "summary-label",
                children: "Total kcal",
            })], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))), createElement("div", createObj(ofArray([["className", "summary-item"], (elems_2 = [createElement("span", {
                className: "summary-val",
                children: int32ToString(length(model.WeekPlan.Meals)),
            }), createElement("span", {
                className: "summary-label",
                children: "Meals planned",
            })], ["children", reactApi.Children.toArray(Array.from(elems_2))])]))), createElement("div", createObj(ofArray([["className", "summary-item"], (elems_3 = [createElement("span", {
                className: "summary-val",
                children: int32ToString(length(model.Recipes)),
            }), createElement("span", {
                className: "summary-label",
                children: "Recipes",
            })], ["children", reactApi.Children.toArray(Array.from(elems_3))])])))], ["children", reactApi.Children.toArray(Array.from(elems_4))])])))], ["children", reactApi.Children.toArray(Array.from(elems_5))])]))));
        }))))))))));
    })))), ["children", reactApi.Children.toArray(Array.from(elems_6))])])));
}

