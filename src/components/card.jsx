import React from 'react';
import PropTypes from 'prop-types';


const Card = ({
  imageUrl,
  imageAlt = 'Image',
  title,
  paragraph,
  className = '',
  titleClassName = '',
  paragraphClassName = '',
  imageClassName = '',
  onClick = null,
  variant = 'default',
  size = 'medium',
  ...rest
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    outlined: 'bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl',
    flat: 'bg-gray-100 dark:bg-gray-700 border-none',
    interactive: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all'
  };

  const sizeClasses = {
    small: 'max-w-xs',
    medium: 'max-w-sm',
    large: 'max-w-md',
    xlarge: 'max-w-lg',
    full: 'w-full'
  };

  const cardClasses = [
    'overflow-hidden rounded-lg',
    'flex flex-col',
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.medium,
    onClick ? 'cursor-pointer transform hover:scale-[1.02] transition-transform duration-300' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...rest}
    >
      {imageUrl && (
        <div className="relative w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={imageAlt} 
            className={`w-full object-cover ${imageClassName}`}
          />
        </div>
      )}
      
      <div className="flex flex-col p-4">
        {title && (
          <h3 className={`font-bold text-lg mb-2 text-gray-900 dark:text-white ${titleClassName}`}>
            {title}
          </h3>
        )}
        
        {paragraph && (
          <p className={`text-gray-700 dark:text-gray-300 ${paragraphClassName}`}>
            {paragraph}
          </p>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
  title: PropTypes.node,
  paragraph: PropTypes.node,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  paragraphClassName: PropTypes.string,
  imageClassName: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated', 'flat', 'interactive']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'full']),
};

export default Card;