import React from "react";

// Main Form wrapper component
const Form = ({ children, onSubmit, className = "", ...props }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
};

// Form Group for consistent spacing between form elements
const FormGroup = ({ children, className = "", ...props }) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Form Row for horizontal layouts
const FormRow = ({ children, className = "", gap = "gap-4", ...props }) => {
  return (
    <div className={`flex flex-col sm:flex-row ${gap} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Form Actions for button groups
const FormActions = ({
  children,
  align = "right",
  className = "",
  ...props
}) => {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 pt-4 ${alignClasses[align]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Form Section for grouping related fields
const FormSection = ({
  title,
  description,
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {(title || description) && (
        <div className="border-b border-gray-200 pb-4">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};

// Export all form components
export { Form, FormGroup, FormRow, FormActions, FormSection };
export default Form;
