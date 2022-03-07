import React, {
  useMemo,
  useState,
  useRef,
  HTMLAttributes,
  useEffect,
  useCallback
} from "react";
import ReactDom from "react-dom";
import { usePopper, StrictModifier } from "react-popper";
import type { Placement, PositioningStrategy } from "@popperjs/core";
import classnames from "classnames";
import { CSSTransition } from "react-transition-group";
import baseStyles from "./index.module.scss";
console.log(baseStyles);
export interface IPopup {
  children?: any;
  defaultPopupVisible?: boolean;
  popupVisible?: boolean;
  // Arrow
  withArrow?: boolean;
  arrowContent?: React.ReactElement;
  arrowClassName?: string;
  // Action
  trigger: Trigger;
  // Popup
  popup: React.ReactNode | ((a: any) => React.ReactNode);
  popupPlacement?: Placement;
  popupClassName?: string;
  getPopupFlipBoundary?: () => HTMLElement;
  // Mouse
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  // Event
  onPopupVisibleChange?: (visible: boolean) => void;
  // Poperjs
  modifiers?: StrictModifier[];
  strategy?: PositioningStrategy;
  virtualElement?: { getBoundingClientRect: any };
}
export type Trigger = "click" | "hover";
function PopUp(props: IPopup) {
  const {
    children,
    trigger = "hover",
    popupVisible,
    defaultPopupVisible,
    withArrow = false,
    arrowContent,
    arrowClassName,
    popup,
    popupPlacement = "top",
    popupClassName,
    getPopupFlipBoundary,
    // Event
    onPopupVisibleChange,
    // Poperjs
    modifiers,
    strategy = "absolute",
    mouseEnterDelay = 0, // s
    mouseLeaveDelay = 0.2,
    virtualElement
  } = props;
  const [visible, setVisible] = useState(popupVisible || defaultPopupVisible);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const mouseDownTimerRef = useRef<number | null>(null);
  const hasPopupMouseDownRef = useRef<boolean>(false);
  const poperModifiers = useMemo(() => {
    let tmpModifiers: StrictModifier[] = [
      { name: "offset", options: { offset: [0, withArrow ? 8 : 4] } }
    ];
    if (withArrow) {
      tmpModifiers.push({
        name: "arrow",
        options: { element: arrowElement, padding: 8 }
      });
    }
    if (getPopupFlipBoundary) {
      const popupRootBoundary = getPopupFlipBoundary();
      tmpModifiers.push({
        name: "flip",
        options: { boundary: popupRootBoundary }
      });
    }
    if (modifiers) {
      tmpModifiers = tmpModifiers.concat(modifiers);
    }
    return tmpModifiers;
  }, [withArrow, modifiers, getPopupFlipBoundary, arrowElement]);
  const { styles, attributes } = usePopper(
    virtualElement || referenceElement,
    popperElement,
    {
      modifiers: poperModifiers,
      placement: popupPlacement,
      strategy
    }
  );
  useEffect(() => {
    return () => {
      clearDelayTimer();
      clearMouseTimer();
    };
  }, []);
  useEffect(() => {
    if (popupVisible !== undefined) {
      setVisible(popupVisible);
    }
  }, [popupVisible]);
  const fireEvents = (type: string, e: Event) => {
    const callback = (props as any)[type];
    if (callback) {
      callback(e);
    }
  };
  const clearDelayTimer = () => {
    const timer = timerRef.current;
    if (timer) {
      clearTimeout(timer);
      timerRef.current = null;
    }
  };
  const clearMouseTimer = () => {
    const timer = mouseDownTimerRef.current;
    if (timer) {
      clearTimeout(timer);
      mouseDownTimerRef.current = null;
    }
  };
  const setPopupVisible = (popupVisible: boolean) => {
    const prevPopupVisible = visible;
    clearDelayTimer();
    if (prevPopupVisible !== popupVisible) {
      // has popupVisible its controll by outer
      if (!("popupVisible" in props)) {
        setVisible(popupVisible);
      }
      onPopupVisibleChange?.(popupVisible);
    }
  };
  const delaySetPopupVisible = (
    visible: boolean,
    delayS: number,
    event?: MouseEvent
  ) => {
    const delay = delayS * 1000;
    clearDelayTimer();
    if (delay) {
      timerRef.current = window.setTimeout(() => {
        setPopupVisible(visible);
        clearDelayTimer();
      }, delay);
    } else {
      setPopupVisible(visible);
    }
  };
  const open = () => {
    setPopupVisible(true);
  };
  const close = () => {
    setPopupVisible(false);
  };
  // clickoutside
  const handleClickOutside = useCallback(
    (event: any) => {
      if (!visible) return;
      if (
        !event.target ||
        !popperElement ||
        !referenceElement ||
        popperElement.contains(event.target) ||
        referenceElement.contains(event.target) ||
        hasPopupMouseDownRef.current
      ) {
        return;
      }
      setPopupVisible(false);
    },
    [visible, popperElement, referenceElement]
  );
  useEffect(() => {
    if (trigger === "click") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (trigger === "click") {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [handleClickOutside, trigger]);
  // Click
  const isClickToShow = () => {
    return trigger.indexOf("click") !== -1;
  };
  const isClickToHide = () => {
    return trigger.indexOf("click") !== -1;
  };
  const onClick = (event: any) => {
    fireEvents("onClick", event);
    if (isClickToShow() && isClickToHide() && event && event.preventDefault) {
      event.preventDefault();
    }
    const nextVisible = !visible;
    if ((isClickToHide() && !nextVisible) || (nextVisible && isClickToShow())) {
      setPopupVisible(nextVisible);
    }
  };
  // Mouse
  const isMouseEnterToShow = () => {
    return trigger.indexOf("hover") !== -1;
  };
  const isMouseLeaveToHide = () => {
    return trigger.indexOf("hover") !== -1;
  };
  const onMouseEnter = (e: any) => {
    delaySetPopupVisible(true, mouseEnterDelay, mouseEnterDelay ? null : e);
  };
  const onMouseLeave = (e: any) => {
    fireEvents("onMouseLeave", e);
    delaySetPopupVisible(false, mouseLeaveDelay);
  };
  const onPopupMouseLeave = (e: any) => {
    delaySetPopupVisible(false, mouseLeaveDelay);
  };
  const onPopupMouseEnter = () => {
    clearDelayTimer();
  };
  const onPopupMouseDown = () => {
    hasPopupMouseDownRef.current = true;
    clearMouseTimer();
    mouseDownTimerRef.current = window.setTimeout(() => {
      hasPopupMouseDownRef.current = false;
    }, 0);
  };
  const cssTransitionClassNames = useMemo(() => {
    return {
      enter: baseStyles.poperEnter,
      enterActive: baseStyles.poperEnterActive,
      exit: baseStyles.poperExit,
      exitActive: baseStyles.poperExitActive
    };
  }, []);
  const popupMouseProps: HTMLAttributes<HTMLElement> = {};
  const triggerMouseProps: HTMLAttributes<HTMLElement> = {};
  if (isMouseEnterToShow()) {
    popupMouseProps.onMouseEnter = onPopupMouseEnter;
    triggerMouseProps.onMouseEnter = onMouseEnter;
  }
  if (isMouseLeaveToHide()) {
    popupMouseProps.onMouseLeave = onPopupMouseLeave;
    triggerMouseProps.onMouseLeave = onMouseLeave;
  }
  popupMouseProps.onMouseDown = onPopupMouseDown;
  return (
    <>
      {!virtualElement && (
        <div
          {...triggerMouseProps}
          className={baseStyles.trigger}
          ref={setReferenceElement}
          onClick={onClick}
        >
          {typeof children === "function"
            ? children({ close, open, isOpen: visible })
            : children}
        </div>
      )}
      {ReactDom.createPortal(
        <CSSTransition
          in={visible}
          unmountOnExit
          timeout={10}
          classNames={cssTransitionClassNames}
          onExited={() => {
            setPopupVisible(false);
          }}
        >
          <div
            {...attributes.popper}
            {...popupMouseProps}
            ref={setPopperElement}
            style={styles.popper}
            className={classnames(baseStyles.poper, popupClassName)}
          >
            <div className={baseStyles.popperInner}>
              {typeof popup === "function"
                ? popup({ close, open, isOpen: visible })
                : popup}
            </div>
            {withArrow && (
              <div
                data-popper-arrow
                key="arrow"
                ref={setArrowElement}
                style={styles.arrow}
                className={classnames(baseStyles.arrow, arrowClassName)}
              >
                {arrowContent}
              </div>
            )}
          </div>
        </CSSTransition>,
        document.body
      )}
    </>
  );
}
export default PopUp;
