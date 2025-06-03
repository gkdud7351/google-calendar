import { ko } from 'date-fns/locale';
import { DayPicker } from "react-day-picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store/store';
import { setSelectedDate } from '../../features/calendar/calendarSlice';
import "react-day-picker/style.css";
import './SideCalendar.scss'

const SideCalendar = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate);
  const events = useSelector((state: RootState) => state.calendar.events);

  const eventDates = Array.from(
    new Map(
      events
        .filter((e) => e.start)
        .map((e) => [new Date(e.start as Date).toDateString(), new Date(e.start as Date)])
    ).values()
  );

  return (
    <>
      <DayPicker
        animate
        locale={ko}
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date) dispatch(setSelectedDate(date));
        }}
        month={selectedDate}
        onMonthChange={(date) => dispatch(setSelectedDate(date))}
        modifiers={{
          today: new Date(),
          hasEvent: eventDates,
        }}
        modifiersClassNames={{
          today: 'today',
          hasEvent: 'has-event',
          currentSelected: 'selected'
        }}
      />
    </>
  )
}
export default SideCalendar