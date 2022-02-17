import "./styles.css";
import Popup from "./Popup";

export default function App() {
  return (
    <div className="App">
      <Popup
        trigger="click"
        withArrow
        arrowClassName="arrow"
        popup={
          <span className="pop">
            <span className="inner">go overlay</span>
          </span>
        }
        popupPlacement="bottom"
      >
        <span>trigger</span>
      </Popup>
    </div>
  );
}
