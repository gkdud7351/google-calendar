import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import WeekCalendar from "../../pages/WeekCalendar"
import MonthCalendar from "../../pages/MonthCalendar"
import './GoogleCalendar.scss'

const GoogleCalendar = () => {
  const pageMode = useSelector((state: RootState) => state.calendar.pageMode);
  return (
    <div className="google-calendar">
      {pageMode === 'weekly' ? <WeekCalendar /> : <MonthCalendar />}
    </div>
  )
}
export default GoogleCalendar