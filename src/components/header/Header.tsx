import { useDispatch,useSelector } from "react-redux";
import { RootState } from '../../store/store';
import { setSelectedDate ,setPageMode, moveWeek, moveMonth } from "../../features/calendar/calendarSlice";
import './Header.scss'

const Header = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.calendar.pageMode);
  const current = useSelector((state:RootState) => state.calendar.selectedDate);

  return (
    <header>
      <span className="logo">Calendar</span>
      <button className="btn-today" onClick={() =>dispatch(setSelectedDate(new Date()))}>오늘</button>
      <p className="current">{current.getFullYear()}년 {current.getMonth()+1}월</p>
      {mode === 'weekly' ? (
      <div className="arrow-box">
        <button className="left" onClick={() => dispatch(moveWeek('prev'))}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="right" onClick={() => dispatch(moveWeek('next'))}>
           <i className="bi bi-chevron-right"></i>
        </button>
      </div>) : (
        <div className="arrow-box">
        <button className="left" onClick={() => dispatch(moveMonth('prev'))}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="right" onClick={() => dispatch(moveMonth('next'))}>
           <i className="bi bi-chevron-right"></i>
        </button>
      </div>
      )}
      <select
        value={mode}
        className="select-box"
        onChange={(e) => dispatch(setPageMode(e.target.value as 'weekly' | 'monthly'))}>
        <option className="week" value="weekly">주  ⏷</option>
        <option className="month" value="monthly">월  ⏷</option>
        </select>
    </header>
  )
}

export default Header