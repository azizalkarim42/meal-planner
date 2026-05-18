import { isEmpty, filter, length, cons, ofArray, tryFind, choose, concat, sumBy, map, sortBy } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { join, printf, toText, substring } from "./fable_modules/fable-library-js.4.24.0/String.js";
import { MeasureUnit__get_Abbrev, Msg, GroceryItem } from "./Types.fs.js";
import { List_groupBy } from "./fable_modules/fable-library-js.4.24.0/Seq2.js";
import { defaultArg, map as map_1 } from "./fable_modules/fable-library-js.4.24.0/Option.js";
import { max } from "./fable_modules/fable-library-js.4.24.0/Double.js";
import { stringHash, createObj, compareArrays, arrayHash, equalArrays } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { createElement } from "react";
import { reactApi } from "./fable_modules/Feliz.2.9.0/./Interop.fs.js";
import { tryFind as tryFind_1 } from "./fable_modules/fable-library-js.4.24.0/Map.js";
import { collect, empty, singleton, append, delay, toList } from "./fable_modules/fable-library-js.4.24.0/Seq.js";

/**
 * Aggregate ingredients from all planned meals into a grocery list
 */
export function generateGroceryList(recipes, meals) {
    return sortBy((item) => [item.Category, item.Name], map((tupledArg_1) => {
        const _arg_1 = tupledArg_1[0];
        const items = tupledArg_1[1];
        const unit_1 = _arg_1[1];
        const name_1 = _arg_1[0];
        const cat_1 = _arg_1[2];
        const totalAmount = sumBy((tupledArg_2) => {
            const amt = tupledArg_2[3];
            return amt;
        }, items, {
            GetZero: () => 0,
            Add: (x_1, y_1) => (x_1 + y_1),
        });
        return new GroceryItem(substring(name_1, 0, 1).toLocaleUpperCase() + substring(name_1, 1), totalAmount, unit_1, cat_1, false);
    }, List_groupBy((tupledArg) => {
        const name = tupledArg[0];
        const unit = tupledArg[1];
        const cat = tupledArg[2];
        return [name, unit, cat];
    }, concat(choose((meal) => map_1((r_1) => {
        const factor = meal.Servings / max(1, r_1.Servings);
        return map((ing) => [ing.Name.toLocaleLowerCase(), ing.Unit, ing.GroceryCategory, ing.Amount * factor], r_1.Ingredients);
    }, tryFind((r) => (r.Id === meal.RecipeId), recipes)), meals)), {
        Equals: equalArrays,
        GetHashCode: arrayHash,
    })), {
        Compare: compareArrays,
    });
}

function groceryItem(item, isChecked, dispatch) {
    let elems_1, elems, arg_1;
    return createElement("div", createObj(ofArray([["className", isChecked ? "grocery-item checked" : "grocery-item"], ["onClick", (_arg) => {
        dispatch(new Msg(35, [item.Name]));
    }], (elems_1 = [createElement("div", {
        className: "grocery-checkbox",
        children: isChecked ? "☑" : "☐",
    }), createElement("div", createObj(ofArray([["className", "grocery-info"], (elems = [createElement("span", {
        className: "grocery-name",
        children: item.Name,
    }), createElement("span", {
        className: "grocery-amount",
        children: (arg_1 = MeasureUnit__get_Abbrev(item.Unit), toText(printf("%.0f %s"))(item.Amount)(arg_1)),
    })], ["children", reactApi.Children.toArray(Array.from(elems))])])))], ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
}

function copyToClipboard(items) {
    const text = join("\n\n", map((tupledArg) => {
        const cat = tupledArg[0];
        const items_1 = tupledArg[1];
        const header = toText(printf("== %s =="))(cat);
        const lines = map((i_1) => {
            const arg_2 = MeasureUnit__get_Abbrev(i_1.Unit);
            return toText(printf("  [ ] %.0f %s %s"))(i_1.Amount)(arg_2)(i_1.Name);
        }, items_1);
        return join("\n", cons(header, lines));
    }, List_groupBy((i) => i.Category, items, {
        Equals: (x, y) => (x === y),
        GetHashCode: stringHash,
    })));
    window.navigator.clipboard.writeText(text);
}

/**
 * Main grocery list view
 */
export function view(model, dispatch) {
    let elems_5;
    const items = generateGroceryList(model.Recipes, model.WeekPlan.Meals);
    const grouped = List_groupBy((i) => i.Category, items, {
        Equals: (x, y) => (x === y),
        GetHashCode: stringHash,
    });
    const checkedCount = length(filter((i_1) => defaultArg(tryFind_1(i_1.Name, model.GroceryChecked), false), items)) | 0;
    return createElement("div", createObj(ofArray([["className", "grocery-page"], (elems_5 = toList(delay(() => {
        let elems_1;
        return append(singleton(createElement("div", createObj(ofArray([["className", "page-header"], (elems_1 = toList(delay(() => append(singleton(createElement("h2", {
            children: "Grocery List",
        })), delay(() => {
            let elems;
            return !isEmpty(items) ? singleton(createElement("div", createObj(ofArray([["className", "grocery-header-actions"], (elems = toList(delay(() => {
                let arg_1;
                return append(singleton(createElement("span", {
                    className: "grocery-count",
                    children: (arg_1 = (length(items) | 0), toText(printf("%d/%d items"))(checkedCount)(arg_1)),
                })), delay(() => append(singleton(createElement("button", {
                    className: "btn btn-secondary btn-small",
                    children: "📋 Copy",
                    onClick: (_arg) => {
                        copyToClipboard(items);
                    },
                })), delay(() => ((checkedCount > 0) ? singleton(createElement("button", {
                    className: "btn btn-secondary btn-small",
                    children: "Clear ✓",
                    onClick: (_arg_1) => {
                        dispatch(new Msg(36, []));
                    },
                })) : empty())))));
            })), ["children", reactApi.Children.toArray(Array.from(elems))])])))) : empty();
        })))), ["children", reactApi.Children.toArray(Array.from(elems_1))])])))), delay(() => {
            let elems_2, elems_4;
            return isEmpty(items) ? singleton(createElement("div", createObj(ofArray([["className", "empty-state"], (elems_2 = [createElement("div", {
                className: "empty-icon",
                children: "🛒",
            }), createElement("p", {
                children: "Your grocery list is empty.",
            }), createElement("p", {
                className: "empty-hint",
                children: "Plan some meals for the week to generate a shopping list!",
            })], ["children", reactApi.Children.toArray(Array.from(elems_2))])])))) : singleton(createElement("div", createObj(ofArray([["className", "grocery-sections"], (elems_4 = toList(delay(() => collect((matchValue) => {
                let elems_3;
                const category = matchValue[0];
                const catItems = matchValue[1];
                return singleton(createElement("div", createObj(ofArray([["className", "grocery-section"], (elems_3 = toList(delay(() => append(singleton(createElement("h3", {
                    className: "grocery-cat-header",
                    children: category,
                })), delay(() => collect((item) => {
                    const isChecked = defaultArg(tryFind_1(item.Name, model.GroceryChecked), false);
                    return singleton(groceryItem(item, isChecked, dispatch));
                }, catItems))))), ["children", reactApi.Children.toArray(Array.from(elems_3))])]))));
            }, grouped))), ["children", reactApi.Children.toArray(Array.from(elems_4))])]))));
        }));
    })), ["children", reactApi.Children.toArray(Array.from(elems_5))])])));
}

