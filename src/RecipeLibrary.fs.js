import { createElement } from "react";
import { equals, createObj } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { FoodCategories_all, MeasureUnit__get_Abbrev, FoodCategory__get_Label, FoodCategory__get_Icon, Msg, ActiveView } from "./Types.fs.js";
import { map, empty, singleton, append, delay, toList } from "./fable_modules/fable-library-js.4.24.0/Seq.js";
import { printf, toText } from "./fable_modules/fable-library-js.4.24.0/String.js";
import { reactApi } from "./fable_modules/Feliz.2.9.0/./Interop.fs.js";
import { filter, singleton as singleton_1, isEmpty, length, tryFind, ofArray } from "./fable_modules/fable-library-js.4.24.0/List.js";

function recipeCard(recipe, dispatch) {
    let elems_4, elems_1, elems, elems_3, elems_2;
    const totalTime = (recipe.PrepTimeMinutes + recipe.CookTimeMinutes) | 0;
    return createElement("div", createObj(ofArray([["className", "recipe-card"], ["onClick", (_arg) => {
        dispatch(new Msg(0, [new ActiveView(2, [recipe.Id])]));
    }], (elems_4 = [createElement("div", createObj(ofArray([["className", "recipe-card-top"], (elems_1 = [createElement("span", {
        className: "recipe-emoji",
        children: recipe.ImageEmoji,
    }), createElement("div", createObj(ofArray([["className", "recipe-card-badges"], (elems = toList(delay(() => {
        let arg, arg_1;
        return append(singleton(createElement("span", {
            className: "recipe-cat-badge",
            children: (arg = FoodCategory__get_Icon(recipe.Category), (arg_1 = FoodCategory__get_Label(recipe.Category), toText(printf("%s %s"))(arg)(arg_1))),
        })), delay(() => (recipe.IsFavorite ? singleton(createElement("span", {
            className: "fav-badge",
            children: "❤️",
        })) : empty())));
    })), ["children", reactApi.Children.toArray(Array.from(elems))])])))], ["children", reactApi.Children.toArray(Array.from(elems_1))])]))), createElement("div", createObj(ofArray([["className", "recipe-card-body"], (elems_3 = [createElement("h3", {
        className: "recipe-card-name",
        children: recipe.Name,
    }), createElement("p", {
        className: "recipe-card-desc",
        children: recipe.Description,
    }), createElement("div", createObj(ofArray([["className", "recipe-card-meta"], (elems_2 = [createElement("span", {
        children: toText(printf("⏱ %d min"))(totalTime),
    }), createElement("span", {
        children: toText(printf("🍽️ %d servings"))(recipe.Servings),
    }), createElement("span", {
        children: toText(printf("🔥 %.0f kcal"))(recipe.Nutrition.Calories),
    })], ["children", reactApi.Children.toArray(Array.from(elems_2))])])))], ["children", reactApi.Children.toArray(Array.from(elems_3))])])))], ["children", reactApi.Children.toArray(Array.from(elems_4))])])));
}

function recipeDetail(recipeId, model, dispatch) {
    let elems_13;
    const matchValue = tryFind((r) => (r.Id === recipeId), model.Recipes);
    if (matchValue != null) {
        const recipe = matchValue;
        const totalTime = (recipe.PrepTimeMinutes + recipe.CookTimeMinutes) | 0;
        return createElement("div", createObj(ofArray([["className", "recipe-detail-page"], (elems_13 = toList(delay(() => append(singleton(createElement("button", {
            className: "btn-back",
            children: "← Back to Recipes",
            onClick: (_arg) => {
                dispatch(new Msg(0, [new ActiveView(1, [])]));
            },
        })), delay(() => {
            let elems_1, elems, arg_1, arg_2;
            return append(singleton(createElement("div", createObj(ofArray([["className", "recipe-detail-header"], (elems_1 = [createElement("span", {
                className: "recipe-detail-emoji",
                children: recipe.ImageEmoji,
            }), createElement("h2", {
                children: recipe.Name,
            }), createElement("p", {
                className: "recipe-detail-desc",
                children: recipe.Description,
            }), createElement("div", createObj(ofArray([["className", "recipe-detail-meta"], (elems = [createElement("span", {
                children: toText(printf("⏱ %d min total"))(totalTime),
            }), createElement("span", {
                children: (arg_1 = FoodCategory__get_Icon(recipe.Category), (arg_2 = FoodCategory__get_Label(recipe.Category), toText(printf("%s %s"))(arg_1)(arg_2))),
            }), createElement("span", {
                children: toText(printf("%d servings"))(recipe.Servings),
            })], ["children", reactApi.Children.toArray(Array.from(elems))])])))], ["children", reactApi.Children.toArray(Array.from(elems_1))])])))), delay(() => {
                let elems_7, elems_6, elems_2, elems_3, elems_4, elems_5;
                return append(singleton(createElement("div", createObj(ofArray([["className", "nutrition-card"], (elems_7 = [createElement("h3", {
                    children: "Nutrition per Serving",
                }), createElement("div", createObj(ofArray([["className", "nutrition-grid"], (elems_6 = [createElement("div", createObj(ofArray([["className", "nut-item"], (elems_2 = [createElement("div", {
                    className: "nut-val",
                    children: toText(printf("%.0f"))(recipe.Nutrition.Calories),
                }), createElement("div", {
                    className: "nut-label",
                    children: "kcal",
                })], ["children", reactApi.Children.toArray(Array.from(elems_2))])]))), createElement("div", createObj(ofArray([["className", "nut-item"], (elems_3 = [createElement("div", {
                    className: "nut-val",
                    children: toText(printf("%.1fg"))(recipe.Nutrition.Protein),
                }), createElement("div", {
                    className: "nut-label",
                    children: "Protein",
                })], ["children", reactApi.Children.toArray(Array.from(elems_3))])]))), createElement("div", createObj(ofArray([["className", "nut-item"], (elems_4 = [createElement("div", {
                    className: "nut-val",
                    children: toText(printf("%.1fg"))(recipe.Nutrition.Carbs),
                }), createElement("div", {
                    className: "nut-label",
                    children: "Carbs",
                })], ["children", reactApi.Children.toArray(Array.from(elems_4))])]))), createElement("div", createObj(ofArray([["className", "nut-item"], (elems_5 = [createElement("div", {
                    className: "nut-val",
                    children: toText(printf("%.1fg"))(recipe.Nutrition.Fat),
                }), createElement("div", {
                    className: "nut-label",
                    children: "Fat",
                })], ["children", reactApi.Children.toArray(Array.from(elems_5))])])))], ["children", reactApi.Children.toArray(Array.from(elems_6))])])))], ["children", reactApi.Children.toArray(Array.from(elems_7))])])))), delay(() => {
                    let elems_9, arg_8, elems_8;
                    return append(singleton(createElement("div", createObj(ofArray([["className", "detail-section"], (elems_9 = [createElement("h3", {
                        children: (arg_8 = (length(recipe.Ingredients) | 0), toText(printf("Ingredients (%d)"))(arg_8)),
                    }), createElement("ul", createObj(ofArray([["className", "ingredient-detail-list"], (elems_8 = toList(delay(() => map((ing) => {
                        let arg_10;
                        return createElement("li", {
                            children: (arg_10 = MeasureUnit__get_Abbrev(ing.Unit), toText(printf("%.0f %s %s"))(ing.Amount)(arg_10)(ing.Name)),
                        });
                    }, recipe.Ingredients))), ["children", reactApi.Children.toArray(Array.from(elems_8))])])))], ["children", reactApi.Children.toArray(Array.from(elems_9))])])))), delay(() => {
                        let elems_11, elems_10;
                        return append(!isEmpty(recipe.Instructions) ? singleton(createElement("div", createObj(ofArray([["className", "detail-section"], (elems_11 = [createElement("h3", {
                            children: "Instructions",
                        }), createElement("ol", createObj(ofArray([["className", "instruction-detail-list"], (elems_10 = toList(delay(() => map((step) => createElement("li", {
                            children: step,
                        }), recipe.Instructions))), ["children", reactApi.Children.toArray(Array.from(elems_10))])])))], ["children", reactApi.Children.toArray(Array.from(elems_11))])])))) : empty(), delay(() => {
                            let elems_12;
                            return singleton(createElement("div", createObj(ofArray([["className", "detail-actions"], (elems_12 = [createElement("button", {
                                className: "btn btn-primary",
                                children: "✎ Edit",
                                onClick: (_arg_1) => {
                                    dispatch(new Msg(0, [new ActiveView(3, [recipe.Id])]));
                                },
                            }), createElement("button", {
                                className: recipe.IsFavorite ? "btn btn-fav active" : "btn btn-fav",
                                children: recipe.IsFavorite ? "❤️ Favorited" : "♡ Favorite",
                                onClick: (_arg_2) => {
                                    dispatch(new Msg(31, [recipe.Id]));
                                },
                            }), createElement("button", {
                                className: "btn btn-danger",
                                children: "Delete",
                                onClick: (_arg_3) => {
                                    dispatch(new Msg(32, [recipe.Id]));
                                },
                            })], ["children", reactApi.Children.toArray(Array.from(elems_12))])]))));
                        }));
                    }));
                }));
            }));
        })))), ["children", reactApi.Children.toArray(Array.from(elems_13))])])));
    }
    else {
        const children = singleton_1(createElement("p", {
            children: "Recipe not found.",
        }));
        return createElement("div", {
            children: reactApi.Children.toArray(Array.from(children)),
        });
    }
}

export function view(model, dispatch) {
    let elems_5;
    const filtered = filter((r) => {
        const matchesSearch = ((model.SearchQuery === "") ? true : (r.Name.toLocaleLowerCase().indexOf(model.SearchQuery.toLocaleLowerCase()) >= 0)) ? true : (r.Description.toLocaleLowerCase().indexOf(model.SearchQuery.toLocaleLowerCase()) >= 0);
        let matchesCat;
        const matchValue = model.FilterCategory;
        if (matchValue == null) {
            matchesCat = true;
        }
        else {
            const cat = matchValue;
            matchesCat = equals(r.Category, cat);
        }
        if (matchesSearch) {
            return matchesCat;
        }
        else {
            return false;
        }
    }, model.Recipes);
    return createElement("div", createObj(ofArray([["className", "recipe-list-page"], (elems_5 = toList(delay(() => {
        let elems;
        return append(singleton(createElement("div", createObj(ofArray([["className", "page-header"], (elems = [createElement("h2", {
            children: "Recipes",
        }), createElement("button", {
            className: "btn btn-primary btn-small",
            children: "+ New Recipe",
            onClick: (_arg) => {
                dispatch(new Msg(0, [new ActiveView(3, [undefined])]));
            },
        })], ["children", reactApi.Children.toArray(Array.from(elems))])])))), delay(() => {
            let elems_1;
            return append(singleton(createElement("div", createObj(ofArray([["className", "search-wrap"], (elems_1 = [createElement("span", {
                className: "search-icon",
                children: "🔍",
            }), createElement("input", {
                className: "search-input",
                placeholder: "Search recipes...",
                value: model.SearchQuery,
                onChange: (ev) => {
                    dispatch(new Msg(33, [ev.target.value]));
                },
            })], ["children", reactApi.Children.toArray(Array.from(elems_1))])])))), delay(() => {
                let elems_2;
                return append(singleton(createElement("div", createObj(ofArray([["className", "filter-pills"], (elems_2 = toList(delay(() => append(singleton(createElement("button", {
                    className: (model.FilterCategory == null) ? "filter-pill active" : "filter-pill",
                    children: "All",
                    onClick: (_arg_1) => {
                        dispatch(new Msg(34, [undefined]));
                    },
                })), delay(() => map((cat_1) => {
                    let arg, arg_1;
                    return createElement("button", {
                        className: equals(model.FilterCategory, cat_1) ? "filter-pill active" : "filter-pill",
                        children: (arg = FoodCategory__get_Icon(cat_1), (arg_1 = FoodCategory__get_Label(cat_1), toText(printf("%s %s"))(arg)(arg_1))),
                        onClick: (_arg_2) => {
                            dispatch(new Msg(34, [cat_1]));
                        },
                    });
                }, FoodCategories_all))))), ["children", reactApi.Children.toArray(Array.from(elems_2))])])))), delay(() => {
                    let elems_3, elems_4;
                    return isEmpty(filtered) ? singleton(createElement("div", createObj(ofArray([["className", "empty-state"], (elems_3 = [createElement("div", {
                        className: "empty-icon",
                        children: "🍳",
                    }), createElement("p", {
                        children: "No recipes found.",
                    }), createElement("p", {
                        className: "empty-hint",
                        children: "Create your first recipe to start meal planning!",
                    })], ["children", reactApi.Children.toArray(Array.from(elems_3))])])))) : singleton(createElement("div", createObj(ofArray([["className", "recipe-grid"], (elems_4 = toList(delay(() => map((r_1) => recipeCard(r_1, dispatch), filtered))), ["children", reactApi.Children.toArray(Array.from(elems_4))])]))));
                }));
            }));
        }));
    })), ["children", reactApi.Children.toArray(Array.from(elems_5))])])));
}

export const detailView = (recipeId) => ((model) => ((dispatch) => recipeDetail(recipeId, model, dispatch)));

