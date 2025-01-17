const DEBUG = false;
const log = (...args) => {
  if (!DEBUG) return;
  console.log("[miniact]", ...args);
};

/**
 * ReactDOM
 */
const INTERNALS = {
  /**
   * `nextUnitOfWork` tracks which fiber we should work on next during the update.
   */
  nextUnitOfWork: null,
  /**
   * The wipRoot (work-in-progress root)
   */
  wipRoot: null,
  /**
   * Holds the root of the currently committed fiber tree
   */
  currentRoot: null,
  /**
   * Holds the current component's fiber. When a functional component is being rendered,
   * this variable holds the fiber for that component.
   */
  wipFiber: null,
  /**
   * We will maintain a global array to track fibers that need to be deleted during this render cycle.
   * Deletions are applied during the commit phase.
   */
  deletions: [],

  setNextUnitOfWork(fiber, label = "") {
    if (label) {
      log("[setNextUnitOfWork]", label, { ...fiber });
    }
    this.nextUnitOfWork = fiber;
  },

  setWipRoot(fiber, label = "") {
    if (label) {
      log("[setWipRoot]", label, { ...fiber });
    }
    this.wipRoot = fiber;
  },

  setCurrentRoot(fiber, label = "") {
    if (label) {
      log("[setCurrentRoot]", label, { ...fiber });
    }
    this.currentRoot = fiber;
  },

  setWipFiber(fiber, label = "") {
    if (label) {
      log("[setWipFiber]", label, { ...fiber });
    }
    this.wipFiber = fiber;
  },

  getCurrentRoot(label = "") {
    if (label) {
      log("[getCurrentRoot]", label, { ...this.currentRoot });
    }
    return this.currentRoot;
  },

  getNextUnitOfWork(label = "") {
    if (label) {
      log("[getNextUnitOfWork]", label, { ...this.nextUnitOfWork });
    }
    return this.nextUnitOfWork;
  },

  getWipFiber(label = "") {
    if (label) {
      log("[getWipFiber]", label, { ...this.wipFiber });
    }
    return this.wipFiber;
  },

  getWipRoot(label = "") {
    if (label) {
      log("[getWipRoot]", label, { ...this.wipRoot });
    }
    return this.wipRoot;
  },

  getHookIndex(label = "") {
    if (label) {
      log("[getHookIndex]", label, this.hookIndex);
    }
    return this.hookIndex;
  }
};
// @ts-ignore
window.INTERNALS = INTERNALS;

/* -----------------------------------------------------------------------------------------------
 * Fiber
 * -----------------------------------------------------------------------------------------------*/
function FiberNode(type, props, parent) {
  // Type of an element like div, span, or a function/class component
  this.type = type;

  // Props of an element
  this.props = props || {};

  // Reference to the parent fiber
  // Helps in traversing and finding the correct DOM insertion point
  this.parent = parent || null;

  // Reference to the first child fiber
  // Used for depth-first traversal of the fiber tree
  this.child = null;

  // Reference to the next sibling fiber
  // Allows horizontal traversal between elements at the same level
  this.sibling = null;

  // Reference to the actual DOM node
  this.dom = null;

  // Reference to the previous render's fiber (for diffing)
  // Used to compare and determine minimal DOM updates
  this.alternate = null;

  // Effect tag to determine what to do with the fiber. Possible values are:
  // 1. PLACEMENT: Add a new node to the DOM
  // 2. DELETION: Remove the node from the DOM
  // 3. UPDATE: Update the node in the DOM
  this.effectTag = null;

  // Hooks for function components
  this.hooks = null;

  // For function components, we need to keep track of the hook index
  this.hookIndex = 0;
}

/**
 * Create a new fiber node
 *
 * @param {string | Function} type - Type of the element
 * @param {Object} props - Props of the element
 * @param {FiberNode} parent - Parent fiber node
 * @returns {FiberNode} - New fiber node
 */
function createFiber(type, props, parent) {
  return new FiberNode(type, props, parent);
}

function shallowEqual(objA, objB) {
  if (objA === objB) return true;

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let key of keysA) {
    if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
}

function updateDom(dom, oldProps, newProps) {
  /**
   * Remove old or changed event listeners
   */
  for (let name in oldProps) {
    if (name.startsWith("on") && (!(name in newProps) || newProps[name] !== oldProps[name])) {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, oldProps[name]);
    }

    /**
     * Remove old properties
     */
    if (name !== "children" && !name.startsWith("on") && !(name in newProps)) {
      dom[name] = "";
    }
  }

  /**
   * Set new properties
   */
  for (let name in newProps) {
    if (name !== "children" && !name.startsWith("on")) {
      dom[name] = newProps[name];
    }

    /**
     * Add new or changes event listeners
     */
    if (name !== "children" && name.startsWith("on") && (!(name in oldProps) || newProps[name] !== oldProps[name])) {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, newProps[name]);
    }
  }
}

function createDom(fiber) {
  const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);
  /**
   * Update the DOM node with the props from the fiber
   */
  updateDom(dom, {}, fiber.props);
  return dom;
}

function commitDeletion(fiber, parentDom) {
  if (fiber.dom) {
    parentDom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, parentDom);
  }
}

function commitWork(fiber, parentDom) {
  if (!fiber) return;

  if (fiber.effectTag === undefined || fiber.effectTag === null) {
    commitWork(fiber.child, parentDom);
    commitWork(fiber.sibling, parentDom);
    return;
  }
  /**
   * Traverse up the fiber tree to find the nearest parent with a DOM node. This is because not all fibers
   * have a host DOM node (like function components). We need actual DOM node to perform DOM mutations
   */

  let domParentFiber = fiber.parent;
  while (domParentFiber && !domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber ? domParentFiber.dom : parentDom;

  // Apply changes to the DOM
  if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
    return;
  }

  commitWork(fiber.child, null);
  commitWork(fiber.sibling, null);
}

function runEffects(fiber) {
  if (!fiber) return;
  if (fiber.hooks && fiber.hooks.length > 0) {
    fiber.hooks.forEach((hook) => {
      if (hook.effect) {
        const hasDeps = Array.isArray(hook.deps);
        const shouldRunEffect =
          !hasDeps || !hook.oldDeps || hook.deps.some((dep, i) => Object.is(dep, hook.oldDeps[i]));
        if (shouldRunEffect) {
          // Cleanup the previous effect
          if (hook.cleanup && typeof hook.cleanup === "function") {
            hook.cleanup();
          }

          const cleanup = hook.effect();
          if (typeof cleanup === "function") {
            hook.cleanup = cleanup;
          }

          hook.oldDeps = hook.deps;
        }
      }
    });
  }

  runEffects(fiber.child);
  runEffects(fiber.sibling);
}

/**
 * Commit the changes to the DOM
 */
function commitRoot() {
  // Commit deletions
  for (const fiber of INTERNALS.deletions) {
    commitWork(fiber, null);
  }

  INTERNALS.deletions = [];

  const wipRoot = INTERNALS.getWipRoot("commitRoot()");
  if (wipRoot && wipRoot.child) {
    commitWork(wipRoot.child, wipRoot.dom);
  }

  // After DOM is updated, run effects
  runEffects(wipRoot);

  INTERNALS.setCurrentRoot(INTERNALS.wipRoot, "commitRoot()");
  INTERNALS.setWipRoot(null, "commitRoot()");
}

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      // Check if the props are the same or not
      const { children, ...elementProps } = element.props;
      const { children: oldChildren, ...oldFiberProps } = oldFiber.props;
      const arePropsEqual = shallowEqual(elementProps, oldFiberProps);
      if (arePropsEqual) {
        newFiber = createFiber(oldFiber.type, { ...element.props, children }, wipFiber);
        newFiber.dom = oldFiber.dom;
        newFiber.child = oldFiber.child;
        newFiber.sibling = oldFiber.sibling;
        newFiber.alternate = oldFiber;
        newFiber.effectTag = null;
        newFiber.hooks = oldFiber.hooks;
      } else {
        newFiber = createFiber(element.type, element.props, wipFiber);
        newFiber.dom = oldFiber.dom;
        newFiber.child = oldFiber.child;
        newFiber.sibling = oldFiber.sibling;
        newFiber.alternate = oldFiber;
        newFiber.effectTag = "UPDATE";
        newFiber.hooks = oldFiber.hooks;
      }
    }

    if (element && !sameType) {
      /**
       * We have a new element with no matching old fiber. We need to create a new fiber for this element.
       */
      newFiber = createFiber(element.type, element.props, wipFiber);
      newFiber.effectTag = "PLACEMENT";
    }

    if (oldFiber && !sameType && !element) {
      /**
       * The oldFiber no longer has corresponding element in new tree.
       */
      oldFiber.effectTag = "DELETION";
      INTERNALS.deletions.push(oldFiber);
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (prevSibling !== null) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
  }
}

function performUnitOfWork(currentFiber) {
  /**
   * If the current fiber is a function component. Setup hooks and get the corresponding virtual DOM from the component.
   */
  if (typeof currentFiber.type === "function") {
    /**
     * Reset hook index to 0. This is why hooks should always be called in the same order, and at the top level of the
     * function component. Calling hooks conditionally or inside loops, the index will get out of sync.
     */
    currentFiber.hookIndex = 0;
    /**
     * Set wipFiber to the current fiber, so the hooks can be set on this fiber.
     */
    INTERNALS.setWipFiber(currentFiber, "performUnitOfWork()");
    currentFiber.hooks = [];
    const children = [currentFiber.type(currentFiber.props)];
    reconcileChildren(currentFiber, children);
  } else {
    /**
     * This is a host component (like div, span, etc.).
     * First check if the current fiber has dom node created or not. If not, then create one.
     */
    if (currentFiber.dom === null) {
      currentFiber.dom = createDom(currentFiber);
    }
    reconcileChildren(currentFiber, currentFiber.props.children);
  }

  /**
   * Once the children are reconciled, we need to determine the next fiber to work on.
   * Priority:
   * 1. Return the first child if it exists
   * 2. If no child, return the next sibling
   * 3. If no sibling, move up to the parent chain until we find sibling.
   */

  if (currentFiber.child !== null) {
    return currentFiber.child;
  }

  let nextFiber = currentFiber;
  while (nextFiber !== null) {
    if (nextFiber.sibling !== null) {
      return nextFiber.sibling;
    }

    /**
     * Move up to the parent
     */
    nextFiber = nextFiber.parent;
  }

  // If we exit this loop, it means we've processed everything (no more work).
  return null;
}

function workLoopSync() {
  /**
   * This function repeatedly processes the fiber tree until there is no more work.
   * We start from `nextUnitOfWork` fiber and keep traversing until no more work is left.
   */

  while (INTERNALS.nextUnitOfWork) {
    /**
     * Perform the current unit of work, which returns the next unit of work.
     * This might be the child of the current fiber, or if no child, a sibling or parent’s sibling.
     */
    const nextWork = performUnitOfWork(INTERNALS.nextUnitOfWork);
    INTERNALS.setNextUnitOfWork(nextWork, "workLoopSync()");
  }

  /**
   * When no more units of work remain, we've built a complete fiber tree for this update.
   * At this point, we’re ready to commit the changes to the DOM (in commitRoot).
   */
  if (!INTERNALS.nextUnitOfWork && INTERNALS.wipRoot) {
    commitRoot();
  }
}

function workLoopConcurrent(deadline) {
  /**
   * This function repeatedly processes the fiber tree until there is no more work.
   * Rather than doing synchronously, we will perform work when the browser is idle.
   * We will use `requestIdleCallback` to schedule work when the browser is idle.
   */
  let shouldYield = false;

  while (INTERNALS.nextUnitOfWork && !shouldYield) {
    /**
     * Perform the current unit of work, which returns the next unit of work.
     * This might be the child of the current fiber, or if no child, a sibling or parent’s sibling.
     */
    const nextWork = performUnitOfWork(INTERNALS.nextUnitOfWork);
    INTERNALS.setNextUnitOfWork(nextWork, "workLoopConcurrent()");
    if (deadline.timeRemaining() < 1) {
      shouldYield = true;
    }
  }

  /**
   * When no more units of work remain, we've built a complete fiber tree for this update.
   * At this point, we’re ready to commit the changes to the DOM (in commitRoot).
   */
  if (!INTERNALS.nextUnitOfWork && INTERNALS.wipRoot) {
    commitRoot();
  }

  // If there is more work, schedule the next idle callback
  requestIdleCallback(workLoopConcurrent);
}

function flushSync() {
  /**
   * This function is the entry point for the initial render.
   */
  workLoopSync();
}

function useState(initial) {
  // Get the old hook if it exists
  const wipFiber = INTERNALS.getWipFiber("useState()");
  const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[wipFiber.hookIndex];

  // If old hook exists, then we're on the update phase else this is initial render
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  // If there are pending state updates in queue, process them (e.g., setState calls)
  for (let action of (oldHook && oldHook.queue) || []) {
    hook.state = typeof action === "function" ? action(hook.state) : action;
  }

  function setState(action) {
    // Enqueue the state update action
    hook.queue.push(action);

    // Trigger a re-render from the root to update the UI
    const currentRoot = INTERNALS.getCurrentRoot("useState().setState()");
    const newWipRoot = {
      ...currentRoot,
      alternate: currentRoot,
      props: currentRoot.props
    };
    INTERNALS.setWipRoot(newWipRoot, "useState().setState()");
    INTERNALS.setNextUnitOfWork(INTERNALS.wipRoot, "useState().setState()");
    INTERNALS.deletions = [];
    requestIdleCallback(workLoopConcurrent);
  }

  // Store the hook in the current fiber
  INTERNALS.wipFiber.hooks.push(hook);
  wipFiber.hookIndex++;
  return [hook.state, setState];
}

function useEffect(effect, dependencies) {
  const wipFiber = INTERNALS.getWipFiber("useEffect()");
  const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[wipFiber.hookIndex];

  const hook = {
    deps: dependencies,
    effect,
    cleanup: oldHook ? oldHook.cleanup : null
  };

  wipFiber.hooks.push(hook);
  wipFiber.hookIndex++;
}

/**
 * Render virtual DOM (ReactElements) to the container
 *
 * @param vnode - Virtual DOM node
 * @param container - Container to render the virtual DOM
 */
function render(vnode, container) {
  /**
   * If we have currentRoot (the last commited fiber tree), we can use it as the starting point.
   * If not, we are doing initial render
   */

  if (!INTERNALS.currentRoot) {
    const rootFiber = createFiber(null, {}, null);
    rootFiber.dom = container;
    rootFiber.props.children = [vnode];
    INTERNALS.setCurrentRoot(rootFiber, "Initial render");
  }

  /**
   * Let's set the wipRoot to the currentRoot. We will create a new fiber tree starting from this root.
   */
  INTERNALS.setWipRoot(INTERNALS.getCurrentRoot("render()"));

  /**
   * We will set the nextUnitOfWork to the wipRoot. This will be the fiber we will work on next.
   */
  INTERNALS.setNextUnitOfWork(INTERNALS.wipRoot, "Initial render");

  // Reset deletions
  INTERNALS.deletions = [];

  // We can either flush the work immediately or schedule it to be flushed later
  flushSync();
}

export { render, useState, useEffect };
