const fields = [
    {
      id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
      type: "input",
      label: "Sample Input",
      placeholder: "Sample placeholder",
    },
    {
      id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
      type: "select",
      label: "Sample Select",
      options: ["Sample Option 1", "Sample Option 2", "Sample Option 3"],
    },
    {
      id: "45002ecf-85cf-4852-bc46-529f94a758f5",
      type: "textarea",
      label: "Sample Textarea",
      placeholder: "Sample Placeholder",
    },
    {
      id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
      type: "checkbox",
      label: "Sample Checkbox",
    },
  ];
  

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");
    const buttons = document.querySelectorAll(".btn");
    const saveBtn = document.querySelector(".save");

    setupDragAndDrop();

    buttons.forEach((btn, i) => {
        btn.addEventListener("click", () => addField(fields[i]));
    });

    saveBtn.addEventListener("click", saveForm);

    function setupDragAndDrop() {
        form.addEventListener("dragover", (e) => {
            e.preventDefault();
            const dragged = document.querySelector(".dragging");
            const closest = getClosest(form, e.clientY);

            if (closest) {
                form.insertBefore(dragged, closest);
            } else {
                form.appendChild(dragged);
            }
        });
    }

    function getClosest(container, y) {
        const items = [...container.querySelectorAll(".item:not(.dragging)")];
        return items.reduce((closest, el) => {
            const box = el.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: el };
            }
            return closest;
        }, { offset: -Infinity }).element;
    }

    function addField(field) {
        const div = document.createElement("div");
        div.classList.add("item");
        div.draggable = true;
        div.dataset.id = field.id;
        div.dataset.type = field.type;

        div.addEventListener("dragstart", () => div.classList.add("dragging"));
        div.addEventListener("dragend", () => div.classList.remove("dragging"));

        const label = document.createElement("label");
        label.textContent = field.label;
        div.appendChild(label);

        let input;
        if (field.type === "input") {
            input = document.createElement("input");
            input.type = "text";
            input.placeholder = field.placeholder;
        } else if (field.type === "select") {
            input = document.createElement("select");
            field.options.forEach(opt => {
                const option = document.createElement("option");
                option.textContent = opt;
                input.appendChild(option);
            });
        } else if (field.type === "textarea") {
            input = document.createElement("textarea");
            input.placeholder = field.placeholder;
        } else if (field.type === "checkbox") {
            input = document.createElement("input");
            input.type = "checkbox";
        }

        input.classList.add("input");
        div.appendChild(input);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.classList.add("delete");
        delBtn.addEventListener("click", () => div.remove());
        div.appendChild(delBtn);

        form.appendChild(div);
    }

    function saveForm() {
        const formData = [];
        const items = form.querySelectorAll(".item");

        items.forEach(item => {
            const data = {
                id: item.dataset.id,
                type: item.dataset.type,
                label: item.querySelector("label").textContent,
            };

            const input = item.querySelector(".input");
            if (input.placeholder) data.placeholder = input.placeholder;

            if (data.type === "select") {
                data.options = [...input.options].map(option => option.textContent);
            }

            formData.push(data);
        });

        console.log("Form data:", formData);
        return formData;
    }
});
