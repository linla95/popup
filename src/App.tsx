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
          <div className="pop">
            <span className="inner">go overlay</span>
          </div>
        }
        popupPlacement="right"
      >
        <div className="trigger">trigger</div>
      </Popup>
      <Popup
        trigger="click"
        withArrow
        arrowClassName="arrow"
        popup={
          <div className="pop">
            <span className="inner">go overlay</span>
          </div>
        }
        popupPlacement="right"
      >
        <div className="trigger">trigger</div>
      </Popup>
      <Popup
        trigger="click"
        withArrow
        arrowClassName="arrow"
        popup={
          <div className="pop">
            <span className="inner">go overlay</span>
          </div>
        }
        popupPlacement="right"
      >
        <span className="trigger">trigger</span>
      </Popup>
      <Popup
        trigger="click"
        withArrow
        arrowClassName="arrow"
        popup={
          <div className="pop">
            <span className="inner">go overlay</span>
          </div>
        }
        popupPlacement="right"
      >
        <span className="trigger">trigger</span>
      </Popup>
      <Popup
        trigger="click"
        withArrow
        arrowClassName="arrow"
        popup={
          <div className="pop">
            <span className="inner">go overlay</span>
          </div>
        }
        popupPlacement="right"
      >
        <div className="trigger">trigger</div>
      </Popup>
    </div>
  );
}
