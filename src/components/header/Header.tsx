import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  setSelectedDate,
  setPageMode,
  moveWeek,
  moveMonth,
} from "../../features/calendar/calendarSlice";
import "./Header.scss";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.calendar.pageMode);
  const current = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: "weekly" | "monthly") => {
    dispatch(setPageMode(value));
    setDropdownOpen(false);
  };

  return (
    <header>
      <span className="logo">Calendar</span>
      <button
        className="btn-today"
        onClick={() => dispatch(setSelectedDate(new Date()))}
      >
        오늘
      </button>
      <p className="current">
        {current.getFullYear()}년 {current.getMonth() + 1}월
      </p>
      {mode === "weekly" ? (
        <div className="arrow-box">
          <button className="left" onClick={() => dispatch(moveWeek("prev"))}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="right" onClick={() => dispatch(moveWeek("next"))}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      ) : (
        <div className="arrow-box">
          <button className="left" onClick={() => dispatch(moveMonth("prev"))}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="right" onClick={() => dispatch(moveMonth("next"))}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
      <div className="select-box" ref={dropdownRef}>
        <div
          className="selected"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {mode === "weekly" ? "주" : "월"}
        </div>
        {dropdownOpen && (
          <div className="options">
            <div className="option" onClick={() => handleSelect("weekly")}>
              주
            </div>
            <div className="option" onClick={() => handleSelect("monthly")}>
              월
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
