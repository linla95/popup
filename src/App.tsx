import "./styles.css";
import Popup from "./Popup";

export default function App() {
  return (
    <div className="App">
      {
        [
          'top', 'bottom', 'left', 'right',
          'top-start', 'bottom-start', 'left-start', 'right-start',
          'top-end', 'bottom-end', 'left-end', 'right-end'
        ].map(direction =><Popup
          trigger="hover"
          withArrow
          arrowClassName="arrow"
          popup={
            <div className="pop">
              <span className="inner">overlay of {direction}</span>
            </div>
          }
          popupPlacement={direction}
        >
          <div className="trigger">{direction}</div>
        </Popup>)
      }
    </div>
  );
}
