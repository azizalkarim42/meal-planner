import { createElement } from "react";
import React from "react";
import { view, update as update_1, init } from "./App.fs.js";
import { reactApi } from "./fable_modules/Feliz.2.9.0/./Interop.fs.js";
import { printf, toText } from "./fable_modules/fable-library-js.4.24.0/String.js";
import { createRoot } from "react-dom/client";

export function AppComponent() {
    let patternInput;
    const arg_1 = init();
    patternInput = reactApi.useReducer((m, msg) => update_1(msg, m), arg_1);
    const model = patternInput[0];
    const dispatch = patternInput[1];
    const dependencies = [model.ActiveView];
    reactApi.useEffect(() => {
        let title;
        const matchValue = model.ActiveView;
        title = ((matchValue.tag === 1) ? "Recipes" : ((matchValue.tag === 2) ? "Recipe" : ((matchValue.tag === 3) ? "Edit Recipe" : ((matchValue.tag === 4) ? "Grocery List" : ((matchValue.tag === 5) ? "Nutrition" : "Week Planner")))));
        document.title = toText(printf("%s | MealPlanner"))(title);
    }, dependencies);
    return view(model, dispatch);
}

export const root = createRoot(document.getElementById("app"));

root.render(createElement(AppComponent, null));

