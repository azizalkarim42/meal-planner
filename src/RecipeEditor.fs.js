import { createElement } from "react";
import { safeHash, equals, createObj } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { empty, singleton, append, map, delay, toList } from "./fable_modules/fable-library-js.4.24.0/Seq.js";
import { GroceryCategories_all, MeasureUnits_all, MeasureUnit__get_Abbrev, MeasureUnits_fromCode, MeasureUnit__get_Code, MealTypes_all, MealType__get_Label, MealType__get_Icon, FoodCategories_all, FoodCategory__get_Label, FoodCategory__get_Icon, RecipeEmojis_all, Msg } from "./Types.fs.js";
import { reactApi } from "./fable_modules/Feliz.2.9.0/./Interop.fs.js";
import { isEmpty, length, item, contains, ofArray } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { printf, toText } from "./fable_modules/fable-library-js.4.24.0/String.js";
import { rangeDouble } from "./fable_modules/fable-library-js.4.24.0/Range.js";

function emojiPicker(selected, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["className", "emoji-picker"], (elems = toList(delay(() => map((emoji) => createElement("button", {
        className: (emoji === selected) ? "emoji-btn selected" : "emoji-btn",
        children: emoji,
        onClick: (_arg) => {
            dispatch(new Msg(28, [emoji]));
        },
    }), RecipeEmojis_all))), ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

function categorySelector(selected, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["className", "cat-pills"], (elems = toList(delay(() => map((cat) => {
        let arg, arg_1;
        return createElement("button", {
            className: equals(cat, selected) ? "cat-pill active" : "cat-pill",
            children: (arg = FoodCategory__get_Icon(cat), (arg_1 = FoodCategory__get_Label(cat), toText(printf("%s %s"))(arg)(arg_1))),
            onClick: (_arg) => {
                dispatch(new Msg(10, [cat]));
            },
        });
    }, FoodCategories_all))), ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

function mealTypeToggles(selected, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["className", "meal-toggles"], (elems = toList(delay(() => map((mt) => {
        let arg, arg_1;
        return createElement("button", {
            className: contains(mt, selected, {
                Equals: equals,
                GetHashCode: safeHash,
            }) ? "meal-toggle active" : "meal-toggle",
            children: (arg = MealType__get_Icon(mt), (arg_1 = MealType__get_Label(mt), toText(printf("%s %s"))(arg)(arg_1))),
            onClick: (_arg) => {
                dispatch(new Msg(11, [mt]));
            },
        });
    }, MealTypes_all))), ["children", reactApi.Children.toArray(Array.from(elems))])])));
}

function ingredientForm(model, dispatch) {
    let elems_2, elems, elems_1;
    return createElement("div", createObj(ofArray([["className", "ingredient-form"], (elems_2 = [createElement("input", {
        className: "text-input ing-name",
        placeholder: "Ingredient name",
        value: model.RecipeForm.NewIngName,
        onChange: (ev) => {
            dispatch(new Msg(15, [ev.target.value]));
        },
    }), createElement("input", {
        className: "text-input ing-amount",
        placeholder: "Qty",
        type: "number",
        value: model.RecipeForm.NewIngAmount,
        onChange: (ev_1) => {
            dispatch(new Msg(16, [ev_1.target.value]));
        },
    }), createElement("select", createObj(ofArray([["className", "select-input ing-unit"], ["value", MeasureUnit__get_Code(model.RecipeForm.NewIngUnit)], ["onChange", (ev_2) => {
        dispatch(new Msg(17, [MeasureUnits_fromCode(ev_2.target.value)]));
    }], (elems = toList(delay(() => map((u) => createElement("option", {
        value: MeasureUnit__get_Code(u),
        children: MeasureUnit__get_Abbrev(u),
    }), MeasureUnits_all))), ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("select", createObj(ofArray([["className", "select-input ing-cat"], ["value", model.RecipeForm.NewIngCategory], ["onChange", (ev_3) => {
        dispatch(new Msg(18, [ev_3.target.value]));
    }], (elems_1 = toList(delay(() => map((c) => createElement("option", {
        value: c,
        children: c,
    }), GroceryCategories_all))), ["children", reactApi.Children.toArray(Array.from(elems_1))])]))), createElement("button", {
        className: "btn btn-primary btn-small",
        children: "+",
        disabled: model.RecipeForm.NewIngName.trim() === "",
        onClick: (_arg) => {
            dispatch(new Msg(19, []));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_2))])])));
}

function ingredientList(ingredients, dispatch) {
    let elems_1;
    return createElement("div", createObj(ofArray([["className", "ingredient-list"], (elems_1 = toList(delay(() => map((ing) => {
        let elems, arg_1;
        return createElement("div", createObj(ofArray([["className", "ingredient-item"], (elems = [createElement("span", {
            className: "ing-text",
            children: (arg_1 = MeasureUnit__get_Abbrev(ing.Unit), toText(printf("%.0f %s %s"))(ing.Amount)(arg_1)(ing.Name)),
        }), createElement("span", {
            className: "ing-category",
            children: ing.GroceryCategory,
        }), createElement("button", {
            className: "btn-icon btn-delete",
            children: "×",
            onClick: (_arg) => {
                dispatch(new Msg(20, [ing.Id]));
            },
        })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
    }, ingredients))), ["children", reactApi.Children.toArray(Array.from(elems_1))])])));
}

function instructionEditor(instructions, newInst, dispatch) {
    let elems_2;
    return createElement("div", createObj(ofArray([["className", "instruction-editor"], (elems_2 = toList(delay(() => append(map((i) => {
        let elems, arg;
        return createElement("div", createObj(ofArray([["className", "instruction-item"], (elems = [createElement("span", {
            className: "step-num",
            children: (arg = ((i + 1) | 0), toText(printf("%d."))(arg)),
        }), createElement("span", {
            className: "step-text",
            children: item(i, instructions),
        }), createElement("button", {
            className: "btn-icon btn-delete",
            children: "×",
            onClick: (_arg) => {
                dispatch(new Msg(23, [i]));
            },
        })], ["children", reactApi.Children.toArray(Array.from(elems))])])));
    }, rangeDouble(0, 1, length(instructions) - 1)), delay(() => {
        let elems_1;
        return singleton(createElement("div", createObj(ofArray([["className", "add-instruction"], (elems_1 = [createElement("input", {
            className: "text-input",
            placeholder: "Add a step...",
            value: newInst,
            onChange: (ev) => {
                dispatch(new Msg(21, [ev.target.value]));
            },
            onKeyDown: (e) => {
                if ((e.key === "Enter") && (newInst.trim() !== "")) {
                    dispatch(new Msg(22, []));
                }
            },
        }), createElement("button", {
            className: "btn btn-primary btn-small",
            children: "Add Step",
            disabled: newInst.trim() === "",
            onClick: (_arg_1) => {
                dispatch(new Msg(22, []));
            },
        })], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))));
    })))), ["children", reactApi.Children.toArray(Array.from(elems_2))])])));
}

export function view(recipeId, model, dispatch) {
    let elems_14, elems, elems_1, elems_2, elems_3, elems_4, elems_8, elems_5, elems_6, elems_7, elems_10, elems_9, elems_11, elems_12, elems_13;
    const isEditing = recipeId != null;
    const canSave = (model.RecipeForm.Name.trim() !== "") && !isEmpty(model.RecipeForm.Ingredients);
    return createElement("div", createObj(ofArray([["className", "recipe-editor-page"], (elems_14 = [createElement("button", {
        className: "btn-back",
        children: "← Back to Recipes",
        onClick: (_arg) => {
            dispatch(new Msg(30, []));
        },
    }), createElement("h2", {
        children: isEditing ? "Edit Recipe" : "New Recipe",
    }), createElement("div", createObj(ofArray([["className", "form-field"], (elems = toList(delay(() => append(singleton(createElement("label", {
        className: "form-label",
        children: "Recipe Name",
    })), delay(() => append(singleton(createElement("input", {
        className: (model.RecipeForm.Name.trim() === "") ? "text-input input-error" : "text-input",
        placeholder: "e.g. Chicken Pasta Salad",
        value: model.RecipeForm.Name,
        autoFocus: true,
        onChange: (ev) => {
            dispatch(new Msg(8, [ev.target.value]));
        },
    })), delay(() => ((model.RecipeForm.Name.trim() === "") ? singleton(createElement("span", {
        className: "input-error-msg",
        children: "Recipe name is required",
    })) : empty()))))))), ["children", reactApi.Children.toArray(Array.from(elems))])]))), createElement("div", createObj(ofArray([["className", "form-field"], (elems_1 = [createElement("label", {
        className: "form-label",
        children: "Description",
    }), createElement("textarea", {
        className: "text-input",
        placeholder: "Brief description...",
        value: model.RecipeForm.Description,
        rows: 2,
        onChange: (ev_1) => {
            dispatch(new Msg(9, [ev_1.target.value]));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))), createElement("div", createObj(ofArray([["className", "form-field"], (elems_2 = [createElement("label", {
        className: "form-label",
        children: "Icon",
    }), emojiPicker(model.RecipeForm.ImageEmoji, dispatch)], ["children", reactApi.Children.toArray(Array.from(elems_2))])]))), createElement("div", createObj(ofArray([["className", "form-field"], (elems_3 = [createElement("label", {
        className: "form-label",
        children: "Category",
    }), categorySelector(model.RecipeForm.Category, dispatch)], ["children", reactApi.Children.toArray(Array.from(elems_3))])]))), createElement("div", createObj(ofArray([["className", "form-field"], (elems_4 = [createElement("label", {
        className: "form-label",
        children: "Suitable For",
    }), mealTypeToggles(model.RecipeForm.SuitableFor, dispatch)], ["children", reactApi.Children.toArray(Array.from(elems_4))])]))), createElement("div", createObj(ofArray([["className", "time-servings-row"], (elems_8 = [createElement("div", createObj(ofArray([["className", "form-field-inline"], (elems_5 = [createElement("label", {
        className: "form-label",
        children: "Servings",
    }), createElement("input", {
        className: "text-input small-input",
        type: "number",
        value: model.RecipeForm.Servings,
        onChange: (ev_2) => {
            dispatch(new Msg(12, [ev_2.target.value]));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_5))])]))), createElement("div", createObj(ofArray([["className", "form-field-inline"], (elems_6 = [createElement("label", {
        className: "form-label",
        children: "Prep (min)",
    }), createElement("input", {
        className: "text-input small-input",
        type: "number",
        value: model.RecipeForm.PrepTime,
        onChange: (ev_3) => {
            dispatch(new Msg(13, [ev_3.target.value]));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_6))])]))), createElement("div", createObj(ofArray([["className", "form-field-inline"], (elems_7 = [createElement("label", {
        className: "form-label",
        children: "Cook (min)",
    }), createElement("input", {
        className: "text-input small-input",
        type: "number",
        value: model.RecipeForm.CookTime,
        onChange: (ev_4) => {
            dispatch(new Msg(14, [ev_4.target.value]));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_7))])])))], ["children", reactApi.Children.toArray(Array.from(elems_8))])]))), createElement("div", createObj(ofArray([["className", "form-field"], (elems_10 = [createElement("label", {
        className: "form-label",
        children: "Nutrition (per serving)",
    }), createElement("div", createObj(ofArray([["className", "nutrition-inputs"], (elems_9 = [createElement("input", {
        className: "text-input small-input",
        placeholder: "kcal",
        type: "number",
        value: model.RecipeForm.Calories,
        onChange: (ev_5) => {
            dispatch(new Msg(24, [ev_5.target.value]));
        },
    }), createElement("input", {
        className: "text-input small-input",
        placeholder: "Protein g",
        type: "number",
        value: model.RecipeForm.Protein,
        onChange: (ev_6) => {
            dispatch(new Msg(25, [ev_6.target.value]));
        },
    }), createElement("input", {
        className: "text-input small-input",
        placeholder: "Carbs g",
        type: "number",
        value: model.RecipeForm.Carbs,
        onChange: (ev_7) => {
            dispatch(new Msg(26, [ev_7.target.value]));
        },
    }), createElement("input", {
        className: "text-input small-input",
        placeholder: "Fat g",
        type: "number",
        value: model.RecipeForm.Fat,
        onChange: (ev_8) => {
            dispatch(new Msg(27, [ev_8.target.value]));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_9))])])))], ["children", reactApi.Children.toArray(Array.from(elems_10))])]))), createElement("div", createObj(ofArray([["className", "form-field"], (elems_11 = [createElement("label", {
        className: "form-label",
        children: "Ingredients",
    }), ingredientForm(model, dispatch), ingredientList(model.RecipeForm.Ingredients, dispatch)], ["children", reactApi.Children.toArray(Array.from(elems_11))])]))), createElement("div", createObj(ofArray([["className", "form-field"], (elems_12 = [createElement("label", {
        className: "form-label",
        children: "Instructions",
    }), instructionEditor(model.RecipeForm.Instructions, model.RecipeForm.NewInstruction, dispatch)], ["children", reactApi.Children.toArray(Array.from(elems_12))])]))), createElement("div", createObj(ofArray([["className", "form-actions"], (elems_13 = [createElement("button", {
        className: "btn btn-primary btn-large",
        children: isEditing ? "Save Changes" : "Create Recipe",
        disabled: !canSave,
        onClick: (_arg_1) => {
            dispatch(new Msg(29, []));
        },
    }), createElement("button", {
        className: "btn btn-secondary",
        children: "Cancel",
        onClick: (_arg_2) => {
            dispatch(new Msg(30, []));
        },
    })], ["children", reactApi.Children.toArray(Array.from(elems_13))])])))], ["children", reactApi.Children.toArray(Array.from(elems_14))])])));
}

