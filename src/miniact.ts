/* -----------------------------------------------------------------------------------------------
 * React
 * -----------------------------------------------------------------------------------------------*/

/**
 * Symbol to uniquely identify React elements.
 * This helps prevent potential XSS by ensuring only valid elements are rendered
 *
 * @see https://github.com/facebook/react/blob/7283a213dbbc31029e65005276f12202558558fc/packages/shared/ReactSymbols.js#L18
 */
const REACT_ELEMENT_TYPE = Symbol("react.element");

/**
 * Create and return a new ReactElement of the given type. ReactElement is a lightweight object (POJO). It is what we can
 * call a virtual DOM node (descriptor object). It is used to represent a DOM node in the virtual DOM tree. This function
 * will be reference by JSX transpiler when it transpiles our code and put it in the output code.
 *
 * @see https://github.com/facebook/react/blob/7283a213dbbc31029e65005276f12202558558fc/packages/react/src/jsx/ReactJSXElement.js#L641
 */
function createElement(type, config, ...children) {
  // Config is optional, so we need to fallback to an empty object if it is not provided.
  const props = { children: null };

  let propName;

  // config also contains some special properties like key and ref.
  let key = null;

  if (hasValidKey(config || {})) {
    key = "" + config.key;
  }

  // Add remaining properties to props object.
  for (propName in config) {
    const isKnownProps = Object.prototype.hasOwnProperty.call(config, propName);
    const isReservedProp = propName === "key";
    if (isKnownProps && !isReservedProp) {
      props[propName] = config[propName];
    }
  }

  /**
   * Children can be single child or an array of children. We need to normalize the children array to make sure that we have
   * a single array of children. In react, children can be a single or an array. But in our case, we will always have an array
   * of children.
   */
  const normalizedChildren = flattenChildren(children);

  // Add children to props object.
  props.children = normalizedChildren;

  // We can resolve default props here if we want to.
  // like: type.defaultProps

  return ReactElement(type, key, props);
}

/**
 * Factory function to create a new ReactElement.
 *
 * @see https://github.com/facebook/react/blob/7283a213dbbc31029e65005276f12202558558fc/packages/react/src/jsx/ReactJSXElement.js#L161
 */
function ReactElement(type, key, props) {
  const refProp = props.ref;
  const ref = refProp !== undefined ? refProp : null;
  delete props.ref;
  return {
    // This tag allows us to uniquely identify React elements.
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    props,
    ref
  };
}

function hasValidKey(config) {
  return config.key !== undefined;
}

/**
 * flattenChildren takes an array of children and returns a flat array of children.
 * This is useful for handling nested children in React elements.
 *
 * @param children - An array of children
 */
function flattenChildren(children) {
  return children.reduce((acc, child) => {
    // Handle nested children.
    // E.g. <div>{["Hello", <span>world</span>]}</div>
    if (Array.isArray(child)) {
      return acc.concat(flattenChildren(child));
    }

    // Filter out null, undefined, and boolean children
    if (child == null || typeof child === "boolean") {
      return acc;
    }

    // Convert primitive values to text nodes
    const childType = typeof child;
    if (childType === "number" || childType === "string") {
      return acc.concat({ type: "TEXT_ELEMENT", props: { nodeValue: child, children: [] } });
    }

    return acc.concat(child);
  }, []);
}

/**
 * This is interesting, the hooks like useState, useEffect, etc. are use from react but the actual implementation
 * of these hooks are in react-dom. So, react dom is responsible for providing the implementation of these hooks
 * via the runtime dependency injection.
 */
const ReactCurrentDispatcher = {
  current: null
};

export { createElement, ReactCurrentDispatcher };
