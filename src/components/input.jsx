import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  type = 'text',
  id,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = '',
  
  required = false,
  disabled = false,
  readOnly = false,
  pattern = '',
  minLength,
  maxLength,
  min,
  max,
  step,
  
  label = '',
  helperText = '',
  error = false,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  
  startIcon = null,
  endIcon = null,
  clearable = false,
  
  className = '',
  labelClassName = '',
  inputClassName = '',
  helperClassName = '',
  
  ...rest
}, ref) => {
  const variantClasses = {
    default: 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    outlined: 'border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    filled: 'bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500',
    underlined: 'border-b border-gray-300 rounded-none focus:border-blue-500 focus:ring-blue-500',
    search: 'border border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500',
  };

  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-3 text-base',
    large: 'py-3 px-4 text-lg',
  };

  const errorClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500'
    : '';

  const inputBaseClasses = [
    'block rounded-md',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2',
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.medium,
    disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '',
    fullWidth ? 'w-full' : 'w-auto',
    errorClasses,
    inputClassName,
  ].filter(Boolean).join(' ');

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const handleClear = () => {
    if (onChange) {
      const event = { target: { name, value: '' } };
      onChange(event);
    }
  };

  return (
    <div className={`input-container ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block mb-1 font-medium text-gray-700 dark:text-gray-300 ${error ? 'text-red-500' : ''} ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
            {startIcon}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          type={type}
          name={name}
          value={value !== undefined ? value : ''}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          pattern={pattern}
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          className={`
            ${inputBaseClasses}
            ${startIcon ? 'pl-10' : ''}
            ${(endIcon || clearable) ? 'pr-10' : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          {...rest}
        />
        
        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Effacer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {endIcon && !clearable && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
            {endIcon}
          </div>
        )}
      </div>
      
      {helperText && (
        <p 
          id={`${inputId}-helper`} 
          className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} ${helperClassName}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  pattern: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  label: PropTypes.node,
  helperText: PropTypes.node,
  error: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'outlined', 'filled', 'underlined', 'search']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  clearable: PropTypes.bool,
  
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  helperClassName: PropTypes.string,
};

export default Input;