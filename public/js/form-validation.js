(() => {
  const forms = document.querySelectorAll("[data-validate-form]");
  if (!forms.length) return;

  const messages = {
    valueMissing: "Bitte fülle dieses Feld aus.",
    email: "Bitte gib eine gültige E-Mail-Adresse ein.",
    select: "Bitte wähle eine Option aus.",
    checkbox: "Bitte bestätige dieses Feld.",
  };

  function fieldLabel(field) {
    if (field.id) {
      const label = document.querySelector(`label[for="${CSS.escape(field.id)}"]`);
      if (label) return label.textContent.trim();
    }

    return field.name || "Feld";
  }

  function getFieldError(field) {
    if (field.disabled) return "";

    if (field.validity.valueMissing) {
      if (field.type === "checkbox") return messages.checkbox;
      if (field.tagName === "SELECT") return messages.select;
      return messages.valueMissing;
    }

    if (field.validity.typeMismatch && field.type === "email") {
      return messages.email;
    }

    return "";
  }

  function getErrorElement(field) {
    const fieldId = field.id || field.name;
    if (!fieldId) return null;
    return field.form.querySelector(`[data-field-error="${CSS.escape(fieldId)}"]`);
  }

  function setFieldError(field, message) {
    const errorElement = getErrorElement(field);
    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = !message;
    }
  }

  function validateField(field) {
    const message = getFieldError(field);
    setFieldError(field, message);
    return !message;
  }

  function fieldsFor(form) {
    return Array.from(form.querySelectorAll("input, select, textarea")).filter(
      (field) => !["hidden", "submit", "button"].includes(field.type),
    );
  }

  forms.forEach((form) => {
    form.setAttribute("novalidate", "novalidate");

    fieldsFor(form).forEach((field) => {
      const errorElement = getErrorElement(field);
      if (errorElement && !field.getAttribute("aria-describedby")) {
        errorElement.id = errorElement.id || `${field.id || field.name}-error`;
        field.setAttribute("aria-describedby", errorElement.id);
      }

      field.addEventListener("input", () => validateField(field));
      field.addEventListener("change", () => validateField(field));
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", (event) => {
      const invalidFields = fieldsFor(form).filter((field) => !validateField(field));

      if (!invalidFields.length) return;

      event.preventDefault();
      invalidFields[0].focus();
    });
  });
})();
