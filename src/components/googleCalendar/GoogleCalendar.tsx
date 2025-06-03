import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import WeekCalendar from "../../pages/WeekCalendar"
import MonthCalendar from "../../pages/MonthCalendar"

const GoogleCalendar = () => {
  const pageMode = useSelector((state: RootState) => state.calendar.pageMode);
  return (
    <>
      {pageMode === 'weekly' ? <WeekCalendar /> : <MonthCalendar />}
    </>
  )
}
export default GoogleCalendar